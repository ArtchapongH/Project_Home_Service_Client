import { CustomerServicesHistory } from "@/components/customer-services/CustomerServicesHistory";

export const metadata = {
  title: "ประวัติการซ่อม | HomeServices",
  description: "ประวัติรายการซ่อมแซมและบริการที่เสร็จสิ้นของคุณ",
};

export default function OrdersHistoryPage() {
  return <CustomerServicesHistory />;
}
