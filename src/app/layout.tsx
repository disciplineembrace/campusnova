import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusNova - India's Premium Student Ecosystem Platform",
  description: "Buy and sell old books, notes, and study essentials directly with students. India's most trusted student marketplace. Save up to 70% on textbooks.",
  keywords: ["CampusNova", "student marketplace", "buy books", "sell books", "old books", "India", "college books", "NEET books", "JEE books", "UPSC books", "student platform"],
  authors: [{ name: "CampusNova Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "CampusNova - India's Premium Student Ecosystem",
    description: "Buy & sell old books directly with students. Save up to 70% on textbooks.",
    url: "https://campusnova.in",
    siteName: "CampusNova",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusNova - India's Premium Student Ecosystem",
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
        className={`${inter.variable} ${poppins.variable} antialiased bg-background text-foreground font-sans`}
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
