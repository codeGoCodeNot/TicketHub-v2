import { homePagePath, ticketsPagePath } from "@/path";
import { LucideBookCopy, LucideLibrary } from "lucide-react";
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
];
