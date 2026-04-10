import Placeholder from "@/components/placeholder";
import getActivityLogs from "../queries/get-activity-log";
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

type ActivityLogListProps = {
  organizationId: string;
};

const ActivityLogList = async ({ organizationId }: ActivityLogListProps) => {
  const logs = await getActivityLogs(organizationId);

  if (!logs.length) return <Placeholder label="No activity yet" />;

  return (
    <Table>
      <TableCaption>Recent activities in your organization</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Detail</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell>{format(log.createdAt, "yyyy/MM/dd, hh:mm")}</TableCell>
            <TableCell>{log.action}</TableCell>
            <TableCell>{log.detail}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ActivityLogList;
