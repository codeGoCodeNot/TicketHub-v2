import getMembership from "@/features/membership/queries/get-membership";

type GetTicketPermissionProps = {
  organizationId: string;
  userId: string;
};

const getTicketPermission = async ({
  organizationId,
  userId,
}: GetTicketPermissionProps) => {
  if (!organizationId || !userId) return { canDeleteTickets: false };

  const membership = await getMembership({
    organizationId,
    userId,
  });

  if (!membership) return { canDeleteTickets: false };

  return {
    canDeleteTickets: membership.canDeleteTickets,
  };
};

export default getTicketPermission;
