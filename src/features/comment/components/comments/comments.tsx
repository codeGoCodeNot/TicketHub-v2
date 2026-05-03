"use client";

import CardCompact from "@/components/card-compact";
import { useEffect, useState } from "react";
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
      hasNextPage?: boolean;
      cursor?: { id: string; createdAt: number };
    };
  };
  currentUser: { id: string; name: string | null; image: string | null };
};

const Comments = ({ ticketId, comments, currentUser }: CommentsProps) => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    paginatedComments,
    onHandleCreateComment,
    onHandleDeleteCommentAttachment,
    onHandleDeleteComment,
    onHandleUpdateComment,
  } = usePaginatedComments(ticketId, comments);

  const { ref, inView } = useInView();
  const [pendingComment, setPendingComment] = useState<CommentWithMetadata | null>(null);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage]);

  const displayedComments = pendingComment
    ? [pendingComment, ...paginatedComments]
    : paginatedComments;

  const visibleComments = displayedComments.filter(
    (c) => !deletingIds.has(c.id),
  );

  const handleBeforeSubmit = (content: string) => {
    setPendingComment({
      id: `optimistic-${Date.now()}`,
      content,
      userId: currentUser.id,
      ticketId,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { name: currentUser.name, image: currentUser.image ?? null },
      attachments: [],
      isOwner: true,
    } as CommentWithMetadata);
  };

  const handleCreateComment = (comment: CommentWithMetadata) => {
    setPendingComment(null);
    onHandleCreateComment(comment);
  };

  const handleBeforeDeleteComment = (commentId: string) => {
    setDeletingIds((prev) => new Set([...prev, commentId]));
  };

  const handleRollbackDeleteComment = (commentId: string) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(commentId);
      return next;
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setDeletingIds((prev) => {
      const next = new Set(prev);
      next.delete(commentId);
      return next;
    });
    onHandleDeleteComment(commentId);
  };

  return (
    <>
      <CardCompact
        className="mb-1"
        title="Write a Comment"
        description="A new comment will be created"
        content={
          <CommentCreateForm
            ticketId={ticketId}
            onCreateComment={handleCreateComment}
            onBeforeSubmit={handleBeforeSubmit}
            onError={() => setPendingComment(null)}
          />
        }
      />
      <CommentEditStateProvider>
        <div className="flex flex-col gap-y-3 mt-2">
          {visibleComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onHandleDeleteCommentAttachment={onHandleDeleteCommentAttachment}
              onHandleDeleteComment={handleDeleteComment}
              onHandleUpdateComment={onHandleUpdateComment}
              onBeforeDeleteComment={handleBeforeDeleteComment}
              onRollbackDeleteComment={handleRollbackDeleteComment}
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
