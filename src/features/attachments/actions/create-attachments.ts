"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import prisma from "@/lib/prisma";
import { ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z, { file } from "zod";
import { sizeInMB } from "../utils/size";
import { ACCEPTED, MAX_SIZE } from "../constants";
import s3 from "@/lib/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { organization } from "better-auth/plugins";
import generateS3Key from "../utils/generate-s3-key";

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

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    for (const file of files) {
      const buffer = await Buffer.from(await file.arrayBuffer());

      const attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          ticketId,
        },
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId: ticket.organizationId,
            ticketId,
            filename: file.name,
            attachmentId: attachment.id,
          }),
          Body: buffer,
          ContentType: file.type,
        }),
      );
    }
  } catch (error) {
    return fromErrorToActionState(error);
  }

  revalidatePath(ticketPagePath(ticketId));
  return toActionState("SUCCESS", "Attachments uploaded successfully.");
};

export default createAttachments;
