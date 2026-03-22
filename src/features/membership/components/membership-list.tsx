import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { format } from "date-fns/format";
import getMemberships from "../queries/get-memberships";
import MembershipDeleteButton from "./membership-delete-button";
import { LucideBan, LucideCheck } from "lucide-react";

type MembershipListProps = {
  organizationId: string;
};

const MembershipList = async ({ organizationId }: MembershipListProps) => {
  const memberships = await getMemberships(organizationId);
  return (
    <>
      {/* Mobile - Cards */}
      <div className="flex flex-col gap-2 lg:hidden">
        {memberships.map(({ user, createdAt, id, role, organizationId }) => {
          const deleteButton = (
            <MembershipDeleteButton
              organizationId={organizationId}
              memberId={id}
            />
          );
          return (
            <div key={id} className="flex gap-x-1 w-full justify-center">
              <Card className="max-w-[420px] w-full" size="sm">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
                  <CardTitle className="font-semibold">{user.name}</CardTitle>
                  <span className="text-xs capitalize bg-muted px-2 py-1 rounded-full">
                    {role}
                  </span>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 pt-0">
                  <CardDescription>{user.email}</CardDescription>
                  <CardDescription>
                    Joined: {format(createdAt, "yyyy/MM/dd, hh:mm")}
                  </CardDescription>
                  <CardDescription className="flex items-center gap-x-1">
                    Verified:{" "}
                    {user.emailVerified ? <LucideCheck /> : <LucideBan />}
                  </CardDescription>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-y-1">{deleteButton}</div>
            </div>
          );
        })}
      </div>
      {/* Desktop - Table */}
      <div className="hidden lg:block">
        <Table>
          <TableCaption>Membership List</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map(
              ({ user, createdAt, id, role, organizationId }) => {
                const deleteButton = (
                  <MembershipDeleteButton
                    organizationId={organizationId}
                    memberId={id}
                  />
                );

                return (
                  <TableRow key={id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{role}</TableCell>
                    <TableCell>
                      {format(createdAt, "yyyy/MM/dd, hh:mm")}
                    </TableCell>
                    <TableCell>
                      {user.emailVerified ? <LucideCheck /> : <LucideBan />}
                    </TableCell>
                    <TableCell>{deleteButton}</TableCell>
                  </TableRow>
                );
              },
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MembershipList;
