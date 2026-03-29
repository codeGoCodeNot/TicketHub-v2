import ToolTip from "@/components/tool-tip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ticketEditPagePath, ticketPagePath } from "@/path";
import { toCurrencyFromCents } from "@/utils/currency";
import clsx from "clsx";
import {
  LucideEdit,
  LucideMoreVertical,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { TICKET_ICONS } from "../constants";
import { TicketWithMetada } from "../type";
import TicketMoreMenu from "./ticket-more-menu";

type TicketItemProps = {
  ticket: TicketWithMetada;
  isDetail?: boolean;
  comments?: React.ReactNode;
  attachments?: React.ReactNode;
};

const TicketItem = ({
  ticket,
  isDetail,
  comments,
  attachments,
}: TicketItemProps) => {
  const editButton =
    (ticket.isOwner || ticket.canUpdateTickets) &&
    (ticket.canUpdateTickets ? (
      <ToolTip label="Edit ticket">
        <Button variant="outline" size="icon" asChild>
          <Link prefetch href={ticketEditPagePath(ticket.id)}>
            <LucideEdit />
          </Link>
        </Button>
      </ToolTip>
    ) : (
      <ToolTip label="You do not have permission to edit this ticket.">
        <span>
          <Button variant="outline" size="icon" disabled>
            <LucideEdit />
          </Button>
        </span>
      </ToolTip>
    ));

  const detailButton = (
    <ToolTip label="View details">
      <Button
        asChild
        variant="outline"
        size="icon"
        className="hover:bg-secondary/80"
      >
        <Link prefetch href={ticketPagePath(ticket.id)}>
          <LucideSquareArrowOutUpRight />
        </Link>
      </Button>
    </ToolTip>
  );

  const moreMenu = ticket.isOwner && (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button variant="outline" size="icon">
          <LucideMoreVertical />
        </Button>
      }
      canDeleteTickets={ticket.canDeleteTickets}
    />
  );

  return (
    <div
      className={clsx("flex flex-col gap-x-1 w-full gap-y-4", {
        "max-w-[420px]": !isDetail,
        "max-w-[550px]": isDetail,
      })}
    >
      <div className="flex gap-x-1">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <div className="flex flex-col gap-y-2 w-full">
                <div className="flex items-center gap-x-1 w-full justify-end mb-2">
                  <Avatar>
                    <AvatarImage
                      src={ticket.user.image ?? undefined}
                      alt={ticket.user.name || "User Avatar"}
                    />
                    <AvatarFallback>
                      {ticket.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs text-muted-foreground">
                    {ticket.user?.name.split(" ")[0]}
                  </div>
                </div>
                <div className="flex gap-x-2 items-center">
                  <span>{TICKET_ICONS[ticket.status]}</span>
                  <span className="truncate text-lg">{ticket.title}</span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={clsx("whitespace-break-spaces", {
                "line-clamp-3": !isDetail,
              })}
            >
              {ticket.content}
            </span>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">{ticket.deadline}</p>
            <p className="text-sm text-muted-foreground">
              {toCurrencyFromCents(ticket.bounty)}
            </p>
          </CardFooter>
        </Card>
        <div className="flex flex-col gap-y-1">
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
      {attachments}
      {comments}
    </div>
  );
};

export default TicketItem;
