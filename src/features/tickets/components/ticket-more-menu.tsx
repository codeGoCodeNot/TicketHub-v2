"use client";

import useConfirmDialog from "@/features/tickets/hooks/use-confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ticket, TicketStatus } from "@/generated/prisma/client";
import { LucideTrash2 } from "lucide-react";
import deleteTicket from "../actions/delete-ticket";
import { TICKET_STATUS_LABELS } from "../constants";
import ToolTip from "@/components/tool-tip";

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
  canDeleteTickets?: boolean;
  currentStatus: TicketStatus;
  onStatusChange: (value: string) => void;
};

const TicketMoreMenu = ({
  ticket,
  trigger,
  canDeleteTickets = false,
  currentStatus,
  onStatusChange,
}: TicketMoreMenuProps) => {
  // custom state and handlers for delete confirm dialog
  const [deleteDialogTrigger, deleteDialog] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: canDeleteTickets ? (
      <DropdownMenuItem>
        <LucideTrash2 className="text-red-800" />
        Delete
      </DropdownMenuItem>
    ) : (
      <ToolTip label="You do not have permission to delete this ticket.">
        <span>
          <DropdownMenuItem disabled>
            <LucideTrash2 className="text-red-800" />
            Delete
          </DropdownMenuItem>
        </span>
      </ToolTip>
    ),
    title: "Are you sure you want to delete this ticket?",
    description: "This action cannot be undone.",
  });

  const ticketStatusOptionsItems = (
    <DropdownMenuRadioGroup
      value={currentStatus}
      onValueChange={onStatusChange}
    >
      {(Object.keys(TICKET_STATUS_LABELS) as TicketStatus[]).map((key) => (
        <DropdownMenuRadioItem key={key} value={key}>
          {TICKET_STATUS_LABELS[key]}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <>
      {deleteDialog}
      <DropdownMenu>
        <ToolTip label="More options">
          <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        </ToolTip>
        <DropdownMenuContent side="right" className="w-50">
          {ticketStatusOptionsItems}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>{deleteDialogTrigger}</DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default TicketMoreMenu;
