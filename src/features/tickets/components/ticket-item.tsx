"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ticketPagePath } from "@/path";
import clsx from "clsx";
import { LucideSquareArrowOutUpRight, LucideTrash2 } from "lucide-react";
import Link from "next/link";
import { TICKET_ICONS } from "../constants";
import { Ticket } from "../../../../generated/prisma/client";
import prisma from "@/lib/prisma";
import deleteTicket from "../actions/delete-ticket";

type TicketItemProps = {
  ticket: Ticket;
  isDetail?: boolean;
};

const TicketItem = ({ ticket, isDetail }: TicketItemProps) => {
  const detailButton = (
    <Button
      asChild
      variant="outline"
      size="icon"
      className="hover:bg-secondary/80"
    >
      <Link href={ticketPagePath(ticket.id)}>
        <LucideSquareArrowOutUpRight />
      </Link>
    </Button>
  );

  const handleDeleteTicket = async () => {
    await deleteTicket(ticket.id);
  };

  const deleteButton = (
    <Button variant="destructive" size="icon" onClick={handleDeleteTicket}>
      <LucideTrash2 />
    </Button>
  );

  return (
    <div
      className={clsx("flex gap-x-1 w-full", {
        "max-w-[420px]": !isDetail,
        "max-w-[550px]": isDetail,
      })}
    >
      <Card key={ticket.id} className="w-full">
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
      </Card>
      <div className="flex flex-col gap-y1">
        {isDetail ? deleteButton : detailButton}
      </div>
    </div>
  );
};

export default TicketItem;
