"use client";

import CardCompact from "@/components/card-compact";
import { CommentWithMetadata } from "../type";
import CommentCreateForm from "./comment-create-form";
import CommentEditStateProvider from "./comment-edit-state";
import CommentItem from "./comment-item";
import { Button } from "@/components/ui/button";
import getComments from "../queries/get-comments";
import { useState } from "react";

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
  const [paginatedComments, setHasPaginatedComments] = useState(comments.list);
  const [metadata, setMetadata] = useState(comments.metadata);

  const handleMore = async () => {
    const morePaginatedComments = await getComments(ticketId, metadata.cursor);
    const moreComments = morePaginatedComments.list;

    setHasPaginatedComments([...paginatedComments, ...moreComments]);
    setMetadata(morePaginatedComments.metadata);
  };

  const handleDelete = (id: string) => {
    setHasPaginatedComments((prev) =>
      prev.filter((comment) => comment.id !== id),
    );
  };

  const handleCreateComment = (comment: CommentWithMetadata) => {
    setHasPaginatedComments((prev) => [comment, ...prev]);
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
          />
        }
      />
      <CommentEditStateProvider>
        <div className="flex flex-col gap-y-2 ml-8 mt-2">
          {paginatedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onHandleDelete={handleDelete}
            />
          ))}
        </div>
      </CommentEditStateProvider>
      <div className="flex flex-col justify-center ml-8 text-sm text-muted-foreground underline">
        {metadata.hasNextPage ? (
          <Button variant="ghost" onClick={handleMore}>
            More
          </Button>
        ) : (
          <p className="text-right text-xs italic">No more comments.</p>
        )}
      </div>
    </>
  );
};

export default Comments;
