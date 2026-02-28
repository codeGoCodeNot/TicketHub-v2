"use client";

import SignOutItem from "@/features/auth/components/sign-out-item";
import useAuth from "@/features/auth/hooks/use-auth";
import {
  homePagePath,
  signInPagePath,
  signUpPagePath,
  ticketsPagePath,
} from "@/path";
import { LucideTickets } from "lucide-react";
import Link from "next/link";
import ThemeSwitcher from "./theme/theme-switcher";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  const { user, isFetched } = useAuth();

  if (!isFetched) return null;

  const navItems = user ? (
    <>
      <Button asChild>
        <Link href={ticketsPagePath()}>Tickets</Link>
      </Button>
      <SignOutItem />
    </>
  ) : (
    <>
      <Button asChild variant="outline">
        <Link href={signUpPagePath()}>Sign Up</Link>
      </Button>
      <Button asChild variant="default">
        <Link href={signInPagePath()}>Sign In</Link>
      </Button>
    </>
  );

  return (
    <nav className="w-full flex py-2.5 px-5 justify-between border-b bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 fixed top-0 right-0 left-0 z-20 animate-slide-from-top">
      <div className="flex gap-x-2 items-center">
        {user && <SidebarTrigger />}

        <Button asChild variant="ghost" className="font-semibold text-lg">
          <Link href={homePagePath()}>
            <LucideTickets />
            <span>TicketHub</span>
          </Link>
        </Button>
      </div>

      <div className="flex gap-x-1 items-center">
        <ThemeSwitcher />
        {navItems}
      </div>
    </nav>
  );
};

export default Header;
