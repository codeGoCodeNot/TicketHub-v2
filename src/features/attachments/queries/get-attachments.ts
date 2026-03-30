import { AttachmentEntity } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

const getAttachments = async (entityId: string, entity: AttachmentEntity) => {
  switch (entity) {
    case "TICKET":
      return await prisma.attachment.findMany({
        where: {
          ticketId: entityId,
        },
      });
    case "COMMENT": {
      return await prisma.attachment.findMany({
        where: {
          commentId: entityId,
        },
      });
    }
    default: {
      return [];
    }
  }
};

export default getAttachments;
