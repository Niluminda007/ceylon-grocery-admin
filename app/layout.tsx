import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Poppins } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import NextTopLoader from "nextjs-toploader";
import { QueryProvider } from "@/components/providers/query-provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Ceylong Grocery",
  description: "Authentic Sri lankan grocery shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <SessionProvider>
          <QueryProvider>
            <NextTopLoader />
            <Toaster />
            {children}
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
