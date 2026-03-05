import CardCompact from "@/components/card-compact";
import getAuth from "@/features/auth/actions/get-auth";
import getComments from "../queries/get-comments";
import CommentCreateForm from "./comment-create-form";
import CommentItem from "./comment-item";

type CommentsProps = {
  ticketId: string;
};

const Comments = async ({ ticketId }: CommentsProps) => {
  const comments = await getComments(ticketId);
  const user = await getAuth();

  return (
    <>
      <CardCompact
        className="mb-1"
        title="Create Comment"
        description="A new comment will be created"
        content={<CommentCreateForm ticketId={ticketId} />}
      />
      <div className="flex flex-col gap-y-2 ml-8 mt-2">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
};

export default Comments;
