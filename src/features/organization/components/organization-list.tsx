import { format } from "date-fns";
import getOrganizationsByUser from "../queries/get-organizations-by-user";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  LucideArrowLeftRight,
  LucideArrowUpRightFromSquare,
  LucidePen,
  LucideTrash,
} from "lucide-react";

const OrganizationList = async () => {
  const organizations = await getOrganizationsByUser();

  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
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
          const switchButton = (
            <Button variant="outline" size="icon">
              <LucideArrowLeftRight />
            </Button>
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
              {detailButton}
              {editButton}
              {deleteButton}
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
