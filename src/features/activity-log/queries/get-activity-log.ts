"use server";

import prisma from "@/lib/prisma";

type ActivityLogCursor = {
  id: string;
  createdAt: number;
};

const getActivityLogs = async (
  organizationId: string,
  cursor?: ActivityLogCursor,
) => {
  const take = 10;

  const logs = await prisma.activityLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    ...(cursor
      ? {
          cursor: { id: cursor.id },
          skip: 1,
        }
      : {}),
  });

  const hasNextPage = logs.length > take;
  const list = hasNextPage ? logs.slice(0, take) : logs;
  const lastItem = list[list.length - 1];

  return {
    list,
    metadata: {
      count: list.length,
      hasNextPage,
      cursor: lastItem
        ? { id: lastItem.id, createdAt: lastItem.createdAt.getTime() }
        : undefined,
    },
  };
};

export default getActivityLogs;
