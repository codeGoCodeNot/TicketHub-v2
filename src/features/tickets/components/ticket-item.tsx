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
import getAuth from "@/features/auth/actions/get-auth";
import isOwnership from "@/features/auth/utils/is-ownership";
import Comments from "@/features/comment/components/comments";
import { CommentWithMetadata } from "@/features/comment/type";
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
  comments?: CommentWithMetadata[];
};

const TicketItem = async ({ ticket, isDetail, comments }: TicketItemProps) => {
  const user = await getAuth();
  const isTicketOwner = isOwnership(user, ticket);

  const editButton = isTicketOwner && (
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

  const moreMenu = isTicketOwner && (
    <TicketMoreMenu
      ticket={ticket}
      trigger={
        <Button variant="outline" size="icon">
          <LucideMoreVertical />
        </Button>
      }
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
              <div className="flex gap-x-2 items-center">
                <span>{TICKET_ICONS[ticket.status]}</span>
                <div>
                  <span className="truncate text-lg">{ticket.title}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-y-2">
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
      {isDetail && <Comments ticketId={ticket.id} comments={comments} />}
    </div>
  );
};

export default TicketItem;
