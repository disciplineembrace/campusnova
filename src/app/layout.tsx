import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7c3aed" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "CampusNova - India's Premium Student Ecosystem Platform",
    template: "%s | CampusNova",
  },
  description:
    "Buy and sell old books, notes, and study essentials directly with students. India's most trusted student marketplace. Save up to 70% on textbooks for NEET, JEE, UPSC, and more.",
  keywords: [
    "CampusNova",
    "student marketplace",
    "buy books",
    "sell books",
    "old books",
    "second hand books",
    "India",
    "college books",
    "NEET books",
    "JEE books",
    "UPSC books",
    "student platform",
    "campus marketplace",
    "university books",
    "textbook exchange",
    "study materials",
    "engineering books",
    "medical books",
    "law books",
    "CBSE books",
    "ICSE books",
    "competitive exam books",
    "used textbooks",
    "book exchange",
    "student community",
  ],
  authors: [{ name: "CampusNova Team", url: "https://campusnova.in" }],
  creator: "CampusNova",
  publisher: "CampusNova",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://campusnova.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "CampusNova - India's Premium Student Ecosystem",
    description:
      "Buy & sell old books directly with students. Save up to 70% on textbooks for NEET, JEE, UPSC & more.",
    url: "https://campusnova.in",
    siteName: "CampusNova",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CampusNova - Student Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusNova - India's Premium Student Ecosystem",
    description:
      "Buy & sell old books directly with students. Save up to 70% on textbooks.",
    images: ["/og-image.png"],
    creator: "@campusnova",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
    apple: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  manifest: "/manifest.json",
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
