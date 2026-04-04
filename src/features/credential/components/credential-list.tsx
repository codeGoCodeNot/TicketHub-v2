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
import CredentialRevokeButton from "./credential-revoke-button";

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
          <TableHead>Created By</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Last Used</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {credentials.map(
          ({ id, name, createdAt, lastUsed, revokedAt, createdBy }) => (
            <TableRow key={id}>
              <TableCell>{name}</TableCell>
              <TableCell>{createdBy?.name ?? "Deleted User"}</TableCell>
              <TableCell>{format(createdAt, "yyyy/MM/dd, hh:mm")}</TableCell>
              <TableCell>
                {lastUsed ? format(lastUsed, "yyyy/MM/dd, hh:mm") : "Never"}
              </TableCell>
              <TableCell>
                {revokedAt ? (
                  <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
                    Revoked
                  </span>
                ) : (
                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </TableCell>
              <TableCell>
                {!revokedAt && (
                  <CredentialRevokeButton
                    id={id}
                    organizationId={organizationId}
                  />
                )}
              </TableCell>
            </TableRow>
          ),
        )}
      </TableBody>
    </Table>
  );
};

export default CredentialList;
