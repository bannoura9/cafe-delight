import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { config } from "@/lib/config";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${config.businessName} — Order coffee online · Parker, CO`,
    template: `%s · ${config.businessName}`,
  },
  description: `Order espresso, signature lattes, boba, gelato, and breakfast online from ${config.businessName} in Parker, CO. Pay online, pick up in ~${config.pickupEtaMinutes} minutes.`,
  keywords: [
    "coffee shop Parker CO",
    "café Parker Colorado",
    "online coffee ordering Parker",
    "boba tea Parker",
    "matcha latte Parker",
    "espresso Parker CO",
    "Café Delight",
    "Crown Crest coffee",
  ],
  authors: [{ name: config.businessName }],
  creator: config.businessName,
  publisher: config.businessName,
  applicationName: config.businessName,
  category: "food",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: config.businessName,
    title: `${config.businessName} — Order coffee online · Parker, CO`,
    description: `Fresh espresso, signature lattes, boba, gelato, and breakfast in Parker, CO. Order ahead, skip the line.`,
    images: [{ url: `${SITE_URL}/logo.png`, width: 453, height: 223, alt: config.businessName }],
  },
  twitter: {
    card: "summary",
    title: `${config.businessName} — Parker, CO`,
    description: `Order coffee ahead. Skip the line.`,
    images: [`${SITE_URL}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-dvh flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}
