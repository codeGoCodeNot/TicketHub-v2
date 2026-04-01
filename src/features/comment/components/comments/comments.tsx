"use client";

import CardCompact from "@/components/card-compact";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { CommentWithMetadata } from "../../type";
import CommentCreateForm from "../comment-create-form";
import CommentEditStateProvider from "../comment-edit-state";
import CommentItem from "../comment-item";
import usePaginatedComments from "./use-paginated-comments";

type CommentsProps = {
  ticketId: string;
  comments: {
    list: CommentWithMetadata[];
    metadata: {
      count: number;
      hasNextPage?: boolean;
      cursor?: { id: string; createdAt: number };
    };
  };
};

const Comments = ({ ticketId, comments }: CommentsProps) => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    paginatedComments,
    onHandleDelete,
    onHandleCreateComment,
    onHandleDeleteCommentAttachment,
  } = usePaginatedComments(ticketId, comments);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  return (
    <>
      <CardCompact
        className="mb-1"
        title="Write a Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={onHandleCreateComment}
          />
        }
      />
      <CommentEditStateProvider>
        <div className="flex flex-col gap-y-2 ml-8 mt-2">
          {paginatedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onHandleDelete={onHandleDelete}
              onHandleDeleteCommentAttachment={onHandleDeleteCommentAttachment}
            />
          ))}
        </div>
      </CommentEditStateProvider>
      <div className="flex flex-col justify-center ml-8 text-sm text-muted-foreground underline">
        <div ref={ref}>
          {!hasNextPage && (
            <p className="text-right text-xs italic">No more comments.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Comments;
