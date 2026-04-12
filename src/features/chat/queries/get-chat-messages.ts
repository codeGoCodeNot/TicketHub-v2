import getAuthOrRedirect from "@/features/auth/queries/get-auth-or-redirect";
import prisma from "@/lib/prisma";

const getChatMessages = async () => {
  const user = await getAuthOrRedirect();

  return prisma.chatMessage.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 50,
  });
};

export default getChatMessages;
