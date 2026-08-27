"use client";

import Link from "next/link";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import type {
  CustomerServiceOrder,
  CustomerServiceStatus,
} from "@/types/customer-service";

interface CustomerServiceCardProps {
  order: CustomerServiceOrder;
  onViewDetail?: (orderId: string) => void;
  onReview?: (order: CustomerServiceOrder) => void;
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
  onReview,
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

        {/* Action Button: Detail for active orders, Review for history orders */}
        {!isHistory ? (
          <div className="shrink-0 pt-2 sm:pt-0">
            {onViewDetail ? (
              <button
                type="button"
                onClick={() => onViewDetail(order.id)}
                className="inline-flex min-h-[38px] items-center justify-center rounded-lg bg-[#3366FF] px-5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#2554DB] hover:shadow-[0_4px_14px_rgba(51,102,255,0.25)] active:translate-y-0 active:scale-[0.98]"
              >
                ดูรายละเอียด
              </button>
            ) : (
              <Link
                href={`/customer-services/${order.id}`}
                className="inline-flex min-h-[38px] items-center justify-center rounded-lg bg-[#3366FF] px-5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:bg-[#2554DB] hover:shadow-[0_4px_14px_rgba(51,102,255,0.25)] active:translate-y-0 active:scale-[0.98]"
              >
                ดูรายละเอียด
              </Link>
            )}
          </div>
        ) : (
          <div className="shrink-0 pt-2 sm:pt-0">
            {order.isReviewed ? (
              <button
                type="button"
                onClick={() => onReview && onReview(order)}
                title="คลิกเพื่อดูหรือแก้ไขรีวิว"
                className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-1.5 text-xs sm:text-sm font-medium text-[#475569] shadow-sm transition-all duration-200 hover:border-[#CBD5E1] hover:bg-[#F1F5F9] hover:text-[#1E293B] active:scale-[0.98]"
              >
                <StarRoundedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />
                <span>รีวิวแล้ว ({order.reviewRating || 5}/5)</span>
                <span className="ml-1 text-[11px] text-[#94A3B8] group-hover:text-[#64748B] underline decoration-dotted">
                  แก้ไข
                </span>
              </button>
            ) : (

              <button
                type="button"
                onClick={() => onReview && onReview(order)}
                className="group inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-[#3366FF]/30 bg-[#F0F5FF] px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#3366FF] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-[#3366FF] hover:bg-[#3366FF] hover:text-white hover:shadow-[0_6px_16px_rgba(51,102,255,0.22)] active:translate-y-0 active:scale-[0.98]"
              >
                <StarRoundedIcon
                  sx={{
                    fontSize: 19,
                    color: "#F59E0B",
                    transition: "transform 0.3s ease, color 0.3s ease",
                  }}
                  className="group-hover:scale-110 group-hover:!text-[#FDE047]"
                />
                <span>ให้คะแนนและรีวิว</span>
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default CustomerServiceCard;
