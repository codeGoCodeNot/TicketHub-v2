import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./aws";

const deleteFile = async (key: string) => {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    }),
  );
};

export default deleteFile;
