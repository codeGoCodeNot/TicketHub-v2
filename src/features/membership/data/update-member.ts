import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export const updateMember = async (
  id: string,
  data: Prisma.MemberUpdateInput,
) => {
  return await prisma.member.update({
    where: {
      id,
    },
    data,
  });
};
