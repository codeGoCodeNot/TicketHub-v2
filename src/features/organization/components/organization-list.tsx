import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
  LucideTrash,
} from "lucide-react";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import OrganizationSwitchButton from "./organization-switch-button";
import { getSession } from "@/lib/get-session";
import SubmitButton from "@/components/form/submit-button";

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
    <Table>
      <TableCaption>A list of your organizations</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Joined At</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.map(({ organization, membershipByUser }) => {
          const activeOrganizationId = session?.session.activeOrganizationId;
          const hasActive = organization.id === activeOrganizationId;
          const isActive = activeOrganizationId === organization.id;

          const switchButton = (
            <OrganizationSwitchButton
              organizationId={organization.id}
              trigger={
                <SubmitButton
                  variant={
                    !hasActive ? "secondary" : isActive ? "default" : "outline"
                  }
                  size="icon"
                  icon={<LucideArrowLeftRight />}
                />
              }
            />
          );
          const detailButton = (
            <Button variant="outline" size="icon">
              <LucideArrowUpRightFromSquare />
            </Button>
          );

          const editButton = (
            <Button variant="outline" size="icon">
              <LucidePen />
            </Button>
          );

          const deleteButton = (
            <Button variant="destructive" size="icon">
              <LucideTrash />
            </Button>
          );

          const buttons = (
            <>
              {switchButton}
              {!onlySwitch && detailButton}
              {!onlySwitch && editButton}
              {!onlySwitch && deleteButton}
            </>
          );

          return (
            <TableRow key={organization.id}>
              <TableCell>{organization.name}</TableCell>
              <TableCell>
                {format(membershipByUser.createdAt, "yyyy/MM/dd")}
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
  );
};

export default OrganizationList;
