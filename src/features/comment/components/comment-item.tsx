import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AttachmentList from "@/features/attachments/components/attachment-list";
import { CommentWithMetadata } from "../type";
import CommentDeleteButton from "./comment-delete-button";
import CommentEditInline from "./comment-edit-inline";
import CommentEditTriggerButton from "./comment-edit-trigger-button";

type CommentItemProps = {
  comment: CommentWithMetadata;
  onHandleDelete?: (id: string) => void;
  onHandleDeleteCommentAttachment?: (
    commentId: string,
    attachmentId: string,
  ) => void;
};

const CommentItem = ({
  comment,
  onHandleDelete,
  onHandleDeleteCommentAttachment,
}: CommentItemProps) => {
  // Show "(edited)" when the comment has been updated after creation.
  const isEdited =
    new Date(comment.updatedAt).getTime() >
    new Date(comment.createdAt).getTime();

  return (
    <div className="flex gap-x-1">
      <Card className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center">
            <Avatar>
              <AvatarImage
                src={comment.user.image ?? undefined}
                alt={comment.user.name || "User Avatar"}
              />
              <AvatarFallback>
                {comment.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <p className="text-muted-foreground text-xs">{comment.user.name}</p>
          </div>
          <p className="text-muted-foreground text-xs">
            {new Date(comment.createdAt).toLocaleString()}
            {isEdited && " (edited)"}
          </p>
        </div>

        <CommentEditInline
          commentId={comment.id}
          content={comment.content}
          isOwner={comment.isOwner}
        />

        {comment.attachments.length > 0 && (
          <>
            <Separator />
            <p className="text-xs text-muted-foreground">Attachments</p>
            <AttachmentList
              attachments={comment.attachments}
              isOwner={comment.isOwner}
              onDeleteAttachment={
                (attachmentId) =>
                  onHandleDeleteCommentAttachment?.(comment.id, attachmentId) // ← pass both ids
              }
            />
          </>
        )}
      </Card>

      <div className="flex flex-col gap-y-1">
        {/* Keep actions outside the form: Edit above Delete. */}
        {comment.isOwner && (
          <>
            <CommentEditTriggerButton commentId={comment.id} />

            <CommentDeleteButton
              id={comment.id}
              onHandleDelete={onHandleDelete}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
