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
import { toast } from "sonner";
import deleteTicket from "../actions/delete-ticket";
import updateTicketStatus from "../actions/update-ticket-status";
import { TICKET_STATUS_LABELS } from "../constants";

type TicketMoreMenuProps = {
  ticket: Ticket;
  trigger: React.ReactNode;
};

const TicketMoreMenu = ({ ticket, trigger }: TicketMoreMenuProps) => {
  // handle update ticket status
  const handleUpdateTicketStatus = async (value: string) => {
    const promiseStatus = updateTicketStatus(ticket.id, value as TicketStatus);
    toast.promise(promiseStatus, {
      loading: "Updating status...",
    });
    const result = await promiseStatus;
    if (result.status === "ERROR") {
      toast.error(result.message);
    } else if (result.status === "SUCCESS") {
      toast.success(result.message);
    }
  };

  // custom state and handlers for delete confirm dialog
  const [deleteDialogTrigger, deleteDialog] = useConfirmDialog({
    action: deleteTicket.bind(null, ticket.id),
    trigger: (
      <DropdownMenuItem>
        <LucideTrash2 className="text-red-800" />
        Delete
      </DropdownMenuItem>
    ),
    title: "Are you sure you want to delete this ticket?",
    description: "This action cannot be undone.",
  });

  const ticketStatusOptionsItems = (
    <DropdownMenuRadioGroup
      value={ticket.status}
      onValueChange={handleUpdateTicketStatus}
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
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
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
