"use client";
import { ActivityLog } from "@/generated/prisma/client";
import usePaginatedActivityLogs from "../hook/use-paginated-activity-logs";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import Placeholder from "@/components/placeholder";
import { format } from "date-fns/format";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ActivityLogProps = {
  organizationId: string;
  initialData: {
    list: ActivityLog[];
    metadata: {
      count: number;
      hasNextPage?: boolean;
      cursor?: { id: string; createdAt: number };
    };
  };
};

const ActivityLogs = ({ organizationId, initialData }: ActivityLogProps) => {
  const { fetchNextPage, hasNextPage, isFetchingNextPage, paginatedLogs } =
    usePaginatedActivityLogs(organizationId, initialData);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!paginatedLogs.length) return <Placeholder label="No activity yet" />;

  return (
    <>
      {/* Mobile - Cards */}
      <div className="flex flex-col gap-2 lg:hidden">
        {paginatedLogs.map((log) => (
          <div key={log.id} className="flex w-full justify-center">
            <Card className="max-w-[420px] w-full" size="sm">
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-1">
                <CardTitle className="font-semibold capitalize">
                  {log.action.replace(/_/g, " ")}
                </CardTitle>
                <CardDescription className="text-xs">
                  {format(log.createdAt, "yyyy/MM/dd, hh:mm")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>{log.detail}</CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Desktop - Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(log.createdAt, "yyyy/MM/dd, hh:mm")}
                </TableCell>
                <TableCell className="capitalize font-medium whitespace-nowrap">
                  {log.action.replace(/_/g, " ")}
                </TableCell>
                <TableCell>{log.detail}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div ref={ref}>
        {!hasNextPage && (
          <p className="text-right text-xs italic text-muted-foreground">
            No more activity.
          </p>
        )}
      </div>
    </>
  );
};

export default ActivityLogs;
