import { AttachmentEntity } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

type CreateAttachmentArgs = {
  name: string;
  entity: AttachmentEntity;
  entityId: string;
  size: number;
  type: string;
  userId: string;
};

// data layer function to create attachment record in database

export const createAttachment = async ({
  name,
  entity,
  entityId,
  size,
  type,
  userId,
}: CreateAttachmentArgs) => {
  return await prisma.attachment.create({
    data: {
      name,
      size,
      type,
      userId,
      ...(entity === "TICKET" ? { ticketId: entityId } : {}),
      ...(entity === "COMMENT" ? { commentId: entityId } : {}),
      entity,
    },
  });
};
