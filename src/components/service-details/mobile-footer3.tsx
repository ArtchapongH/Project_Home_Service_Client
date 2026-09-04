"use client";
import React from "react";
import { useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import {
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { PaymentContext } from "@/app/service-details/layout";
import {
  formatThaiServiceDate,
  formatThaiServiceTime,
} from "@/utils/serviceSchedule";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/services/apiClient";

interface MobileFooterThreeProps {
  promotion: {
    promotion_id: string;
    promotion_code: string;
    quota: number;
    quota_used: number;
    type: "Percent" | "Fixed";
    discount: number;
  } | null;
}

type ApiResponse = {
  stage?: string;
  message?: string;
  error?: string;
  paymentIntentId?: string;
  paymentIntent?: { id?: string; status?: string };
  clientSecret?: string;
  client_secret?: string;
  status?: string;
  data?: { status?: string };
};

export default function MobileFooterThree({
  promotion,
}: MobileFooterThreeProps) {
  const payment = React.useContext(PaymentContext);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const { user } = useAuth();

  if (!payment) {
    throw new Error("MobileFooterTwo must be rendered inside PaymentProvider");
  }

  const {
    serviceDetail,
    serviceFormData,
    paymentFormData,
    totAmount,
    paymentMethod,
    setIsThirdPageCompleted,
    discount,
    userId,
    setUserId,
    serviceId,
  } = payment;

  // Store userId from AuthContext
  React.useEffect(() => {
    if (user?.id) {
      setUserId(user.id);
      console.log("User ID set in PaymentContext:", user.id);
    }
  }, [user, setUserId]);

  const selectedServices = serviceDetail.filter(
    (service) => service.quantity !== 0,
  );
  const address = [
    serviceFormData.address,
    serviceFormData.district,
    serviceFormData.subdistrict,
    serviceFormData.province,
  ]
    .filter(Boolean)
    .join(" ");

  // ตรวจสอบว่ากรอกข้อมูลชำระเงินครบตามวิธีที่เลือกหรือยัง
  function isPaymentFormComplete(): boolean {
    if (paymentMethod === "promptpay") {
      return true;
    }

    return (
      paymentFormData.creditCardNumberComplete &&
      paymentFormData.creditCardName.trim().length > 0 &&
      paymentFormData.creditCardExpiryComplete &&
      paymentFormData.creditCardCVCComplete
    );
  }

  const isProcessing = isSubmitting || (paymentMethod === "card" && !stripe);

  function handleBack(): void {
    router.push("/service-details/userinfo");
  }

  async function recordCheckout(
    paymentStatus: string,
    paymentIntentId?: string,
  ): Promise<void> {
    // AuthContext is the source of truth. PaymentContext is updated in an
    // effect and may still contain null during the first checkout click.
    const checkoutUserId = user?.id ?? userId;
    const checkoutServiceId =
      serviceId || Number(selectedServices[0]?.service_id);

    if (
      !Number.isSafeInteger(Number(checkoutUserId)) ||
      Number(checkoutUserId) <= 0
    ) {
      throw new Error(
        "[validation] Please sign in with a valid customer account before checkout",
      );
    }

    if (!Number.isSafeInteger(checkoutServiceId) || checkoutServiceId <= 0) {
      throw new Error(
        "[validation] A valid service must be selected before checkout",
      );
    }

    if (
      !Number.isFinite(Number(serviceFormData.latitude)) ||
      !Number.isFinite(Number(serviceFormData.longitude))
    ) {
      throw new Error(
        "[validation] Please pin the service location on the map before checkout",
      );
    }

    await apiClient.post("/api/orders/checkout", {
        serviceId: checkoutServiceId,
        totalAmount: totAmount,
        discount,
        serviceDate: serviceFormData.serviceDate,
        serviceTime: serviceFormData.serviceTime,
        address: serviceFormData.address,
        province: serviceFormData.province,
        district: serviceFormData.district,
        subdistrict: serviceFormData.subdistrict,
        latitude: serviceFormData.latitude,
        longitude: serviceFormData.longitude,
        information: serviceFormData.information,
        promotionCode: promotion?.promotion_code || "",
        paymentMethod,
        paymentStatus,
        paymentIntentId,
        items: selectedServices.map((service) => ({
          optionId: Number(service.option_id),
          quantity: service.quantity,
          unitPrice: Number(service.price),
        })),
    });
  }

  async function handleNext(): Promise<void> {
    if (!isPaymentFormComplete() || isProcessing) {
      return;
    }

    if (paymentMethod === "promptpay") {
      setIsSubmitting(true);
      setPaymentError("");
      try {
        await recordCheckout("pending");
        setIsThirdPageCompleted(true);
        router.push("/service-details/payment-success");
      } catch (error) {
        setPaymentError(
          error instanceof Error
            ? error.message
            : "[checkout] Booking could not be recorded",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setPaymentError("ไม่พบข้อมูลบัตรเครดิต");
      return;
    }

    setIsSubmitting(true);
    setPaymentError("");

    try {
      const { data } = await apiClient.post<ApiResponse>("/api/payments/intent", {
        amount: Math.round(totAmount * 100),
      });

      const paymentIntentId = data.paymentIntentId ?? data.paymentIntent?.id;
      const clientSecret = data.clientSecret ?? data.client_secret;

      if (typeof paymentIntentId !== "string" || paymentIntentId.length === 0) {
        throw new Error("ไม่พบรหัสรายการชำระเงิน");
      }

      if (typeof clientSecret !== "string" || clientSecret.length === 0) {
        throw new Error("ไม่พบข้อมูลสำหรับยืนยันการชำระเงิน");
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: {
            name: paymentFormData.creditCardName,
          },
        },
      });

      if (result.error) {
        setPaymentError(result.error.message || "การชำระเงินไม่สำเร็จ");
        return;
      }

      const { data: statusData } = await apiClient.get<ApiResponse>(
        `/api/payments/status/${encodeURIComponent(paymentIntentId)}`,
      );

      const verifiedPaymentStatus =
        statusData.status ??
        statusData.paymentIntent?.status ??
        statusData.data?.status;
      if (verifiedPaymentStatus === "succeeded") {
        await recordCheckout(verifiedPaymentStatus, paymentIntentId);
        setIsThirdPageCompleted(true);
        router.push("/service-details/payment-success");
      } else {
        throw new Error("การชำระเงินยังไม่เสร็จสมบูรณ์");
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการชำระเงิน",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <aside className="fixed inset-x-0 bottom-0 z-30 h-fit rounded-t-lg border border-gray-200 bg-white p-3 shadow-[0_-2px_10px_rgb(23_51_109/10%)] min-[801px]:hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-500">สรุปรายการ</h2>
          <button
            type="button"
            onClick={() => setSummaryExpanded((expanded) => !expanded)}
            className="flex size-5 items-center justify-center text-gray-700"
            aria-label={
              summaryExpanded
                ? "ซ่อนรายละเอียดสรุปรายการ"
                : "แสดงรายละเอียดสรุปรายการ"
            }
            aria-expanded={summaryExpanded}
          >
            {summaryExpanded ? (
              <KeyboardArrowDownRoundedIcon className="text-[18px]" />
            ) : (
              <KeyboardArrowUpRoundedIcon className="text-[18px]" />
            )}
          </button>
        </div>
        <div className={summaryExpanded ? "block" : "hidden"}>
          <div className="mt-2 space-y-2 border-b border-gray-200 pb-3 text-[10px] text-gray-700">
            {selectedServices.map((service, index) => (
              <div
                key={`service-${service.service_id || "0"}-${service.option_id || "0"}-${index}`}
                className="flex items-start justify-between gap-2"
              >
                <span>{service.option_name}</span>
                <span className="shrink-0">
                  {service.quantity} {service.unit}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-b border-gray-200 py-3 text-[10px]">
            <SummaryRow
              label="วันที่"
              value={formatThaiServiceDate(serviceFormData.serviceDate)}
            />
            <SummaryRow
              label="เวลา"
              value={formatThaiServiceTime(serviceFormData.serviceTime)}
            />
            <SummaryRow label="สถานที่" value={address} />
          </div>
          <SummaryRow
            className="mt-3 text-xs"
            label="Promotion Code"
            value={
              <span className="text-red-500">
                {discount > 0 ? `-${discount.toFixed(2)} ฿` : "-"}
              </span>
            }
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">รวม</span>
          <span className="font-semibold text-black">
            {formatCurrency(totAmount)} ฿
          </span>
        </div>
        {paymentError && (
          <p className="mt-2 text-xs text-red-500">{paymentError}</p>
        )}
        <div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] border border-blue-500 text-xs font-medium text-blue-600"
          >
            <ChevronLeftRoundedIcon className="text-[17px]" />
            ย้อนกลับ
          </button>
          <button
            type="button"
            disabled={!isPaymentFormComplete() || isProcessing}
            onClick={handleNext}
            className={`flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] text-xs font-medium text-white disabled:cursor-not-allowed ${isPaymentFormComplete() && !isProcessing ? "bg-blue-500" : "bg-[#d0d5df]"}`}
          >
            {isSubmitting ? "กำลังดำเนินการ..." : "ดำเนินการต่อ"}
            <ChevronRightRoundedIcon className="text-[17px]" />
          </button>
        </div>
      </aside>

      <aside className="hidden h-fit rounded-lg border border-gray-200 bg-white p-3 min-[801px]:block">
        <h2 className="text-sm font-medium text-gray-500">สรุปรายการ</h2>
        <div className="mt-2 space-y-2 border-b border-gray-200 pb-3 text-[10px] text-gray-700">
          {selectedServices.map((service, index) => (
            <div
              key={`service-${service.service_id || "0"}-${service.option_id || "0"}-${index}`}
              className="flex items-start justify-between gap-2"
            >
              <span>{service.option_name}</span>
              <span className="shrink-0">
                {service.quantity} {service.unit}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-2 border-b border-gray-200 py-3 text-[10px]">
          <SummaryRow
            label="วันที่"
            value={formatThaiServiceDate(serviceFormData.serviceDate)}
          />
          <SummaryRow
            label="เวลา"
            value={formatThaiServiceTime(serviceFormData.serviceTime)}
          />
          <SummaryRow label="สถานที่" value={address} />
        </div>
        <SummaryRow
          className="mt-3 text-xs"
          label="Promotion Code"
          value={
            <span className="text-red-500">
              {discount > 0 ? `-${discount.toFixed(2)} ฿` : "-"}
            </span>
          }
        />
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">รวม</span>
          <span className="font-semibold text-black">
            {formatCurrency(totAmount)} ฿
          </span>
        </div>
      </aside>

      <footer className="fixed inset-x-0 bottom-0 z-30 hidden h-16 border-t border-gray-200 bg-white min-[801px]:block">
        <div className="mx-auto flex h-full w-[min(644px,calc(100%-48px))] items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] border border-blue-500 px-6 text-xs font-medium text-blue-600"
          >
            <ChevronLeftRoundedIcon className="text-[17px]" />
            ย้อนกลับ
          </button>
          <div className="flex items-center gap-3">
            {paymentError && (
              <p className="text-xs text-red-500">{paymentError}</p>
            )}
            <button
              type="button"
              disabled={!isPaymentFormComplete() || isProcessing}
              onClick={handleNext}
              className={`flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] px-5 text-xs font-medium text-white disabled:cursor-not-allowed ${isPaymentFormComplete() && !isProcessing ? "bg-blue-500" : "bg-[#d0d5df]"}`}
            >
              {isSubmitting ? "กำลังดำเนินการ..." : "ดำเนินการต่อ"}
              <ChevronRightRoundedIcon className="text-[17px]" />
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}

function SummaryRow({
  className = "",
  label,
  value,
}: {
  className?: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className={`flex items-start justify-between gap-3 ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span className="text-right text-gray-800">{value}</span>
    </div>
  );
}
