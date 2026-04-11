"use server";

import fromErrorToActionState, {
  ActionState,
  toActionState,
} from "@/components/form/utils/to-action-state";
import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import isOwnership from "@/features/auth/utils/is-ownership";
import { AttachmentEntity } from "@/generated/prisma/enums";
import { organizationActivityLogPagePath, ticketPagePath } from "@/path";
import { revalidatePath } from "next/cache";
import z from "zod";
import { fileSchema } from "../schema/schema";
import * as attachmentService from "../service";
import { isComment, isTicket } from "../types";
import prisma from "@/lib/prisma";

type CreateAttachmentsArgs = {
  entityId: string;
  entity: AttachmentEntity;
};

const createAttachmentsSchema = z.object({
  files: fileSchema
    .refine((files) => files.length !== 0, "File is required.")
    .refine((files) => files.length > 0, "Please select at least one file."),
});

const createAttachments = async (
  { entityId, entity }: CreateAttachmentsArgs,
  _actionState: ActionState,
  formData: FormData,
) => {
  const user = await getAuthOrRedirect();

  let organizationId;

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

    const maybeOrganizationId = isTicket(subject)
      ? subject.organizationId
      : subject.ticket.organizationId;

    organizationId = maybeOrganizationId;

    await prisma.activityLog.create({
      data: {
        organizationId,
        action: "attachment_created",
        detail: `${user.name} added ${files.length} attachment(s) to ${entity.toLowerCase()} ${entityId}.`,
      },
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

  if (organizationId)
    revalidatePath(organizationActivityLogPagePath(organizationId));

  return toActionState("SUCCESS", "Attachments uploaded successfully.");
};

export default createAttachments;
