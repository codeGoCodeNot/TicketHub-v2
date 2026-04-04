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
import getCredentials from "../actions/get-credentials";

type CredentialListProps = {
  organizationId: string;
};

const CredentialList = async ({ organizationId }: CredentialListProps) => {
  const credentials = await getCredentials(organizationId);

  return (
    <Table>
      <TableCaption>Credential List</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Used</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map(({ id, name, createdAt, lastUsed }) => (
          <TableRow key={id}>
            <TableCell>{name}</TableCell>
            <TableCell>{format(createdAt, "yyyy/MM/dd, hh:mm")}</TableCell>
            <TableCell>
              {lastUsed ? format(lastUsed, "yyyy/MM/dd, hh:mm") : "Never"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CredentialList;
