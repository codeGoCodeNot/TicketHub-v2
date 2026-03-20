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
      organization: true,
    },
  });

  return organizations;
};

export default getOrganizationsByUser;
