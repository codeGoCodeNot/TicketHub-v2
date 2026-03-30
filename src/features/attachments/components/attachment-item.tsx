import { Attachment } from "@/generated/prisma/client";
import { attachmentDownloadPagePath } from "@/path";
import { LucideArrowUpRightFromSquare } from "lucide-react";
import Link from "next/link";
import getFileIcon from "../utils/get-file-icon";
import { cn } from "@/lib/utils";

type AttachmentItemProps = {
  attachment: Attachment;
  buttons?: React.ReactNode[];
};

const AttachmentItem = ({ attachment, buttons }: AttachmentItemProps) => {
  const { icon: FileIcon, className } = getFileIcon(attachment.name);

  return (
    <div className="flex justify-between items-center">
      <Link
        href={attachmentDownloadPagePath(attachment.id)}
        target="_blank"
        className="flex gap-x-2 items-center text-sm truncate"
      >
        <LucideArrowUpRightFromSquare className="shrink-0" />
        <FileIcon className={cn("size-4 shrink-0", className)} />
        <p className="text-sm">{attachment.name}</p>
      </Link>
      {buttons}
    </div>
  );
};

export default AttachmentItem;
