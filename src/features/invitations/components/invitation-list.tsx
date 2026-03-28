import Placeholder from "@/components/placeholder";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns/format";
import { LucideTrash, LucideX } from "lucide-react";
import cancelInvitation from "../actions/cancel-invitation";
import deleteInvitation from "../actions/delete-invitation";
import getInvitations from "../actions/get-invitations";
import InvitationActionButton from "./invitation-action-button";

type InvitationListProps = {
  organizationId: string;
};

const InvitationList = async ({ organizationId }: InvitationListProps) => {
  const invitations = await getInvitations(organizationId);

  if (!invitations.length) return <Placeholder label="No invitations yet" />;

  // Badge variant logic for invitation status
  const getStatusBadgeVariant = (status: string) => {
    if (status === "accepted") return "default";
    if (status === "pending") return "secondary";
    return "outline";
  };

  return (
    <>
      {/* Mobile - Cards */}
      <div className="flex flex-col gap-2 lg:hidden">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex gap-x-1 w-full justify-center"
          >
            <Card className="max-w-[420px] w-full" size="sm">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
                <CardTitle className="font-semibold">
                  {invitation.email}
                </CardTitle>
                <Badge variant={getStatusBadgeVariant(invitation.status)}>
                  {invitation.status.charAt(0).toUpperCase() +
                    invitation.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-col gap-1 pt-0">
                <CardDescription>
                  Invited By: {invitation.user.name}
                </CardDescription>
                <CardDescription>
                  Invited At:{" "}
                  {format(invitation.createdAt, "yyyy/MM/dd, hh:mm")}
                </CardDescription>
              </CardContent>
            </Card>{" "}
            <div className="flex flex-col gap-y-1">
              <InvitationActionButton
                action={cancelInvitation.bind(null, {
                  email: invitation.email,
                  organizationId,
                })}
                title="Cancel Invitation"
                description="Are you sure you want to cancel this invitation?"
                icon={<LucideX />}
                variant="outline"
              />
              <InvitationActionButton
                action={deleteInvitation.bind(null, {
                  email: invitation.email,
                  organizationId,
                })}
                title="Delete Invitation"
                description={`Delete invitation for ${invitation.email}?`}
                icon={<LucideTrash />}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop - Table */}
      <div className="hidden lg:block">
        <Table>
          <TableCaption>List of organization invitations.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Invited At</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell>{invitation.email}</TableCell>
                <TableCell>
                  {format(invitation.createdAt, "yyyy/MM/dd, hh:mm")}
                </TableCell>
                <TableCell>{invitation.user.name}</TableCell>
                <TableCell className="capitalize">
                  <Badge variant={getStatusBadgeVariant(invitation.status)}>
                    {invitation.status.charAt(0).toUpperCase() +
                      invitation.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end items-center gap-x-1">
                  <InvitationActionButton
                    action={cancelInvitation.bind(null, {
                      email: invitation.email,
                      organizationId,
                    })}
                    title="Cancel Invitation"
                    description="Are you sure you want to cancel this invitation?"
                    icon={<LucideX />}
                    variant="outline"
                  />

                  <InvitationActionButton
                    action={deleteInvitation.bind(null, {
                      email: invitation.email,
                      organizationId,
                    })}
                    title="Delete Invitation"
                    description={`Delete invitation for ${invitation.email}?`}
                    icon={<LucideTrash />}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default InvitationList;
