import {
  accountPasswordPagePath,
  accountProfilePagePath,
  homePagePath,
  ticketsPagePath,
} from "@/path";
import { LucideBookCopy, LucideCircleUser, LucideLibrary } from "lucide-react";
import { NavItem } from "./components/type";

export const navItems: NavItem[] = [
  {
    title: "All Tickets",
    href: homePagePath(),
    icon: <LucideLibrary />,
  },
  {
    title: "My Tickets",
    href: ticketsPagePath(),
    icon: <LucideBookCopy />,
  },
  {
    separator: true,
    title: "Account",
    href: accountProfilePagePath(),
    icon: <LucideCircleUser />,
  },
];
