import { Attachment } from "@/generated/prisma/client";
import { attachmentDownloadPagePath } from "@/path";
import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons?: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  return (
    <div className="flex justify-between items-center">
      <Link
        href={attachmentDownloadPagePath(attachment.id)}
        target="_blank"
        className="flex gap-x-2 items-center text-sm truncate"
      >
        <LucideArrowUpRightFromSquare />
        <p className="text-sm">{attachment.name}</p>
      </Link>
      {buttons}
    </div>
  );
};

export default AttachmentItem;
