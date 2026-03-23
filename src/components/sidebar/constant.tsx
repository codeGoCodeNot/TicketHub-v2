import {
  accountProfilePagePath,
  homePagePath,
  organizationPagePath,
  ticketsByOrganizationPagePath,
  ticketsPagePath,
} from "@/path";
import {
  LucideBook,
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
    title: "Tickets by Organization",
    href: ticketsByOrganizationPagePath(),
    icon: <LucideBookCopy />,
  },
  {
    title: "My Tickets",
    href: ticketsPagePath(),
    icon: <LucideBook />,
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
