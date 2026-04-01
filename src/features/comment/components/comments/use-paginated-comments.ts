import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
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

  const handleDeleteAttachment = (commentId: string, attachmentId: string) => {
    removeAttachmentFromCache(
      { queryClient, queryKey },
      { commentId, attachmentId },
    );
    queryClient.invalidateQueries({ queryKey });
  };

  const handleDeleteComment = (commentId: string) => {
    removeCommentFromCache({ queryClient, queryKey }, { commentId });
  };

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    paginatedComments,
    onHandleCreateComment: () => queryClient.invalidateQueries({ queryKey }),
    onHandleDeleteCommentAttachment: handleDeleteAttachment,
    onHandleDeleteComment: handleDeleteComment,
  };
};

export default usePaginatedComments;
