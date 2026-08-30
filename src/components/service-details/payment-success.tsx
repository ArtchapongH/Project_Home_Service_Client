"use client";

import React, { useContext, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { PaymentContext } from "@/app/service-details/layout";
<<<<<<< HEAD
import {
  formatThaiServiceDate,
  formatThaiServiceTime,
} from "@/utils/serviceSchedule";

export default function PaymentSuccess() {
  const payment = React.useContext(PaymentContext);

  if (!payment) {
    throw new Error("PaymentSuccess must be rendered inside PaymentProvider");
  }

  const { serviceDetail, serviceFormData, totAmount, discount } = payment;
  const selectedServices = serviceDetail.filter(
    (service) => service.quantity !== 0,
  );
  const address = [
    serviceFormData.address,
    serviceFormData.subdistrict,
    serviceFormData.district,
    serviceFormData.province,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="min-h-screen bg-utility-bg px-2 pt-6 min-[801px]:flex min-[801px]:items-start min-[801px]:justify-center min-[801px]:px-6 min-[801px]:pt-7">
      <div className="w-full rounded-[7px] border border-gray-200 bg-white px-2.5 py-6 shadow-[0_1px_3px_rgb(23_51_109/6%)] min-[801px]:w-87 min-[801px]:px-9.5 min-[801px]:py-7.5">
        <div className="flex flex-col items-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-[#006f7e] text-white min-[801px]:size-12">
            <CheckRoundedIcon className="text-[31px] min-[801px]:text-[34px]" />
          </span>
          <h1 className="mt-3 text-base font-semibold text-[#17396f] min-[801px]:text-xl">
            ชำระเงินเรียบร้อย !
          </h1>
        </div>

        <div className="mt-4 space-y-2 border-b border-gray-200 pb-3 text-[10px] text-gray-700">
          {selectedServices.length > 0 ? (
            selectedServices.map((service, index) => (
              <div
                key={`service-${service.service_id || "0"}-${service.option_id || "0"}-${index}`}
                className="flex items-start justify-between gap-2"
              >
                <span>{service.option_name}</span>
                <span className="shrink-0 text-gray-500">
                  {service.quantity} {service.unit}
                </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">ไม่พบรายการบริการ</p>
          )}
        </div>

        <div className="space-y-1.5 border-b border-gray-200 py-3 text-[10px]">
          <SummaryRow
            label="วันที่"
            value={formatThaiServiceDate(serviceFormData.serviceDate)}
          />
          <SummaryRow
            label="เวลานัดหทาย"
            value={formatThaiServiceTime(serviceFormData.serviceTime)}
          />
          <SummaryRow label="สถานที่" value={address || "-"} />
        </div>

        {discount > 0 ? (
          <div className="mt-3 flex items-center justify-between text-[10px]">
            <span className="text-gray-500">ส่วนลด</span>
            <span className="text-red-500">-{discount.toFixed(2)} ฿</span>
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">รวม</span>
          <span className="font-semibold text-black">
            {totAmount.toFixed(2)} ฿
          </span>
        </div>

        <Link
          href="/customer-services"
          className="mt-4 flex h-8 items-center justify-center rounded-[7px] bg-blue-500 text-xs font-medium text-white"
        >
          เช็ครายการซ่อม
        </Link>
      </div>
    </section>
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
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className="text-right text-gray-800">{value}</span>
    </div>
=======
import { saveLocalStoredOrder } from "@/services/customerOrderApi";
import { formatThaiServiceDate, formatThaiServiceTime } from "@/utils/serviceSchedule";

export interface PaymentSuccessProps {
  serviceName?: string;
  quantityText?: string;
  dateText?: string;
  timeText?: string;
  locationText?: React.ReactNode;
  totalPriceText?: string;
  orderListHref?: string;
}

export function PaymentSuccess(props: PaymentSuccessProps) {
  const paymentContext = useContext(PaymentContext);
  const isSavedRef = useRef(false);

  const selectedServices = useMemo(
    () => paymentContext?.serviceDetail?.filter((s) => s.quantity > 0) || [],
    [paymentContext?.serviceDetail]
  );
  const addressString = paymentContext?.serviceFormData
    ? [
        paymentContext.serviceFormData.address,
        paymentContext.serviceFormData.district,
        paymentContext.serviceFormData.subdistrict,
        paymentContext.serviceFormData.province,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  const rawDate = paymentContext?.serviceFormData?.serviceDate;
  const finalDate = rawDate ? formatThaiServiceDate(rawDate) : (props.dateText || "23 เม.ย. 2021");
  const rawTime = paymentContext?.serviceFormData?.serviceTime;
  const finalTime = rawTime ? formatThaiServiceTime(rawTime) : (props.timeText || "11.00 น.");
  const finalLocation = addressString || props.locationText || (
    <>
      444/4 คอนโดศุภาลัย เสนานิคม
      <br />
      จตุจักร กรุงเทพฯ
    </>
  );
  const finalTotalPrice = paymentContext?.totAmount !== undefined && paymentContext?.totAmount > 0
    ? `${paymentContext.totAmount.toFixed(2)} ฿`
    : (props.totalPriceText || "1550.00 ฿");
  const orderListHref = props.orderListHref || "/customer-services";

  useEffect(() => {
    if (isSavedRef.current) return;
    if (selectedServices.length > 0) {
      isSavedRef.current = true;
      const generatedCode = `AD${Math.floor(10000000 + Math.random() * 90000000)}`;
      saveLocalStoredOrder({
        id: `ord-${Date.now()}`,
        orderCode: generatedCode,
        status: "pending",
        statusText: "รอดำเนินการ",
        scheduledDate: paymentContext?.serviceFormData?.serviceDate || "25/04/2567",
        scheduledTime: paymentContext?.serviceFormData?.serviceTime || "13.00 น.",
        technicianName: "สมาน เยี่ยมยอด",
        address: addressString,
        totalPrice: paymentContext?.totAmount || 1550,
        items: selectedServices.map((s, idx) => ({
          id: `item-${idx}`,
          name: s.option_name || (s as unknown as { serviceDetail?: string }).serviceDetail || "บริการซ่อมบำรุง",
          quantity: s.quantity,
          unit: s.unit || "เครื่อง",
          price: s.price ?? (s as unknown as { pricePerUnit?: number }).pricePerUnit ?? 0,
        })),
        createdAt: new Date().toISOString(),
      });
    }
  }, [selectedServices, paymentContext, addressString]);

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
              {selectedServices.length > 0 ? (
                <div className="space-y-2">
                  {selectedServices.map((service, index) => (
                    <div key={`${service.option_name || index}-${index}`} className="flex items-center justify-between gap-3 text-sm sm:text-[15px]">
                      <span className="font-normal text-[#334155]">{service.option_name || (service as unknown as { serviceDetail?: string }).serviceDetail}</span>
                      <span className="shrink-0 text-[#64748B]">{service.quantity} {service.unit || "รายการ"}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3 text-sm sm:text-[15px]">
                  <span className="font-normal text-[#334155]">{props.serviceName || "9,000 - 18,000 BTU, แบบติดผนัง"}</span>
                  <span className="shrink-0 text-[#64748B]">{props.quantityText || "2 รายการ"}</span>
                </div>
              )}
            </div>

            {/* Booking Details */}
            <div className="space-y-3.5 border-b border-[#E2E8F0] py-4 text-sm">
              <SummaryRow label="วันที่" value={finalDate} />
              <SummaryRow label="เวลา" value={finalTime} />
              <SummaryRow label="สถานที่" value={finalLocation} />
            </div>

            {paymentContext?.discount && paymentContext.discount > 0 ? (
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[#64748B]">ส่วนลด</span>
                <span className="font-medium text-red-500">-{paymentContext.discount.toFixed(2)} ฿</span>
              </div>
            ) : null}

            {/* Total Price */}
            <div className="mt-4 flex items-center justify-between text-sm sm:text-base">
              <span className="text-[#64748B]">รวม</span>
              <span className="text-lg sm:text-xl font-bold text-[#0F172A]">
                {finalTotalPrice}
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
>>>>>>> 9fa651c099260f19ee029cab9ee17290d05f1caa
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
