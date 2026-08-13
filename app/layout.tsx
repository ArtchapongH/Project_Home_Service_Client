import type { Metadata } from "next";
<<<<<<< HEAD
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeServices | บริการดูแลบ้านโดยมืออาชีพ",
  description:
    "บริการซ่อมเครื่องใช้ไฟฟ้า ล้างแอร์ และทำความสะอาดบ้านโดยช่างมืออาชีพ",
=======
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
>>>>>>> dev
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
<<<<<<< HEAD
    <html lang="th">
      <body>
        <Navbar />
        {children}
        <Footer />
=======
    <html lang="th" className={`${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <AppProviders>{children}</AppProviders>
>>>>>>> dev
      </body>
    </html>
  );
}
