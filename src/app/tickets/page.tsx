import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ticketPagePath } from "@/path";
import Link from "next/link";
import { initialData } from "../../data";
import { LucideCheck, LucideFileText, LucidePencil } from "lucide-react";

const TICKET_ICONS = {
  OPEN: <LucideFileText />,
  IN_PROGRESS: <LucidePencil />,
  DONE: <LucideCheck />,
};

const TicketsPage = () => {
  return (
    <div className="flex-1 flex flex-col gap-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tickets Page</h1>
        <p className="text-muted-foreground text-sm">
          All your tickets at one place
        </p>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col self-center items-center gap-y-4 animate-fade-from-top">
        {initialData.tickets.map((ticket) => (
          <Card key={ticket.id} className="w-full max-w-[420px] ">
            <CardHeader>
              <CardTitle className="flex gap-x-2 items-center">
                <span>{TICKET_ICONS[ticket.status]}</span>
                <span className="truncate">{ticket.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>{ticket.description}</CardContent>
            <CardFooter>
              <Link href={ticketPagePath(ticket.id)}>View</Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TicketsPage;
