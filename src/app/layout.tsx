import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CampusBazaar - India's Student Marketplace for Books & Notes",
  description: "Buy and sell old books, notes, and study essentials directly with students across India. Save up to 70% on textbooks. No middleman, no hassle.",
  keywords: ["CampusBazaar", "student marketplace", "buy books", "sell books", "old books", "India", "college books", "NEET books", "JEE books", "UPSC books", "used textbooks"],
  authors: [{ name: "CampusBazaar Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CampusBazaar - India's Student Marketplace",
    description: "Buy & sell old books directly with students. Save up to 70% on textbooks.",
    url: "https://campusbazaar.in",
    siteName: "CampusBazaar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusBazaar - India's Student Marketplace",
    description: "Buy & sell old books directly with students. Save up to 70% on textbooks.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
