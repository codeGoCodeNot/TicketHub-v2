import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { CommentWithMetadata } from "../type";
import CommentDeleteButton from "./comment-delete-button";
import getAuth from "@/features/auth/actions/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";

type CommentItemProps = {
  comment: CommentWithMetadata;
};

const CommentItem = async ({ comment }: CommentItemProps) => {
  const user = await getAuth();

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
          </p>
        </div>
        <p className="text-muted-foreground">{comment.content}</p>
      </Card>
      <div className="flex flex-col gap-y-1">
        {isOwnership(user, comment) && <CommentDeleteButton id={comment.id} />}
      </div>
    </div>
  );
};

export default CommentItem;
