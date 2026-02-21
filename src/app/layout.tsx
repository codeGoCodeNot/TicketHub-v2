import Header from "@/components/header";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

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
      <body className={`${roboto.className} antialiased`}>
        <Header />
        <main
          className="py-24 px-8 flex flex-col flex-1
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
