import s3 from "@/lib/aws";
import { inngest } from "@/lib/inngest";
import { DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

export const eventOrganizationDeleted = inngest.createFunction(
  {
    id: "organization-deleted",
    triggers: { event: "app/organization.deleted" },
  },
  async ({ event }: { event: { data: { organizationId: string } } }) => {
    const { organizationId } = event.data;

    const listed = await s3.send(
      new ListObjectsV2Command({
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: `${organizationId}/`,
      }),
    );

    if (!listed.Contents?.length) return { event, body: true };

    // delete all attachments related to the organization
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
          Objects: listed.Contents.map((item) => ({ Key: item.Key! })),
        },
      }),
    );

    return { event, body: true };
  },
);
