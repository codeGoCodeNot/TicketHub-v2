import { homePagePath, ticketsPagePath } from "@/path";
import { LucideTickets } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ThemeSwitcher from "./theme/theme-switcher";

const Header = () => {
  return (
    <nav
      className="
        w-full flex py-2.5 px-5 justify-between
        border-b bg-background/95 backdrop-blur
        supports-backdrop-blur:bg-background/60
        fixed top-0 right-0 left-0 z-20 animate-fade-from-top
        "
    >
      <Button asChild variant="ghost" className="font-semibold text-lg">
        <Link href={homePagePath()}>
          <LucideTickets />
          <span>TicketHub</span>
        </Link>
      </Button>

      <div className="flex gap-x-1 items-center">
        <ThemeSwitcher />
        <Button asChild>
          <Link href={ticketsPagePath()}>Tickets</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Header;
