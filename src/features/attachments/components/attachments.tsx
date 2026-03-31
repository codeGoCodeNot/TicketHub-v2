import CardCompact from "@/components/card-compact";
import AttachmentCreateForm from "./attachment-create-form";
import getAttachments from "../queries/get-attachments";
import AttachmentList from "./attachment-list";
import { AttachmentEntity } from "@/generated/prisma/enums";
import SubmitButton from "@/components/form/submit-button";

type AttachmentsProps = {
  entityId: string;
  isOwner: boolean;
  entity: AttachmentEntity;
};

const Attachments = async ({ entityId, isOwner, entity }: AttachmentsProps) => {
  const attachments = await getAttachments(entityId, entity);
  return (
    <CardCompact
      title="Attachments"
      description="Attached images or PDF"
      content={
        <>
          <AttachmentList attachments={attachments} isOwner={isOwner} />
          {isOwner && (
            <AttachmentCreateForm
              entityId={entityId}
              entity={entity}
              buttons={<SubmitButton label="Upload" />}
            />
          )}
        </>
      }
    />
  );
};

export default Attachments;
