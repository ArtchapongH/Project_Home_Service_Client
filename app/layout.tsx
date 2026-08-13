import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/src/components/providers/AppProviders";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home Service",
  description: "Home service application",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
