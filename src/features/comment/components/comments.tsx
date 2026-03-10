"use client";

import CardCompact from "@/components/card-compact";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import getComments from "../queries/get-comments";
import { CommentWithMetadata } from "../type";
import CommentCreateForm from "./comment-create-form";
import CommentEditStateProvider from "./comment-edit-state";
import CommentItem from "./comment-item";
import { useEffect } from "react";

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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", ticketId],
      queryFn: ({ pageParam }) => getComments(ticketId, pageParam),
      initialPageParam: undefined as
        | { id: string; createdAt: number }
        | undefined,
      getNextPageParam: (lastpage) =>
        lastpage.metadata.hasNextPage ? lastpage.metadata.cursor : undefined,
      initialData: {
        pages: [
          {
            list: comments.list,
            metadata: comments.metadata,
          },
        ],
        pageParams: [undefined],
      },
    });

  const paginatedComments = data.pages.flatMap((page) => page.list);
  const queryClient = useQueryClient();

  const handleDelete = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });

  const handleCreateComment = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });

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
