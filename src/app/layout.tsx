import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import AppProviders from "@/components/providers/AppProviders";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HomeServices | บริการดูแลบ้านโดยมืออาชีพ",
  description:
    "บริการซ่อมเครื่องใช้ไฟฟ้า ล้างแอร์ และทำความสะอาดบ้านโดยช่างมืออาชีพ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th" className={`${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-[#171b24]">
        <AppProviders>
          <SiteChrome>{children}</SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
