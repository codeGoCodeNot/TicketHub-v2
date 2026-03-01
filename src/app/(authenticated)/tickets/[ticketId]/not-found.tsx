import Placeholder from "@/components/placeholder";
import { Button } from "@/components/ui/button";
import { ticketsPagePath } from "@/path";
import Link from "next/link";

const NotFound = () => {
  return (
    <Placeholder
      label="Ticket not found"
      button={
        <Button asChild variant="destructive">
          <Link href={ticketsPagePath()}>Back to Tickets</Link>
        </Button>
      }
    />
  );
};

export default NotFound;
