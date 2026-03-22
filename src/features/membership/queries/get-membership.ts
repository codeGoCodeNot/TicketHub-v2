import prisma from "@/lib/prisma";

type GetMembershipParams = { organizationId: string; userId: string };

const getMembership = async ({
  organizationId,
  userId,
}: GetMembershipParams) => {
  const members = await prisma.member.findFirst({
    where: {
      organizationId,
      userId,
    },
  });

  return members;
};

export default getMembership;
