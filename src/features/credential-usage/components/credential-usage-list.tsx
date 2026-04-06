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
import getCredentialUsages from "../actions/get-credential-usages";

type CredentialUsageListProps = {
  organizationId: string;
};

const CredentialUsageList = async ({
  organizationId,
}: CredentialUsageListProps) => {
  const usages = await getCredentialUsages(organizationId);

  if (!usages.length)
    return (
      <p className="text-sm text-muted-foreground">No usage recorded yet.</p>
    );

  return (
    <>
      {/* Mobile - Cards */}
      <div className="flex flex-col gap-2 lg:hidden">
        {usages.map(
          ({ id, usedAt, route, ipAddress, userAgent, credential }) => (
            <div key={id} className="flex w-full justify-center">
              <Card className="max-w-[420px] w-full" size="sm">
                <CardHeader className="pb-1">
                  <CardTitle className="font-semibold">
                    {credential.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 pt-0">
                  <CardDescription>
                    Used at: {format(usedAt, "yyyy/MM/dd, hh:mm")}
                  </CardDescription>
                  <CardDescription>Route: {route}</CardDescription>
                  <CardDescription>
                    IP: {ipAddress ?? "Unknown"}
                  </CardDescription>
                  <CardDescription className="truncate">
                    Agent: {userAgent ?? "Unknown"}
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
          <TableCaption>Recent Usage</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Credential</TableHead>
              <TableHead>Used At</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>User Agent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usages.map(
              ({ id, usedAt, route, ipAddress, userAgent, credential }) => (
                <TableRow key={id}>
                  <TableCell>{credential.name}</TableCell>
                  <TableCell>{format(usedAt, "yyyy/MM/dd, hh:mm")}</TableCell>
                  <TableCell>{route}</TableCell>
                  <TableCell>{ipAddress ?? "Unknown"}</TableCell>
                  <TableCell className="truncate max-w-[200px]">
                    {userAgent ?? "Unknown"}
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

export default CredentialUsageList;
