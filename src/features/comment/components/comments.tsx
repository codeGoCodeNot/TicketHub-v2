import CardCompact from "@/components/card-compact";
import { CommentWithMetadata } from "../type";
import CommentCreateForm from "./comment-create-form";
import CommentEditStateProvider from "./comment-edit-state";
import CommentItem from "./comment-item";
import { Button } from "@/components/ui/button";

type CommentsProps = {
  ticketId: string;
  comments?: CommentWithMetadata[];
};

const Comments = async ({ ticketId, comments }: CommentsProps) => {
  console.log("Where am i displayed?. comments page");

  return (
    <>
      <CardCompact
        className="mb-1"
        title="Write a Comment"
        description="A new comment will be created"
        content={<CommentCreateForm ticketId={ticketId} />}
      />
      <CommentEditStateProvider>
        <div className="flex flex-col gap-y-2 ml-8 mt-2">
          {comments?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </CommentEditStateProvider>
      <div className="flex flex-col justify-center ml-8">
        <Button variant="ghost">More</Button>
      </div>
    </>
  );
};

export default Comments;
