import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Live2DWidgetHost from "./Live2DWidgetHost";
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
  title: "Next Live2D",
  description: "A Next.js project with Live2D integration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main>{children}</main>

        <Live2DWidgetHost />

      </body>
    </html>
  );
}
