import Header from "@/components/header";
import RedirectToast from "@/components/redirect-toast";
import SideBar from "@/components/sidebar/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import Providers from "./_provider/react-query/react-query-provider";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "TicketHub v2",
    template: "%s | TicketHub v2",
  },
  description:
    "A production-grade ticket management SaaS for teams. Create tickets, manage organizations, and track progress.",
  keywords: [
    "ticket management",
    "project management",
    "SaaS",
    "team collaboration",
  ],
  authors: [{ name: "Johnsen Berdin", url: "https://johnsenb.dev" }],
  openGraph: {
    title: "TicketHub v2",
    description: "A production-grade ticket management SaaS for teams.",
    url: "https://tickethubv2.johnsenb.dev",
    siteName: "TicketHub v2",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TicketHub v2",
    description: "A production-grade ticket management SaaS for teams.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Providers>
              <SidebarProvider>
                <Header />
                <main
                  className="py-24 px-8 flex flex-col flex-1
              overflow-x-hidden overflow-y-auto
              min-h-screen
              "
                >
                  <SideBar />
                  <TooltipProvider delayDuration={1500}>
                    {children}
                  </TooltipProvider>
                </main>
              </SidebarProvider>
              <RedirectToast />
              <Toaster expand />
            </Providers>
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
