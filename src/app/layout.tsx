import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `${config.businessName} — Order online for pickup`,
  description: `Order coffee, espresso, and breakfast from ${config.businessName} in Parker, CO. Ready in ~${config.pickupEtaMinutes} minutes.`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
