import prisma from "@/lib/prisma";

const getCredentialUsages = async (organizationId: string) => {
  return prisma.credentialUsage.findMany({
    where: {
      credential: {
        organizationId,
      },
    },
    orderBy: {
      usedAt: "desc",
    },
    take: 10,
    include: {
      credential: {
        select: {
          name: true,
        },
      },
    },
  });
};

export default getCredentialUsages;
