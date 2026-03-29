type GenerateS3Args = {
  organizationId: string;
  ticketId: string;
  filename: string;
  attachmentId: string;
};

const generateS3Key = ({
  organizationId,
  ticketId,
  filename,
  attachmentId,
}: GenerateS3Args) => {
  return `${organizationId}/${ticketId}/${filename}-${attachmentId}`;
};

export default generateS3Key;
