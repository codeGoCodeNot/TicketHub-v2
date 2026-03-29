import CardCompact from "@/components/card-compact";
import AttachmentCreateForm from "./attachment-create-form";
import getAttachments from "../queries/get-attachments";
import AttachmentItem from "./attachment-item";
import AttachmentDeleteButton from "./attachment-delete-button";

type AttachmentsProps = {
  ticketId: string;
  isOwner: boolean;
};

const Attachments = async ({ ticketId, isOwner }: AttachmentsProps) => {
  const attachments = await getAttachments(ticketId);

  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDF"
      content={
        <>
          <div className="mx-2 flex flex-col gap-y-2 mb-4">
            {attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                buttons={[
                  ...(isOwner
                    ? [<AttachmentDeleteButton id={attachment.id} key="0" />]
                    : []),
                ]}
              />
            ))}
          </div>
          {isOwner && <AttachmentCreateForm ticketId={ticketId} />}
        </>
      }
    />
  );
};

export default Attachments;
