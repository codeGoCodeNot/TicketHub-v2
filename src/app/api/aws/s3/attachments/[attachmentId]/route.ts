import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "@/lib/aws";
import generateS3Key from "@/features/attachments/utils/generate-s3-key";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> },
) => {
  const { attachmentId } = await params;

  const attachment = await prisma.attachment.findUniqueOrThrow({
    where: { id: attachmentId },
    include: { ticket: true },
  });

  const presignedUrl = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: generateS3Key({
        ticketId: attachment.ticketId,
        attachmentId: attachment.id,
        filename: attachment.name,
        organizationId: attachment.ticket.organizationId,
      }),
    }),
    { expiresIn: 5 * 60 },
  );

  return NextResponse.redirect(presignedUrl);
};

export { GET };
