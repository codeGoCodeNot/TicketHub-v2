import s3 from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import generateS3Key from "../utils/generate-s3-key";

export type AttachmentDeletedEventArgs = {
  data: {
    attachmentId: string;
    organizationId: string;
    filename: string;
    ticketId: string;
  };
};

export const attachmentDeletedEvent = inngest.createFunction(
  {
    id: "attachment-deleted",
    triggers: { event: "app/attachment.deleted" },
  },
  async ({
    event,
  }: {
    event: { data: AttachmentDeletedEventArgs["data"] };
  }) => {
    const { attachmentId, organizationId, filename, ticketId } = event.data;

    try {
      await s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: generateS3Key({
            organizationId,
            attachmentId,
            filename,
            ticketId,
          }),
        }),
      );
    } catch (error) {
      return { event, body: false };
    }

    return { event, body: true };
  },
);
