import prisma from "@/lib/prisma";

export const updateComment = async (id: string, content: string) => {
  return await prisma.comment.update({
    where: {
      id,
    },
    data: {
      content,
    },
  });
};
