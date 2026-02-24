import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket } from "@/generated/prisma/client";
import { ticketEditPagePath, ticketPagePath } from "@/path";
import { toCurrencyFromCents } from "@/utils/currency";
import clsx from "clsx";
import {
  LucideEdit,
  LucideMenu,
  LucideSquareArrowOutUpRight,
} from "lucide-react";
import Link from "next/link";
import { TICKET_ICONS } from "../constants";
import TicketMoreMenu from "./ticket-more-menu";
import ToolTip from "@/components/tool-tip";

type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const editButton = (
    <ToolTip label="Edit ticket">
      <Button variant="outline" size="icon" asChild>
        <Link prefetch href={ticketEditPagePath(ticket.id)}>
          <LucideEdit />
        </Link>
      </Button>
    </ToolTip>
  );

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

  const moreMenu = (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button variant="outline" size="icon">
          <LucideMenu />
        </Button>
      }
    />
  );

  return (
    <div
      className={clsx("flex gap-x-1 w-full", {
        "max-w-[420px]": !isDetail,
        "max-w-[550px]": isDetail,
      })}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex gap-x-2 items-center">
            <span>{TICKET_ICONS[ticket.status]}</span>
            <div>
              <span className="truncate text-lg">{ticket.title}</span>
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
            {editButton}
            {detailButton}
          </>
        )}
      </div>
    </div>
  );
};

export default TicketItem;
