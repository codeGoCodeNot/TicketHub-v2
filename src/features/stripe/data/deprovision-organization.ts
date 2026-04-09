import { inngest } from "@/lib/inngest";
import prisma from "@/lib/prisma";

export const deprovisionOrganization = async (
  organizationId: string,
  allowedMembers: number,
) => {
  const [members, invitations] = await Promise.all([
    prisma.member.findMany({
      where: { organizationId },
      orderBy: { createdAt: "asc" },
    }),

    prisma.invitation.findMany({
      where: { organizationId, status: "pending" },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const totalCount = members.length + invitations.length;

  if (totalCount <= allowedMembers) return;

  let excess = totalCount - allowedMembers;

  const invitesDelete = invitations.slice(0, excess);
  excess -= invitesDelete.length;

  const nonAdminsOrOwner = members.filter(
    (member) => member.role !== "admin" && member.role !== "owner",
  );
  const admins = members.filter((member) => member.role === "admin");

  const membersDelete = [
    ...nonAdminsOrOwner.slice(0, excess),
    ...admins.slice(0, Math.max(0, excess - nonAdminsOrOwner.length)),
  ];

  await prisma.$transaction([
    prisma.invitation.deleteMany({
      where: { id: { in: invitesDelete.map((invite) => invite.id) } },
    }),
    prisma.member.deleteMany({
      where: { id: { in: membersDelete.map((member) => member.id) } },
    }),
  ]);

  const removedCount = invitesDelete.length + membersDelete.length;

  if (removedCount > 0) {
    await inngest.send({
      name: "app/organization.deprovisioned",
      data: {
        organizationId,
        removedCount,
      },
    });
  }
};
