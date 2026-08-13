import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeServices | บริการดูแลบ้านโดยมืออาชีพ",
  description:
    "บริการซ่อมเครื่องใช้ไฟฟ้า ล้างแอร์ และทำความสะอาดบ้านโดยช่างมืออาชีพ",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
