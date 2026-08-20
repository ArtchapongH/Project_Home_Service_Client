import { Metadata } from "next";
import { CustomerServicesList } from "@/components/customer-services/CustomerServicesList";

export const metadata: Metadata = {
  title: "รายละเอียดคำสั่งซ่อม | HomeServices",
  description: "ดูรายละเอียดคำสั่งซ่อมและสถานะการให้บริการ",
};

export default function CustomerServiceDetailPage() {
  return <CustomerServicesList />;
}
