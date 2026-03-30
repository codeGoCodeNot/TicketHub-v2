import { getOrganizationIdByAttachment } from "@/features/attachments/utils/attachment-helper";
import generateS3Key from "@/features/attachments/utils/generate-s3-key";
import s3 from "@/lib/aws";
import prisma from "@/lib/prisma";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> },
) => {
  const { attachmentId } = await params;

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: { id: attachmentId },
    include: {
      ticket: true,
      comment: {
        include: {
          ticket: true,
        },
      },
    },
  });

  const subject = attachment.ticket ?? attachment.comment;

  if (!subject)
    throw new Error("Attachment is not associated with a ticket or comment");

  const organizationId = getOrganizationIdByAttachment(
    attachment.entity,
    subject,
  );

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: generateS3Key({
        entityId: subject.id,
        entity: attachment.entity,
        attachmentId: attachment.id,
        filename: attachment.name,
        organizationId,
      }),
    }),
    { expiresIn: 5 * 60 },
  );

  return NextResponse.redirect(presignedUrl);
};

export { GET };
