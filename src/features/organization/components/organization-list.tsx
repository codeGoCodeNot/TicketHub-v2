import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { getSession } from "@/lib/get-session";
import { organizationMembershiPagePath } from "@/path";
import { format } from "date-fns";
import { LucideArrowUpRightFromSquare, LucidePen } from "lucide-react";
import Link from "next/link";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import OrganizationDeleteButton from "./organization-delete-button";
import OrganizationSwitchButton from "./organization-switch-button";
import OrganizationLeaveButton from "./organization-leave-button";
import OrganizationEditButton from "./organization-edit-button";
import ToolTip from "@/components/tool-tip";

type OrganizationListProps = {
  onlySwitch?: boolean;
};

const OrganizationList = async ({
  onlySwitch = false,
}: OrganizationListProps) => {
  const [session, organizations] = await Promise.all([
    getSession(),
    getOrganizationsByUser(),
  ]);

  return (
    <>
      {/* Mobile - Cards */}
      <div className="flex flex-col gap-2 lg:hidden">
        {organizations.map(({ organization, membershipByUser }) => {
          const activeOrganizationId = session?.session.activeOrganizationId;
          const isActive = activeOrganizationId === organization.id;
          const isAdminOrOwner = ["admin", "owner"].includes(
            membershipByUser.role,
          );
          const showActions = !onlySwitch && isAdminOrOwner;
          const switchButton = (
            <OrganizationSwitchButton
              organizationId={organization.id}
              isActive={isActive}
            />
          );

          return (
            <div
              key={organization.id}
              className="flex gap-x-1 w-full justify-center"
            >
              <Card className="max-w-[420px] w-full">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle className="font-semibold">
                    {organization.name}
                  </CardTitle>
                  {isActive && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-1 pt-0">
                  <CardDescription>
                    Joined:{" "}
                    {format(membershipByUser.createdAt, "yyyy/MM/dd, hh:mm")}
                  </CardDescription>
                  <CardDescription>
                    Members: {organization._count.members}
                  </CardDescription>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Organization ID: {organization.id}
                </CardFooter>
              </Card>
              <div className="flex flex-col gap-y-1">
                {switchButton}
                {<OrganizationLeaveButton organizationId={organization.id} />}
                {showActions && (
                  <Button variant="outline" size="icon" asChild>
                    <Link href={organizationMembershiPagePath(organization.id)}>
                      <LucideArrowUpRightFromSquare />
                    </Link>
                  </Button>
                )}
                {showActions && (
                  <OrganizationEditButton
                    organizationId={organization.id}
                    currentName={organization.name}
                  />
                )}
                {showActions && (
                  <OrganizationDeleteButton organizationId={organization.id} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop - Table */}
      <div className="hidden lg:block">
        <Table>
          <TableCaption>A list of your organizations</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Organization ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizations.map(({ organization, membershipByUser }) => {
              const activeOrganizationId =
                session?.session.activeOrganizationId;
              const isActive = activeOrganizationId === organization.id;
              const isAdminOrOwner = ["admin", "owner"].includes(
                membershipByUser.role,
              );
              const showActions = !onlySwitch && isAdminOrOwner;

              const switchButton = (
                <OrganizationSwitchButton
                  organizationId={organization.id}
                  isActive={isActive}
                />
              );

              const buttons = (
                <>
                  {switchButton}
                  {<OrganizationLeaveButton organizationId={organization.id} />}
                  {showActions && (
                    <ToolTip label="View organization memberships">
                      <Button variant="outline" size="icon" asChild>
                        <Link
                          href={organizationMembershiPagePath(organization.id)}
                        >
                          <LucideArrowUpRightFromSquare />
                        </Link>
                      </Button>
                    </ToolTip>
                  )}
                  {showActions && (
                    <OrganizationEditButton
                      organizationId={organization.id}
                      currentName={organization.name}
                    />
                  )}
                  {showActions && (
                    <OrganizationDeleteButton
                      organizationId={organization.id}
                    />
                  )}
                </>
              );

              return (
                <TableRow key={organization.id}>
                  <TableCell>{organization.id}</TableCell>
                  <TableCell>{organization.name}</TableCell>
                  <TableCell>
                    {format(membershipByUser.createdAt, "yyyy/MM/dd, hh:mm")}
                  </TableCell>
                  <TableCell>{organization._count.members}</TableCell>
                  <TableCell className="flex flex-shrink flex-wrap gap-1 min-w-0">
                    {buttons}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default OrganizationList;
