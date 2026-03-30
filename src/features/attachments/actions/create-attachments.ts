"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import s3 from "@/lib/aws";
import prisma from "@/lib/prisma";
import { ticketPagePath } from "@/path";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import z from "zod";
import { ACCEPTED, MAX_SIZE } from "../constants";
import generateS3Key from "../utils/generate-s3-key";
import { sizeInMB } from "../utils/size";
import { AttachmentEntity } from "@/generated/prisma/enums";
import { isComment, isTicket } from "../types";

const createAttachmentsSchema = z.object({
  files: z
    .custom<FileList>()
    .transform((files) => Array.from(files))
    .transform((files) => files.filter((file) => file.size > 0))
    .refine(
      (files) => files.every((file) => sizeInMB(file.size) <= MAX_SIZE),
      `The maximum file size is ${MAX_SIZE} MB.`,
    )
    .refine(
      (files) => files.every((file) => ACCEPTED.includes(file.type)),
      `Only the following file types are allowed: ${ACCEPTED.join(", ")}.`,
    )
    .refine((files) => files.length > 0, "Please select at least one file."),
});

type CreateAttachmentsArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

const createAttachments = async (
  { entityId, entity }: CreateAttachmentsArgs,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  let subject;

  switch (entity) {
    case "TICKET":
      subject = await prisma.ticket.findUnique({
        where: { id: entityId },
      });
      break;
    case "COMMENT":
      subject = await prisma.comment.findUnique({
        where: { id: entityId },
        include: { ticket: true },
      });
      break;
    default:
      return toActionState("ERROR", "Subject not found.");
  }

  if (!subject) return toActionState("ERROR", "Subject not found.");

  if (!isOwnership(user, subject))
    return toActionState(
      "ERROR",
      "You do not have permission to add attachments.",
    );

  // track created attachments and upload keys for cleanup in case of error
  const createdAttachments: { id: string }[] = [];
  const uploadedKeys: string[] = [];

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          size: file.size,
          type: file.type,
          userId: user.id,
          ...(entity === "TICKET" ? { ticketId: entityId } : {}),
          ...(entity === "COMMENT" ? { commentId: entityId } : {}),
          entity,
        },
      });

      // push to track created attachment for cleanup if upload fails
      createdAttachments.push(attachment);

      let organizationId = "";

      switch (entity) {
        case "TICKET": {
          if (isTicket(subject)) organizationId = subject.organizationId;
          break;
        }
        case "COMMENT": {
          if (isComment(subject))
            organizationId = subject.ticket.organizationId;
          break;
        }
      }

      // generate key once and reuse
      const key = generateS3Key({
        organizationId,
        entityId,
        entity,
        filename: file.name,
        attachmentId: attachment.id,
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      // push after successful upload to track for cleanup
      uploadedKeys.push(key);
    }
  } catch (error) {
    await Promise.all(
      uploadedKeys.map((key) =>
        s3
          .send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            }),
          )
          .catch(() => null),
      ),
    );
    await Promise.all(
      createdAttachments.map((attachment) =>
        prisma.attachment
          .delete({ where: { id: attachment.id } })
          .catch(() => null),
      ),
    );

    return fromErrorToActionState(error, formData);
  }

  switch (entity) {
    case "TICKET":
      if (isTicket(subject)) revalidatePath(ticketPagePath(subject.id));
      break;
    case "COMMENT":
      if (isComment(subject)) revalidatePath(ticketPagePath(subject.ticket.id));
  }

  return toActionState("SUCCESS", "Attachments uploaded successfully.");
};

export default createAttachments;
