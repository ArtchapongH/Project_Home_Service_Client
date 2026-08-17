import { Metadata } from "next";
import { ServiceListContent } from "@/components/services/ServiceListContent";

export const metadata: Metadata = {
  title: "บริการของเรา | HomeServices",
  description:
    "บริการซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย โดยพนักงานแม่บ้าน และช่างมืออาชีพ",
};

export default function ServicesPage() {
  return (
    <main>
      <ServiceListContent />
    </main>
  );
}
