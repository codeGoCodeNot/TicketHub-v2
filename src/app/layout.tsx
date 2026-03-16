import Header from "@/components/header";
import RedirectToast from "@/components/redirect-toast";
import SideBar from "@/components/sidebar/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto, JetBrains_Mono } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Toaster } from "sonner";
import Providers from "./_provider/react-query/react-query-provider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.className} antialiased`}>
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
