import prisma from "@/lib/prisma";

export const findMember = async (userId: string, organizationId: string) => {
  return await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
  });
};
