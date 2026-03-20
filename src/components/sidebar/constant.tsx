import {
  accountProfilePagePath,
  homePagePath,
  organizationPagePath,
  ticketsPagePath,
} from "@/path";
import {
  LucideBookCopy,
  LucideCircleUser,
  LucideLibrary,
  LucideUsers,
} from "lucide-react";
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
  {
    title: "Organization",
    href: organizationPagePath(),
    icon: <LucideUsers />,
  },
];
