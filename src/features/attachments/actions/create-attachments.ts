"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import { AttachmentEntity } from "@/generated/prisma/enums";
import { ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";
import { ACCEPTED, MAX_SIZE } from "../constants";
import * as attachmentService from "../service";
import { isComment, isTicket } from "../types";
import { sizeInMB } from "../utils/size";

type CreateAttachmentsArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

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
  { entityId, entity }: CreateAttachmentsArgs,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  // service layer
  const subject = await attachmentService.getAttachmentSubject(
    entityId,
    entity,
  );

  if (!subject) return toActionState("ERROR", "Subject not found.");

  if (!isOwnership(user, subject))
    return toActionState(
      "ERROR",
      "You do not have permission to add attachments.",
    );

  try {
    const { files } = createAttachmentsSchema.parse({
      files: formData.getAll("files"),
    });

    await attachmentService.createAttachments({
      entity,
      entityId,
      subject,
      files,
      userId: user.id,
    });
  } catch (error) {
    return fromErrorToActionState(error);
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
