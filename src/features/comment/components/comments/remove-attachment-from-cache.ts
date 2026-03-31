import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import getComments from "../../queries/get-comments";

type CacheArgs = {
  queryClient: QueryClient;
  queryKey: QueryKey;
};

const removeAttachmentFromCache = (
  { queryClient, queryKey }: CacheArgs,
  payload: { commentId: string; attachmentId: string },
) => {
  queryClient.setQueryData<
    InfiniteData<Awaited<ReturnType<typeof getComments>>>
  >(queryKey, (cache) => {
    if (!cache) return cache;
    return {
      ...cache,
      pages: cache.pages.map((page) => ({
        ...page,
        list: page.list.map((comment) =>
          comment.id === payload.commentId
            ? {
                ...comment,
                attachments: comment.attachments.filter(
                  (attachment) => attachment.id !== payload.attachmentId,
                ),
              }
            : comment,
        ),
      })),
    };
  });
};

export default removeAttachmentFromCache;
