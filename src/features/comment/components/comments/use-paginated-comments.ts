import { useInfiniteQuery, useQueryClient, InfiniteData } from "@tanstack/react-query";
import getComments from "../../queries/get-comments";
import { CommentWithMetadata } from "../../type";
import removeAttachmentFromCache from "./remove-attachment-from-cache";
import removeCommentFromCache from "./remove-comment-from-cache";

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
  const queryKey = ["comments", ticketId];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey,
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

  const handleCreateComment = (comment: CommentWithMetadata) => {
    queryClient.setQueryData<
      InfiniteData<Awaited<ReturnType<typeof getComments>>>
    >(queryKey, (cache) => {
      if (!cache) return cache;
      const [first, ...rest] = cache.pages;
      return {
        ...cache,
        pages: [
          {
            ...first,
            list: [comment, ...first.list],
            metadata: { ...first.metadata, count: first.metadata.count + 1 },
          },
          ...rest,
        ],
      };
    });
  };

  const handleDeleteAttachment = (commentId: string, attachmentId: string) => {
    removeAttachmentFromCache(
      { queryClient, queryKey },
      { commentId, attachmentId },
    );
  };

  const handleDeleteComment = (commentId: string) => {
    removeCommentFromCache({ queryClient, queryKey }, { commentId });
  };

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    paginatedComments,
    onHandleCreateComment: handleCreateComment,
    onHandleDeleteCommentAttachment: handleDeleteAttachment,
    onHandleDeleteComment: handleDeleteComment,
    onHandleUpdateComment: () => queryClient.invalidateQueries({ queryKey }),
  };
};

export default usePaginatedComments;
