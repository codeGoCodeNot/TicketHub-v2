import prisma from "@/lib/prisma";

const getCredentials = async (organizationId: string) => {
  return await prisma.credential.findMany({
    where: {
      organizationId,
    },
    select: {
      id: true,
      createdAt: true,
      name: true,
      lastUsed: true,
      revokedAt: true,
      createdBy: {
        select: {
          name: true,
        },
      },
      scopes: true,
    },
  });
};

export default getCredentials;
