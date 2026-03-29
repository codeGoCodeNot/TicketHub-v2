"use client";

import { authClient } from "@/lib/auth-client";
import { homePagePath, signInPagePath, signUpPagePath } from "@/path";
import { LucideTickets } from "lucide-react";
import Link from "next/link";
import AccountDropdown from "./account-dropdown";
import ThemeSwitcher from "./theme/theme-switcher";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

const Header = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) return null;

  const navItems = user ? (
    <>
      <AccountDropdown user={user} />
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
        <Button asChild variant="ghost" className="font-semibold text-lg">
          <Link href={homePagePath()}>
            <LucideTickets />
            <span>TicketHub</span>
          </Link>
        </Button>
      </div>

      <div className="flex gap-x-2 items-center">
        <ThemeSwitcher />
        {navItems}
        {user && <SidebarTrigger />}
      </div>
    </nav>
  );
};

export default Header;
