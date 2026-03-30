import { AttachmentEntity } from "@/generated/prisma/enums";

type GenerateS3Args = {
  organizationId: string;
  entityId: string;
  entity: AttachmentEntity;
  filename: string;
  attachmentId: string;
};

const generateS3Key = ({
  organizationId,
  entityId,
  entity,
  filename,
  attachmentId,
}: GenerateS3Args) => {
  return `${organizationId}/${entity}/${entityId}/${filename}-${attachmentId}`;
};

export default generateS3Key;
