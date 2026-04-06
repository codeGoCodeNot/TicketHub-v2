import { CREDENTIAL_SCOPES, hasScope } from "@/features/credential/constants";
import getTicket from "@/features/tickets/queries/get-ticket";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/utils/password";

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ ticketId: string }> },
) => {
  const ticket = await getTicket((await params).ticketId);

  return Response.json({ ticket });
};

export const DELETE = async (
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> },
) => {
  const apiKey = request.headers.get("Authorization")?.replace("Bearer ", "");

  if (!apiKey) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { ticketId } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (!ticket)
    return Response.json({ error: "Ticket not found" }, { status: 404 });

  const credentials = await prisma.credential.findMany({
    where: { organizationId: ticket.organizationId, revokedAt: null },
  });

  if (!credentials.length)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  let isValid = false;
  let matchCredential = null;

  for (const credential of credentials) {
    const valid = await verifyPassword({
      password: apiKey,
      hash: credential.secretHash,
    });

    if (valid) {
      isValid = true;
      matchCredential = credential;
      break;
    }
  }

  if (!isValid)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  if (!hasScope(matchCredential!.scopes, CREDENTIAL_SCOPES.DELETE_TICKET))
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.$transaction([
    prisma.credential.update({
      where: { id: matchCredential!.id },
      data: { lastUsed: new Date() },
    }),
    prisma.credentialUsage.create({
      data: {
        credentialId: matchCredential!.id,
        route: `DELETE /api/tickets/${ticketId}`,
        ipAddress: request.headers.get("x-forwarded-for") ?? null,
        userAgent: request.headers.get("user-agent") ?? null,
      },
    }),
    prisma.ticket.delete({
      where: { id: ticketId },
    }),
  ]);

  return Response.json({ ticketId });
};
