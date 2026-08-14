import { Metadata } from "next";
import { fetchServices } from "@/services/serviceApi";
import { ServiceListContent } from "@/components/services/ServiceListContent";

export const metadata: Metadata = {
  title: "บริการของเรา | HomeServices",
  description:
    "บริการซ่อมเครื่องใช้ไฟฟ้า ซ่อมแอร์ ทำความสะอาดบ้าน และอื่น ๆ อีกมากมาย โดยพนักงานแม่บ้าน และช่างมืออาชีพ",
};

export default async function ServicesPage() {
  const services = await fetchServices();

  return (
    <main>
      <ServiceListContent initialServices={services} />
    </main>
  );
}
