import prisma from "@/lib/prisma";

const getActivityLogs = (organizationId: string) => {
  return prisma.activityLog.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};

export default getActivityLogs;
