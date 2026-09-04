"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export interface PaymentSuccessProps {
  serviceName?: string;
  quantityText?: string;
  dateText?: string;
  timeText?: string;
  locationText?: React.ReactNode;
  totalPriceText?: string;
  orderListHref?: string;
}

export function PaymentSuccess({
  serviceName = "9,000 - 18,000 BTU, แบบติดผนัง",
  quantityText = "2 รายการ",
  dateText = "23 เม.ย. 2021",
  timeText = "11.00 น.",
  locationText = (
    <>
      444/4 คอนโดศุภาลัย เสนานิคม
      <br />
      จตุจักร กรุงเทพฯ
    </>
  ),
  totalPriceText = "1550.00 ฿",
  orderListHref = "/customer-services",
}: PaymentSuccessProps) {
  return (
    <ProtectedRoute>
      <section className="min-h-[calc(100vh-72px)] bg-[#F3F4F6] flex items-center justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[540px] rounded-[16px] border border-[#E2E8F0] bg-white p-6 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all">
          {/* Success Icon with Animation */}
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              {/* Subtle Expansion Ripple */}
              <div className="absolute size-14 sm:size-16 rounded-full bg-[#00596C]/25 animate-success-ripple" />

              {/* Pop-in Circle */}
              <div className="relative flex size-14 sm:size-16 items-center justify-center rounded-full bg-[#00596C] text-white shadow-md animate-success-pop">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9.5 17.5L19 7"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-checkmark-draw"
                  />
                </svg>
              </div>
            </div>

            <h1 className="mt-4 sm:mt-5 text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight animate-success-content">
              ชำระเงินเรียบร้อย !
            </h1>
          </div>

          {/* Animated Container for Details */}
          <div className="animate-success-content">
            {/* Service Item Summary */}
            <div className="mt-7 sm:mt-8 border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center justify-between gap-3 text-sm sm:text-[15px]">
                <span className="font-normal text-[#334155]">
                  {serviceName}
                </span>
                <span className="shrink-0 text-[#64748B]">{quantityText}</span>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-3.5 border-b border-[#E2E8F0] py-4 text-sm">
              <SummaryRow label="วันที่" value={dateText} />
              <SummaryRow label="เวลานัดหมาย" value={timeText} />
              <SummaryRow label="สถานที่" value={locationText} />
            </div>

            {/* Total Price */}
            <div className="mt-4 flex items-center justify-between text-sm sm:text-base">
              <span className="text-[#64748B]">รวม</span>
              <span className="text-lg sm:text-xl font-bold text-[#0F172A]">
                {totalPriceText}
              </span>
            </div>

            {/* Action Button */}
            <div className="mt-6">
              <Link
                href={orderListHref}
                className="flex h-11 sm:h-12 w-full items-center justify-center rounded-[8px] bg-[#3366FF] text-sm sm:text-base font-medium text-white shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#2554DB] hover:shadow-md active:scale-[0.98]"
              >
                เช็ครายการซ่อม
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[#64748B] shrink-0">{label}</span>
      <span className="text-right text-[#1E293B] font-medium leading-relaxed">
        {value}
      </span>
    </div>
  );
}

export default PaymentSuccess;
