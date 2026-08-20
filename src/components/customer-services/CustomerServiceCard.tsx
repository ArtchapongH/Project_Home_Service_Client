"use client";

import Link from "next/link";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import type {
  CustomerServiceOrder,
  CustomerServiceStatus,
} from "@/types/customer-service";

interface CustomerServiceCardProps {
  order: CustomerServiceOrder;
  onViewDetail?: (orderId: string) => void;
  isHistory?: boolean;
  dateLabel?: string;
}

const getStatusBadge = (
  status: CustomerServiceStatus,
  customText?: string,
) => {
  switch (status) {
    case "in_progress":
      return {
        label: customText || "กำลังดำเนินการ",
        bg: "bg-[#FEF3C7]",
        text: "text-[#D97706]",
        border: "border-[#FDE68A]",
      };
    case "completed":
      return {
        label: customText || "ดำเนินการสำเร็จ",
        bg: "bg-[#DCFCE7]",
        text: "text-[#16A34A]",
        border: "border-[#BBF7D0]",
      };
    case "cancelled":
      return {
        label: customText || "ยกเลิกแล้ว",
        bg: "bg-[#FEE2E2]",
        text: "text-[#DC2626]",
        border: "border-[#FECACA]",
      };
    case "pending":
    default:
      return {
        label: customText || "รอดำเนินการ",
        bg: "bg-[#E5E7EB]",
        text: "text-[#475569]",
        border: "border-[#D1D5DB]",
      };
  }
};

export function CustomerServiceCard({
  order,
  onViewDetail,
  isHistory = false,
  dateLabel,
}: CustomerServiceCardProps) {
  const statusBadge = getStatusBadge(order.status, order.statusText);
  const formattedPrice = order.totalPrice.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const effectiveDateLabel =
    dateLabel || (isHistory ? "วันเวลาดำเนินการสำเร็จ:" : "วันเวลาดำเนินการ:");

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <h3 className="text-base sm:text-lg font-bold text-[#1E293B]">
          คำสั่งการซ่อมรหัส : {order.orderCode}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">สถานะ:</span>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}
          >
            {statusBadge.label}
          </span>
        </div>
      </div>

      {/* Main Content Info */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left column: Date/Time & Staff */}
        <div className="space-y-2 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <EventNoteOutlinedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
            <span>
              {effectiveDateLabel} {order.scheduledDate} เวลา {order.scheduledTime}
            </span>
          </div>

          {order.technicianName && (
            <div className="flex items-center gap-2">
              <PersonOutlineOutlinedIcon sx={{ fontSize: 18, color: "#94A3B8" }} />
              <span>พนักงาน: {order.technicianName}</span>
            </div>
          )}
        </div>

        {/* Right column: Total Price */}
        <div className="flex items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0">
          <span className="text-xs text-gray-500">ราคารวม:</span>
          <span className="text-base sm:text-lg font-bold text-[#1E293B]">
            {formattedPrice} ฿
          </span>
        </div>
      </div>

      {/* Bottom Items & Optional Action Button */}
      <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-gray-100 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-1">รายการ:</p>
          <ul className="space-y-1 text-xs sm:text-sm text-gray-800">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-start gap-1.5">
                <span className="text-gray-400">•</span>
                <span>
                  {item.name}{" "}
                  {item.quantity ? `${item.quantity} ${item.unit || "เครื่อง"}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Detail Button - Only shown when not in history mode */}
        {!isHistory && (
          <div className="shrink-0 pt-2 sm:pt-0">
            {onViewDetail ? (
              <button
                type="button"
                onClick={() => onViewDetail(order.id)}
                className="inline-flex min-h-9 items-center justify-center rounded-[7px] bg-[#3366FF] px-5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#2554DB] hover:shadow-md active:scale-[0.98]"
              >
                ดูรายละเอียด
              </button>
            ) : (
              <Link
                href={`/customer-services/${order.id}`}
                className="inline-flex min-h-9 items-center justify-center rounded-[7px] bg-[#3366FF] px-5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#2554DB] hover:shadow-md active:scale-[0.98]"
              >
                ดูรายละเอียด
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CustomerServiceCard;
