import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";

const getMemberships = async (organizationId: string) => {
  await getAuthOrRedirect();

  const members = await prisma.member.findMany({
    where: {
      organizationId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
        },
      },
    },
  });

  return members;
};

export default getMemberships;
