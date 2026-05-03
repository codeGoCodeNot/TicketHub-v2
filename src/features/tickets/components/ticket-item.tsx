"use client";

import ToolTip from "@/components/tool-tip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { TicketStatus } from "@/generated/prisma/client";
import { ticketEditPagePath, ticketPagePath } from "@/path";
import { toCurrencyFromCents } from "@/utils/currency";
import clsx from "clsx";
import {
  LucideCalendar,
  LucideCoins,
  LucideEdit,
  LucideMoreVertical,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { startTransition, useOptimistic } from "react";
import { toast } from "sonner";
import updateTicketStatus from "../actions/update-ticket-status";
import { TICKET_ICONS, TICKET_STATUS_LABELS } from "../constants";
import { TicketWithMetada } from "../type";
import TicketMoreMenu from "./ticket-more-menu";

const STATUS_CLASSES: Record<string, string> = {
  OPEN: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  IN_PROGRESS:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  DONE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

type TicketItemProps = {
  ticket: TicketWithMetada;
  isDetail?: boolean;
  attachments?: React.ReactNode;
  referencedTicket?: React.ReactNode;
  comments?: React.ReactNode;
};

const TicketItem = ({
  ticket,
  isDetail,
  attachments,
  referencedTicket,
  comments,
}: TicketItemProps) => {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(ticket.status);

  const handleStatusChange = (value: string) => {
    const newStatus = value as TicketStatus;
    startTransition(async () => {
      setOptimisticStatus(newStatus);
      const result = await updateTicketStatus(ticket.id, newStatus);
      if (result.status === "ERROR") {
        toast.error(result.message);
      } else {
        toast.success(result.message);
      }
    });
  };

  const editButton =
    (ticket.isOwner || ticket.canUpdateTickets) &&
    (ticket.canUpdateTickets ? (
      <ToolTip label="Edit ticket">
        <Button variant="ghost" size="icon" className="size-8" asChild>
          <Link prefetch href={ticketEditPagePath(ticket.id)}>
            <LucideEdit className="size-4" />
          </Link>
        </Button>
      </ToolTip>
    ) : (
      <ToolTip label="You do not have permission to edit this ticket.">
        <span>
          <Button variant="ghost" size="icon" className="size-8" disabled>
            <LucideEdit className="size-4" />
          </Button>
        </span>
      </ToolTip>
    ));

  const detailButton = (
    <ToolTip label="View details">
      <Button asChild variant="ghost" size="icon" className="size-8">
        <Link prefetch href={ticketPagePath(ticket.id)}>
          <LucideSquareArrowOutUpRight className="size-4" />
        </Link>
      </Button>
    </ToolTip>
  );

  const moreMenu = (ticket.isOwner || ticket.canDeleteTickets) && (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button variant="ghost" size="icon" className="size-8">
          <LucideMoreVertical className="size-4" />
        </Button>
      }
      canDeleteTickets={ticket.canDeleteTickets}
      currentStatus={optimisticStatus}
      onStatusChange={handleStatusChange}
    />
  );

  return (
    <div
      className={clsx("flex flex-col gap-y-4 w-full", {
        "max-w-[640px]": !isDetail,
        "max-w-[560px]": isDetail,
      })}
    >
      <Card className="w-full transition-shadow hover:shadow-md">
        <CardHeader className="gap-y-2">
          <div className="flex items-center justify-between gap-x-2">
            <div className="flex items-center gap-x-2 min-w-0">
              <Avatar className="size-6 shrink-0">
                <AvatarImage
                  src={ticket.user.image ?? undefined}
                  alt={ticket.user.name || "User Avatar"}
                />
                <AvatarFallback className="text-xs">
                  {ticket.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {ticket.user.name?.split(" ")[0]}
              </span>
            </div>

            <div className="flex items-center gap-x-1 shrink-0">
              <Badge
                variant="secondary"
                className={clsx(
                  "gap-x-1 rounded-sm border-0 text-xs font-medium",
                  STATUS_CLASSES[optimisticStatus],
                )}
              >
                {TICKET_ICONS[optimisticStatus]}
                {TICKET_STATUS_LABELS[optimisticStatus]}
              </Badge>
              {isDetail ? (
                <>
                  {editButton}
                  {moreMenu}
                </>
              ) : (
                <>
                  {detailButton}
                  {editButton}
                </>
              )}
            </div>
          </div>

          <p className="text-sm font-semibold leading-snug text-foreground">
            {ticket.title}
          </p>
        </CardHeader>

        <CardContent>
          <p
            className={clsx(
              "text-xs text-muted-foreground whitespace-break-spaces leading-relaxed",
              { "line-clamp-3": !isDetail },
            )}
          >
            {ticket.content}
          </p>
        </CardContent>

        <CardFooter className="gap-x-5">
          <div className="flex items-center gap-x-1.5 text-xs text-muted-foreground">
            <LucideCalendar className="size-3.5 shrink-0" />
            <span>{ticket.deadline}</span>
          </div>
          <div className="flex items-center gap-x-1.5 text-xs">
            <LucideCoins className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="font-medium text-foreground">
              {toCurrencyFromCents(ticket.bounty)}
            </span>
          </div>
        </CardFooter>
      </Card>

      {attachments}
      {referencedTicket}
      {comments}
    </div>
  );
};

export default TicketItem;
