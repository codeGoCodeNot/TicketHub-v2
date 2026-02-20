import { Separator } from "@/components/ui/separator";
import { ticketsPagePath } from "@/path";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home Page</h1>
        <p className="text-muted-foreground text-sm">
          Your Home place to start
        </p>
      </div>

      <Separator />

      <div className="text-center">
        <Link
          href={ticketsPagePath()}
          className="underline text-lg font-semibold"
        >
          View Tickets
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
