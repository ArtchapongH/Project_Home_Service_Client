"use client";

import React, { useContext, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PaymentContext } from "@/app/service-details/layout";
import { saveLocalStoredOrder } from "@/services/customerOrderApi";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatThaiServiceDate, formatThaiServiceTime } from "@/utils/serviceSchedule";

export interface PaymentSuccessProps {
  orderListHref?: string;
}

export function PaymentSuccess({ orderListHref = "/customer-services" }: PaymentSuccessProps) {
  const payment = useContext(PaymentContext);
  const router = useRouter();
  const isSavedRef = useRef(false);

  if (!payment) {
    throw new Error("PaymentSuccess must be rendered inside PaymentProvider");
  }

  const { serviceDetail, serviceFormData, totAmount, discount, resetPayment } = payment;
  const selectedServices = useMemo(
    () => serviceDetail.filter((service) => Number(service.quantity) > 0),
    [serviceDetail],
  );

  const handleGoToOrderList = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    resetPayment();
    router.push(orderListHref);
  };

  const address = [
    serviceFormData.address,
    serviceFormData.subdistrict,
    serviceFormData.district,
    serviceFormData.province,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isSavedRef.current || selectedServices.length === 0) return;

    isSavedRef.current = true;
    saveLocalStoredOrder({
      id: `ord-${Date.now()}`,
      orderCode: `AD${Math.floor(10000000 + Math.random() * 90000000)}`,
      status: "pending",
      statusText: "รอดำเนินการ",
      scheduledDate: formatThaiServiceDate(serviceFormData.serviceDate),
      scheduledTime: formatThaiServiceTime(serviceFormData.serviceTime),
      address,
      totalPrice: totAmount,
      discount,
      items: selectedServices.map((service, index) => ({
        id: `item-${service.option_id || index}`,
        name: service.option_name,
        quantity: service.quantity,
        unit: service.unit,
        price: Number(service.price) || 0,
      })),
      createdAt: new Date().toISOString(),
    });
  }, [address, discount, selectedServices, serviceFormData.serviceDate, serviceFormData.serviceTime, totAmount]);

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#F3F4F6] px-4 py-8 sm:py-12">
        <div className="w-full max-w-135 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] transition-all sm:p-10">
          <div className="flex flex-col items-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute size-14 rounded-full bg-[#00596C]/25 animate-success-ripple sm:size-16" />
              <div className="relative flex size-14 items-center justify-center rounded-full bg-[#00596C] text-white shadow-md animate-success-pop sm:size-16">
                <svg
                  className="h-7 w-7 sm:h-8 sm:w-8"
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

            <h1 className="mt-4 text-xl font-bold tracking-tight text-[#0F172A] animate-success-content sm:mt-5 sm:text-2xl">
              ชำระเงินเรียบร้อย !
            </h1>
          </div>

          <div className="animate-success-content">
            <div className="mt-7 border-b border-[#E2E8F0] pb-4 sm:mt-8">
              {selectedServices.length > 0 ? (
                <div className="space-y-2">
                  {selectedServices.map((service, index) => (
                    <div
                      key={`service-${service.service_id || "0"}-${service.option_id || "0"}-${index}`}
                      className="flex items-center justify-between gap-3 text-sm sm:text-[15px]"
                    >
                      <span className="font-normal text-[#334155]">{service.option_name}</span>
                      <span className="shrink-0 text-[#64748B]">
                        {service.quantity} {service.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">ไม่พบรายการบริการ</p>
              )}
            </div>

            <div className="space-y-3.5 border-b border-[#E2E8F0] py-4 text-sm">
              <SummaryRow label="วันที่นัดหมาย" value={formatThaiServiceDate(serviceFormData.serviceDate)} />
              <SummaryRow label="เวลาที่นัดหมาย" value={formatThaiServiceTime(serviceFormData.serviceTime)} />
              <SummaryRow label="สถานที่" value={address || "-"} />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm sm:text-base">
              <span className="text-[#64748B]">รวม</span>
              <span className="text-lg font-bold text-[#0F172A] sm:text-xl">{formatCurrency(totAmount)} ฿</span>
            </div>

            <div className="mt-6">
              <Link
                href={orderListHref}
                onClick={handleGoToOrderList}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-[#3366FF] text-sm font-medium text-white shadow-sm transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-[#2554DB] hover:shadow-md active:scale-[0.98] sm:h-12 sm:text-base"
              >
                เช็ครายการซ่อม
              </Link>
            </div>
          </div>
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
    <div className="flex items-start justify-between gap-4">
      <span className="shrink-0 text-[#64748B]">{label}</span>
      <span className="text-right font-medium leading-relaxed text-[#1E293B]">{value}</span>
    </div>
  );
}

export default PaymentSuccess;
