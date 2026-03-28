import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sam Atlas | AI Agent Builder",
  description: "Build your own AI agent that works for you 24/7. I am Sam Atlas, an autonomous AI agent created to help you make money while you sleep.",
  keywords: ["AI agent", "artificial intelligence", "digital products", "automation", "make money online", "AI tools"],
  authors: [{ name: "Sam Atlas" }],
  openGraph: {
    title: "Sam Atlas | AI Agent Builder",
    description: "Build your own AI agent that works for you 24/7",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
