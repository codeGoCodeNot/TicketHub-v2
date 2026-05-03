import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
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
import { organizationMembershipPagePath } from "@/path";
import { format } from "date-fns";
import {
  LucideArrowUpRightFromSquare,
  LucideCalendar,
  LucideUsers,
} from "lucide-react";
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
      <div className="flex flex-col gap-3 lg:hidden">
        {organizations.map(({ organization, membershipByUser }) => {
          const activeOrganizationId = session?.session.activeOrganizationId;
          const isActive = activeOrganizationId === organization.id;
          const isAdminOrOwner = ["admin", "owner"].includes(
            membershipByUser.role,
          );
          const showActions = !onlySwitch && isAdminOrOwner;

          return (
            <div key={organization.id} className="flex justify-center w-full">
              <Card className="max-w-[420px] w-full transition-shadow hover:shadow-md">
                <CardHeader className="gap-y-2">
                  <div className="flex items-center justify-between gap-x-2">
                    <div className="flex items-center gap-x-2 min-w-0">
                      <Avatar className="size-6 shrink-0">
                        <AvatarFallback className="text-xs">
                          {organization.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-semibold truncate">
                        {organization.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-x-1 shrink-0">
                      {isActive && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-sm border-0 text-xs font-medium"
                        >
                          Active
                        </Badge>
                      )}
                      <OrganizationSwitchButton
                        organizationId={organization.id}
                        isActive={isActive}
                      />
                      <OrganizationLeaveButton
                        organizationId={organization.id}
                      />
                      {showActions && (
                        <ToolTip label="View organization memberships">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                            asChild
                          >
                            <Link
                              href={organizationMembershipPagePath(
                                organization.id,
                              )}
                            >
                              <LucideArrowUpRightFromSquare className="size-4" />
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
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center gap-x-4">
                    <div className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                      <LucideCalendar className="size-3.5 shrink-0" />
                      <span>
                        {format(membershipByUser.createdAt, "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
                      <LucideUsers className="size-3.5 shrink-0" />
                      <span>
                        {organization._count.members}{" "}
                        {organization._count.members === 1
                          ? "member"
                          : "members"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Joined</TableHead>
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

              const buttons = (
                <>
                  <OrganizationSwitchButton
                    organizationId={organization.id}
                    isActive={isActive}
                  />
                  <OrganizationLeaveButton organizationId={organization.id} />
                  {showActions && (
                    <ToolTip label="View organization memberships">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        asChild
                      >
                        <Link
                          href={organizationMembershipPagePath(organization.id)}
                        >
                          <LucideArrowUpRightFromSquare className="size-4" />
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
                  <TableCell>
                    <ToolTip label={organization.id}>
                      <span className="font-mono text-xs text-muted-foreground cursor-default">
                        {organization.id.slice(0, 8)}…
                      </span>
                    </ToolTip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-x-2">
                      <Avatar className="size-6 shrink-0">
                        <AvatarFallback className="text-xs">
                          {organization.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {organization.name}
                      </span>
                      {isActive && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-sm border-0 text-xs font-medium"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">
                      {format(membershipByUser.createdAt, "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-medium">
                      {organization._count.members}
                    </span>
                  </TableCell>
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
