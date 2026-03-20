import getAuth from "@/lib/get-auth";
import prisma from "@/lib/prisma";

const getOrganizationsByUser = async () => {
  const user = await getAuth();

  if (!user) return [];

  const organizations = await prisma.member.findMany({
    where: {
      userId: user.id,
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      organization: {
        include: {
          members: {
            where: {
              userId: user.id,
            },
          },
          _count: {
            select: {
              members: true,
              invitations: true,
            },
          },
        },
      },
    },
  });

  return organizations.map((org) => ({
    ...org,
    membershipByUser: org.organization.members[0],
  }));
};

export default getOrganizationsByUser;
