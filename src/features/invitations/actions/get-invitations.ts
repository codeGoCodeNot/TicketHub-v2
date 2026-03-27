import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";

const getInvitations = async (organizationId: string) => {
  await getAuthOrRedirect();

  return await prisma.invitation.findMany({
    where: {
      organizationId,
    },
    include: {
      user: {
        select: { name: true, email: true },
      },
    },
  });
};

export default getInvitations;
