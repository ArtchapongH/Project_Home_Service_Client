import { CustomerServicesList } from "@/components/customer-services/CustomerServicesList";

export const metadata = {
  title: "รายการคำสั่งซ่อม | HomeServices",
  description: "ตรวจสอบสถานะและรายการคำสั่งซ่อมของคุณ",
};

export default function ProfileOrdersPage() {
  return <CustomerServicesList />;
}
