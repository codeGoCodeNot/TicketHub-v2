import { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import getComments from "../../queries/get-comments";

type CacheArgs = {
  queryClient: QueryClient;
  queryKey: QueryKey;
};

const removeCommentFromCache = (
  { queryClient, queryKey }: CacheArgs,
  payload: { commentId: string },
) => {
  queryClient.setQueryData<
    InfiniteData<Awaited<ReturnType<typeof getComments>>>
  >(queryKey, (cache) => {
    if (!cache) return cache;
    return {
      ...cache,
      pages: cache.pages.map((page) => ({
        ...page,
        list: page.list.filter((comment) => comment.id !== payload.commentId),
      })),
    };
  });
};

export default removeCommentFromCache;
