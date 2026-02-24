"use client";

import FieldError from "@/components/form/field-error";
import Form from "@/components/form/form";
import SubmitButton from "@/components/form/submit-button";
import { EMPTY_ACTION_STATE } from "@/components/form/utils/to-action-state";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Ticket } from "@/generated/prisma/client";
import { fromCent } from "@/utils/currency";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useActionState, useState } from "react";
import upsertTicket from "../actions/upsert-ticket";
import DatePicker from "@/components/date-picker";

type TicketUpsertFormProps = {
  ticket?: Ticket;
};

const TicketUpsertForm = ({ ticket }: TicketUpsertFormProps) => {
  const [actionState, action] = useActionState(
    upsertTicket.bind(null, ticket?.id ?? ""),
    EMPTY_ACTION_STATE,
  );

  const [date, setDate] = useState<Date | undefined>(new Date());

  const formattedStringDate = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <Form action={action} actionState={actionState}>
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        name="title"
        type="text"
        defaultValue={
          (actionState.payload?.get("title") as string) ?? ticket?.title
        }
      />
      <FieldError actionState={actionState} name="title" />

      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        name="content"
        defaultValue={
          (actionState.payload?.get("content") as string) ?? ticket?.content
        }
      />
      <FieldError actionState={actionState} name="content" />

      <div className="flex gap-x-2 mb-1">
        <div className="w-1/2">
          <Label htmlFor="deadline" className="mb-2">
            Deadline
          </Label>
          <DatePicker
            id="deadline"
            name="deadline"
            defaultValue={
              (actionState.payload?.get("deadline") as string) ??
              ticket?.deadline
            }
          />
          <FieldError actionState={actionState} name="deadline" />
        </div>

        <div className="w-1/2">
          <Label htmlFor="bounty" className="mb-2">
            Bounty
          </Label>
          <Input
            id="bounty"
            name="bounty"
            type="number"
            defaultValue={
              (actionState.payload?.get("bounty") as string) ??
              (ticket?.bounty ? fromCent(ticket.bounty) : "")
            }
          />
          <FieldError actionState={actionState} name="bounty" />
        </div>
      </div>

      <SubmitButton label={ticket ? "Update Ticket" : "Create Ticket"} />
    </Form>
  );
};

export default TicketUpsertForm;
