import { Attachment } from "@/generated/prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
};

const AttachmentItem = ({ attachment }: AttachmentItemProps) => {
  return <p className="text-sm">{attachment.name}</p>;
};

export default AttachmentItem;
