import {
  homePagePath,
  signInPagePath,
  signUpPagePath,
  ticketsPagePath,
} from "@/path";
import { LucideTickets } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ThemeSwitcher from "./theme/theme-switcher";
import SignOutItem from "@/features/auth/components/sign-out-item";

const Header = () => {
  const navItems = (
    <>
      <Button asChild>
        <Link href={ticketsPagePath()}>Tickets</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href={signUpPagePath()}>Sign Up</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href={signInPagePath()}>Sign In</Link>
      </Button>
      <SignOutItem />
    </>
  );

  return (
    <nav
      className="
        w-full flex py-2.5 px-5 justify-between
        border-b bg-background/95 backdrop-blur
        supports-backdrop-blur:bg-background/60
        fixed top-0 right-0 left-0 z-20 animate-slide-from-top
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
        {navItems}
      </div>
    </nav>
  );
};

export default Header;
