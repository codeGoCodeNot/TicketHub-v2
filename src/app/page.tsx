import Heading from "@/components/heading";
import { ticketsPagePath } from "@/path";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col gap-y-8 flex-1">
      <Heading title="Home" description="Your Home place to start" />

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
