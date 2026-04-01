"use client";
import { Attachment } from "@/generated/prisma/client";
import { useEffect, useState } from "react";
import AttachmentItem from "./attachment-item";
import AttachmentDeleteButton from "./attachment-delete-button";

type AttachmentListProps = {
  attachments: Attachment[];
  isOwner: boolean;
  onDeleteAttachment?: (attachmentId: string) => void;
};

const AttachmentList = ({
  attachments,
  isOwner,
  onDeleteAttachment,
}: AttachmentListProps) => {
  const [items, setItems] = useState(attachments);

  useEffect(() => {
    setItems(attachments);
  }, [attachments]);

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((a) => a.id !== id));
    onDeleteAttachment?.(id);
  };

  return (
    <div className="mx-2 flex flex-col gap-y-2 mb-4">
      {items.map((attachment) => (
        <AttachmentItem
          key={attachment.id}
          attachment={attachment}
          buttons={[
            ...(isOwner
              ? [
                  <AttachmentDeleteButton
                    id={attachment.id}
                    key="0"
                    onDeleteAttachment={handleDelete}
                  />,
                ]
              : []),
          ]}
        />
      ))}
    </div>
  );
};

export default AttachmentList;
