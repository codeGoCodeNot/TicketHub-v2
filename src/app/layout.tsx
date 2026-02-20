import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { homePagePath, ticketsPagePath } from "@/path";
import { Button } from "@/components/ui/button";
import { LucideTickets } from "lucide-react";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketHub",
  description: "Create and manage your tickets with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        <nav
          className="
        w-full flex py-2.5 px-5 justify-between
        border-b bg-background/95 backdrop-blur
        supports-backdrop-blur:bg-background/60
        fixed top-0 right-0 left-0 z-20 animate-fade-from-top
        "
        >
          <Button
            asChild
            variant="ghost"
            className="font-semibold text-lg hover:bg-secondary/80"
          >
            <Link href={homePagePath()}>
              <LucideTickets />
              <span>TicketHub</span>
            </Link>
          </Button>
          <Button asChild variant="outline" className="hover:bg-secondary/80">
            <Link href={ticketsPagePath()}>Tickets</Link>
          </Button>
        </nav>
        <main
          className="py-24 px-8 flex flex-col flex-1
        bg-secondary/20
        overflow-x-hidden overflow-y-auto
        min-h-screen
        "
        >
          {children}
        </main>
      </body>
    </html>
  );
}
