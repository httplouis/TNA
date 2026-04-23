import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], display: "swap", variable: "--font-display" });

export const metadata: Metadata = {
  title: {
    template: "%s | TNA Portal — Xplore Philippines",
    default: "TNA Portal — Training Needs Assessment | Xplore Philippines",
  },
  description:
    "Identify your team's training needs through our intelligent assessment system. Submit responses and receive expert-reviewed recommendations from Xplore Philippines.",
  keywords: ["training needs assessment", "TNA", "Xplore Philippines", "employee training", "skills assessment"],
  openGraph: {
    type: "website",
    siteName: "TNA Portal",
    title: "TNA Portal — Xplore Philippines",
    description: "Web-based Training Needs Assessment portal by Xplore Philippines.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} ${plusJakarta.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-screen antialiased" suppressHydrationWarning>{children}</body>
    </html>
  );
}
