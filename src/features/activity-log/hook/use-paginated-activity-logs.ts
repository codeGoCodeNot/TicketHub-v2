import { ActivityLog } from "@/generated/prisma/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import getActivityLogs from "../actions/get-activity-log";

type ActivityLogPage = {
  list: ActivityLog[];
  metadata: {
    count: number;
    hasNextPage?: boolean;
    cursor?: { id: string; createdAt: number };
  };
};

const usePaginatedActivityLogs = (
  organizationId: string,
  initialData: ActivityLogPage,
) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["activityLogs", organizationId],
      queryFn: ({ pageParam }) => getActivityLogs(organizationId, pageParam),
      initialPageParam: undefined as
        | { id: string; createdAt: number }
        | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.metadata.hasNextPage ? lastPage.metadata.cursor : undefined,
      initialData: {
        pages: [initialData],
        pageParams: [undefined],
      },
    });

  return {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    paginatedLogs: data.pages.flatMap((page) => page.list),
  };
};

export default usePaginatedActivityLogs;
