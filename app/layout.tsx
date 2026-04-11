import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeFlow - JavaScript Visual Debugger",
  description: "Interactive JavaScript debugging tool with step-by-step execution, real-time variable inspection, and visual code flow analysis.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2310b981'/><path d='M16 8l-8 16h16z' fill='white' opacity='0.9'/><circle cx='16' cy='18' r='2' fill='%2310b981'/></svg>" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
