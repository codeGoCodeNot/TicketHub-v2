import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AttachmentList from "@/features/attachments/components/attachment-list";
import { CommentWithMetadata } from "../type";
import CommentDeleteButton from "./comment-delete-button";
import CommentEditInline from "./comment-edit-inline";
import CommentEditTriggerButton from "./comment-edit-trigger-button";

type CommentItemProps = {
  comment: CommentWithMetadata;
  onHandleDeleteCommentAttachment?: (
    commentId: string,
    attachmentId: string,
  ) => void;
  onHandleDeleteComment?: (commentId: string) => void;
  onHandleUpdateComment?: () => void;
};

const CommentItem = ({
  comment,
  onHandleDeleteCommentAttachment,
  onHandleDeleteComment,
  onHandleUpdateComment,
}: CommentItemProps) => {
  const isEdited =
    new Date(comment.updatedAt).getTime() >
    new Date(comment.createdAt).getTime();

  return (
    <Card className="w-full transition-shadow hover:shadow-md">
      <CardHeader className="gap-y-2">
        <div className="flex items-center justify-between gap-x-2">
          <div className="flex items-center gap-x-2 min-w-0">
            <Avatar className="size-6 shrink-0">
              <AvatarImage
                src={comment.user.image ?? undefined}
                alt={comment.user.name || "User Avatar"}
              />
              <AvatarFallback className="text-xs">
                {comment.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">
              {comment.user.name?.split(" ")[0]}
            </span>
          </div>

          <div className="flex items-center gap-x-1 shrink-0">
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {isEdited && " · edited"}
            </span>
            {comment.isOwner && (
              <>
                <CommentEditTriggerButton commentId={comment.id} />
                <CommentDeleteButton
                  id={comment.id}
                  onHandleDelete={onHandleDeleteComment}
                />
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CommentEditInline
          commentId={comment.id}
          content={comment.content}
          isOwner={comment.isOwner}
          onUpdate={onHandleUpdateComment}
        />

        {comment.attachments.length > 0 && (
          <>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground mb-1.5">Attachments</p>
            <AttachmentList
              attachments={comment.attachments}
              isOwner={comment.isOwner}
              onDeleteAttachment={(attachmentId) =>
                onHandleDeleteCommentAttachment?.(comment.id, attachmentId)
              }
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentItem;
