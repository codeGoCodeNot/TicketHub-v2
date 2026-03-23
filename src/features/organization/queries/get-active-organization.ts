import { getSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";

const getActiveOrganization = async () => {
  const session = await getSession();
  const activeOrganizationId = session?.session.activeOrganizationId;

  if (!activeOrganizationId) return null;

  return await prisma.organization.findUnique({
    where: {
      id: activeOrganizationId,
    },
  });
};

export default getActiveOrganization;
