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
import getCredentials from "../actions/get-credentials";
import CredentialRevokeButton from "./credential-revoke-button";
import { stringToScopes } from "../constants";

type CredentialListProps = {
  organizationId: string;
};

const CredentialList = async ({ organizationId }: CredentialListProps) => {
  const credentials = await getCredentials(organizationId);

  return (
    <>
      {/* Mobile - Cards */}
      <div className="flex flex-col gap-2 lg:hidden">
        {credentials.map(
          ({ id, name, createdAt, lastUsed, revokedAt, createdBy, scopes }) => (
            <div key={id} className="flex gap-x-1 w-full justify-center">
              <Card className="max-w-[420px] w-full" size="sm">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
                  <CardTitle className="font-semibold">{name}</CardTitle>
                  {revokedAt ? (
                    <span className="text-xs bg-destructive/20 text-destructive px-2 py-1 rounded-full">
                      Revoked
                    </span>
                  ) : (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </CardHeader>
                <CardContent className="flex flex-col gap-1 pt-0">
                  <CardDescription>
                    Created by: {createdBy?.name ?? "Deleted User"}
                  </CardDescription>
                  <CardDescription>
                    Created: {format(createdAt, "yyyy/MM/dd, hh:mm")}
                  </CardDescription>
                  <CardDescription>
                    Last used:{" "}
                    {lastUsed ? format(lastUsed, "yyyy/MM/dd, hh:mm") : "Never"}
                  </CardDescription>
                  {!revokedAt && (
                    <CardDescription>
                      <CredentialRevokeButton
                        id={id}
                        organizationId={organizationId}
                      />
                    </CardDescription>
                  )}
                  <CardDescription>
                    <div className="flex gap-x-1 flex-wrap">
                      {stringToScopes(scopes).map((scope) => (
                        <span
                          key={scope}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          Scopes: {scope}
                        </span>
                      ))}
                    </div>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          ),
        )}
      </div>

      {/* Desktop - Table */}
      <div className="hidden lg:block">
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
              <TableHead>Scopes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {credentials.map(
              ({
                id,
                name,
                createdAt,
                lastUsed,
                revokedAt,
                createdBy,
                scopes,
              }) => (
                <TableRow key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell>{createdBy?.name ?? "Deleted User"}</TableCell>
                  <TableCell>
                    {format(createdAt, "yyyy/MM/dd, hh:mm")}
                  </TableCell>
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
                  <TableCell>
                    <div className="flex gap-x-1 flex-wrap">
                      {stringToScopes(scopes).map((scope) => (
                        <span
                          key={scope}
                          className="text-xs bg-muted px-2 py-1 rounded-full"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default CredentialList;
