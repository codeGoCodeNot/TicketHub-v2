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

const createAttachments = async (
  ticketId: string,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket) return toActionState("ERROR", "Ticket not found.");

  if (!isOwnership(user, ticket))
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
          entity: "TICKET",
          userId: user.id,
          ticketId,
        },
      });

      // push to track created attachment for cleanup if upload fails
      createdAttachments.push(attachment);

      // generate key once and reuse
      const key = generateS3Key({
        organizationId: ticket.organizationId,
        ticketId,
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

  revalidatePath(ticketPagePath(ticketId));
  return toActionState("SUCCESS", "Attachments uploaded successfully.");
};

export default createAttachments;
