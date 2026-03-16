import Header from "@/components/header";
import RedirectToast from "@/components/redirect-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Roboto, Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import SideBar from "@/components/sidebar/components/sidebar";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import Providers from "./_provider/react-query/react-query-provider";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

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
    <html
      lang="en"
      suppressHydrationWarning
      className={cn( inter.variable, "font-mono", jetbrainsMono.variable)}
    >
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
                  <TooltipProvider delay={1500}>{children}</TooltipProvider>
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
