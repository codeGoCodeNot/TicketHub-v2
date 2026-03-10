"use client";

import CardCompact from "@/components/card-compact";
import { Button } from "@/components/ui/button";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import getComments from "../queries/get-comments";
import { CommentWithMetadata } from "../type";
import CommentCreateForm from "./comment-create-form";
import CommentEditStateProvider from "./comment-edit-state";
import CommentItem from "./comment-item";

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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
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

  const handleMore = () => fetchNextPage();

  const handleDelete = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });

  const handleCreateComment = () =>
    queryClient.invalidateQueries({ queryKey: ["comments", ticketId] });

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
        {hasNextPage ? (
          <Button
            variant="ghost"
            onClick={handleMore}
            disabled={isFetchingNextPage}
          >
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
