import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import getComments from "../../queries/get-comments";
import { CommentWithMetadata } from "../../type";

type UsePaginatedCommentsProps = {
  comments: {
    list: CommentWithMetadata[];
    metadata: {
      count: number;
      hasNextPage?: boolean;
      cursor?: { id: string; createdAt: number };
    };
  };
};

const usePaginatedComments = (
  ticketId: string,
  comments: UsePaginatedCommentsProps["comments"],
) => {
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

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    paginatedComments,
    onHandleDelete: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] }),
    onHandleCreateComment: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] }),
    onHandleRefetchComments: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] }),
    onHandleDeleteCommentAttachment: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", ticketId] }),
  };
};

export default usePaginatedComments;
