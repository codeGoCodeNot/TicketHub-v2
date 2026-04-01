import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./aws";

type uploadFileArgs = {
  key: string;
  buffer: Buffer;
  contentType: string;
};

const uploadFile = async ({ key, buffer, contentType }: uploadFileArgs) => {
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );
};

export default uploadFile;
