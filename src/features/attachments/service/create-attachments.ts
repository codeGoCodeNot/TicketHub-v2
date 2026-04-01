import s3 from "@/lib/aws";
import prisma from "@/lib/prisma";

import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import { AttachmentEntity } from "@/generated/prisma/enums";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { AttachmentSubject } from "../types";
import { getOrganizationIdByAttachment } from "../utils/attachment-helper";
import generateS3Key from "../utils/generate-s3-key";

type CreatedAttachmentArgs = {
  subject: AttachmentSubject;
  entityId: string;
  entity: AttachmentEntity;
  files: File[];
  userId: string;
};

export const createAttachments = async ({
  subject,
  entityId,
  entity,
  files,
  userId,
}: CreatedAttachmentArgs) => {
  const user = await getAuthOrRedirect();

  // track created attachments and upload keys for cleanup in case of error
  const createdAttachments: { id: string }[] = [];
  const uploadedKeys: string[] = [];

  const attachments = [];

  try {
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const attachment = await prisma.attachment.create({
        data: {
          name: file.name,
          size: file.size,
          type: file.type,
          userId: userId,
          ...(entity === "TICKET" ? { ticketId: entityId } : {}),
          ...(entity === "COMMENT" ? { commentId: entityId } : {}),
          entity,
        },
      });

      // push to return created attachments in response
      attachments.push(attachment);

      // push to track created attachment for cleanup if upload fails
      createdAttachments.push(attachment);

      const organizationId = getOrganizationIdByAttachment(entity, subject);

      // generate key once and reuse
      const key = generateS3Key({
        organizationId,
        entityId,
        entity,
        filename: file.name,
        attachmentId: attachment.id,
      });

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: buffer,
          ContentType: file.type,
        }),
      );

      // push after successful upload to track for cleanup
      uploadedKeys.push(key);
    }
  } catch (error) {
    await Promise.all(
      uploadedKeys.map((key) =>
        s3
          .send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            }),
          )
          .catch(() => null),
      ),
    );
    await Promise.all(
      createdAttachments.map((attachment) =>
        prisma.attachment
          .delete({ where: { id: attachment.id } })
          .catch(() => null),
      ),
    );

    throw error;
  }
  return attachments;
};
