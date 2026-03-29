import { Attachment } from "@/generated/prisma/client";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons?: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <p className="text-sm">{attachment.name}</p>
      {buttons}
    </div>
  );
};

export default AttachmentItem;
