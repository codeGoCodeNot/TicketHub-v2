import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ticketEditPagePath, ticketPagePath } from "@/path";
import clsx from "clsx";
import {
  LucidePencil,
  LucideSquareArrowOutUpRight,
  LucideTrash2,
} from "lucide-react";
import Link from "next/link";
import deleteTicket from "../actions/delete-ticket";
import { TICKET_ICONS } from "../constants";
import { Ticket } from "@/generated/prisma/client";

type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const editButton = (
    <Button variant="outline" size="icon" asChild>
      <Link prefetch href={ticketEditPagePath(ticket.id)}>
        <LucidePencil />
      </Link>
    </Button>
  );

  const detailButton = (
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
  );

  const deleteButton = (
    <form action={deleteTicket.bind(null, ticket.id)}>
      <Button variant="destructive" size="icon">
        <LucideTrash2 />
      </Button>
    </form>
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
          <p className="text-sm text-muted-foreground">${ticket.bounty}</p>
        </CardFooter>
      </Card>
      <div className="flex flex-col gap-y-1">
        {isDetail ? (
          <>
            {editButton}
            {deleteButton}
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
