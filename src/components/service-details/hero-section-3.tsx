"use client";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import Image from "next/image";
import serviceDetailBanner from "@/assets/images/service-detail-banner.png";
import MobileFooterThree from "./mobile-footer3";
import { getServiceBreadcrumbName, PaymentContext } from "@/app/service-details/layout";
import { useAuth } from "@/contexts/AuthContext";

import {
	CardNumberElement,
	CardExpiryElement,
	CardCvcElement,
} from "@stripe/react-stripe-js";

import createIcon1 from "@/assets/icons/create_black_24dp 1.png";
import createIcon2 from "@/assets/icons/create_black_24dp 2.png";
import createIcon3 from "@/assets/icons/create_black_24dp 3.png";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const activeStepIconClass = "brightness-0 saturate-100 invert-[48%] sepia-[99%] saturate-[2547%] hue-rotate-[205deg] brightness-[99%] contrast-[91%]";

interface PromotionResponse {
	promotion_id: string;
	promotion_code: string;
	quota: number;
	quota_used: number;
	type: "Percent" | "Fixed";
	discount: number;
}

export default function HeroSectionThree() {
	const payment = React.useContext(PaymentContext);
	const { user } = useAuth();

	const [promotion, setPromotion] = React.useState<PromotionResponse | null>(null);

	if (!payment) {
		throw new Error("HeroSection must be rendered inside PaymentProvider");
	}

	const { paymentFormData, setPaymentFormData, paymentMethod, setPaymentMethod, setDiscount, setDiscountType, setNewQuota, totAmount, setTotAmount, setUserId, serviceTitle, serviceDetail } = payment;

	// Store userId from AuthContext
	React.useEffect(() => {
		if (user?.id) {
			setUserId(user.id);
			console.log("User ID set in PaymentContext:", user.id);
		}
	}, [user, setUserId]);


	async function handleClick(): Promise<void> {
		const promotionCode = paymentFormData.promotionCode.trim();

		if (!promotionCode) {
			return;
		}

		try {
			const url = new URL(`${API_BASE_URL}/api/promotions`);
			url.searchParams.set("promotionCode", promotionCode);

			const response = await fetch(url.toString(), {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				const errorMessage = errorData.message || `Request failed with status ${response.status}`;
				
				if (response.status === 404) {
					alert("ไม่พบโค้ดส่วนลดนี้ กรุณาตรวจสอบอีกครั้ง");
				} else if (response.status === 400) {
					alert("โค้ดส่วนลดนี้ถูกใช้งานหมดแล้ว");
				} else {
					alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
				}
				console.error("Failed to apply promotion code:", errorMessage);
				return;
			}

			const result: PromotionResponse = await response.json();
			
			setPromotion(result);

			// ทำไมไม่มี promotion_code
			const { type, discount, quota_used } = result;
			const discountNum = Number(discount);

			setDiscountType(type);
			setNewQuota(quota_used + 1);

			let discountAmount = 0;
			if (type === "Percent") {
				discountAmount = (discountNum / 100) * totAmount;
				setDiscount(discountAmount);
			} else {
				discountAmount = discountNum;
				setDiscount(discountNum);
			}

			// Update totAmount by subtracting discount
			const newTotAmount = totAmount - discountAmount;
			setTotAmount(newTotAmount);
			
			alert("ใช้โค้ดส่วนลดสำเร็จ!");
		} catch (error) {
			console.error("Failed to apply promotion code:", error);
			alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
		}
	}

	function updateField(field: keyof typeof paymentFormData, value: string): void {
		setPaymentFormData((currentForm) => ({ ...currentForm, [field]: value }));
	}

	return (
		<section className="min-h-screen bg-utility-bg pb-24 min-[801px]:pb-10">
			<div className="relative h-34.5 overflow-hidden bg-[#315d9a] min-[801px]:h-35">
				<Image src={serviceDetailBanner} alt="บริการล้างเครื่องปรับอากาศ" fill priority className="object-cover object-center opacity-75" />
				<div className="absolute inset-0 bg-[#17396f]/20" />
				<div className="absolute left-3 top-11 flex h-10 items-center rounded-[7px] bg-white px-3 text-sm shadow-sm min-[801px]:left-1/2 min-[801px]:top-10 min-[801px]:-translate-x-1/2">
					<span className="text-gray-500">บริการของเรา</span>
					<ChevronRightRoundedIcon className="mx-1 text-[17px] text-gray-500" />
					<span className="font-semibold text-blue-600">{getServiceBreadcrumbName(serviceTitle, serviceDetail)}</span>
				</div>
			</div>

			<div className="relative z-10 -mt-11 mx-3 rounded-lg border border-gray-200 bg-white px-3 py-3 min-[801px]:mx-auto min-[801px]:w-[min(672px,calc(100%-48px))] min-[801px]:px-10 min-[801px]:py-5">
				<div className="absolute left-[calc(16.67%+14px)] right-[calc(16.67%+14px)] top-[26px] h-0.5 bg-blue-500 min-[801px]:top-[34px]" />
				<div className="relative grid grid-cols-3">
					<Step icon={<Image className="brightness-0 invert" src={createIcon3} alt="" width={16} height={16} aria-hidden />} label="รายการ" completed />
					<Step icon={<Image className="brightness-0 invert" src={createIcon1} alt="" width={16} height={16} aria-hidden />} label="กรอกข้อมูลบริการ" completed />
					<Step icon={<Image className={activeStepIconClass} src={createIcon2} alt="" width={16} height={16} aria-hidden />} label="ชำระเงิน" active />
				</div>
			</div>

			<div className="mx-3 mt-3 min-[801px]:mx-auto min-[801px]:grid min-[801px]:w-[min(672px,calc(100%-48px))] min-[801px]:grid-cols-[441px_211px] min-[801px]:gap-5">
				<form className="rounded-lg border border-gray-200 bg-white p-3 min-[801px]:p-3.5" onSubmit={(event) => event.preventDefault()}>
					<h1 className="text-base font-semibold text-gray-500">ชำระเงิน</h1>
					<div className="mt-3 grid grid-cols-2 gap-3">
						<PaymentOption icon={<QrCode2RoundedIcon className="text-[28px]" />} label="พร้อมเพย์" selected={paymentMethod === "promptpay"} onClick={() => setPaymentMethod("promptpay")} />
						<PaymentOption icon={<CreditCardOutlinedIcon className="text-[28px]" />} label="บัตรเครดิต" selected={paymentMethod === "card"} onClick={() => setPaymentMethod("card")} />
					</div>

					{paymentMethod === "card" && (
						<div className="mt-4 space-y-3 min-[801px]:grid min-[801px]:grid-cols-2 min-[801px]:gap-x-3 min-[801px]:gap-y-3 min-[801px]:space-y-0">
							<Field label="หมายเลขบัตรเครดิต" required className="min-[801px]:col-span-2">
								<div className={`${inputClass} flex items-center`}>
									<CardNumberElement
										options={cardElementOptions}
										className="w-full"
										onChange={(event: { complete: boolean }) => setPaymentFormData((currentForm) => ({ ...currentForm, creditCardNumberComplete: event.complete }))}
									/>
								</div>
							</Field>
							<Field label="ชื่อบนบัตร" required className="min-[801px]:col-span-2">
								<input type="text" value={paymentFormData.creditCardName} onChange={(event) => updateField("creditCardName", event.target.value)} placeholder="กรุณากรอกชื่อบนบัตร" className={inputClass} />
							</Field>
							<Field label="วันหมดอายุ" required>
								<div className={`${inputClass} flex items-center`}>
									<CardExpiryElement
										options={cardElementOptions}
										className="w-full"
										onChange={(event: { complete: boolean }) => setPaymentFormData((currentForm) => ({ ...currentForm, creditCardExpiryComplete: event.complete }))}
									/>
								</div>
							</Field>
							<Field label="รหัส CVC / CVV" required>
								<div className={`${inputClass} flex items-center`}>
									<CardCvcElement
										options={cardElementOptions}
										className="w-full"
										onChange={(event: { complete: boolean }) => setPaymentFormData((currentForm) => ({ ...currentForm, creditCardCVCComplete: event.complete }))}
									/>
								</div>
							</Field>
						</div>
					)}

					<div className="mt-4 border-t border-gray-200 pt-4">
						<label className="block text-sm font-medium text-gray-700">Promotion Code</label>
						<div className="mt-1 grid grid-cols-[1fr_69px] gap-3">
							<input type="text" value={paymentFormData.promotionCode} onChange={(event) => updateField("promotionCode", event.target.value)} placeholder="กรุณากรอกโค้ดส่วนลด (ถ้ามี)" className={`${inputClass} h-10`} />
							<button type="button" onClick={handleClick} className="h-10 rounded-[7px] bg-blue-500 text-sm font-medium text-white">ใช้โค้ด</button>
						</div>
					</div>
				</form>

				<MobileFooterThree promotion={promotion}/>
			</div>
		</section>
	);
}

const inputClass = "h-8 w-full rounded-[7px] border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-500 focus:border-blue-500";

const cardElementOptions = {
	style: {
		base: {
			fontSize: "14px",
			color: "#374151",
			fontFamily: "Arial, sans-serif",
			"::placeholder": {
				color: "#6b7280"
			}
		},
		invalid: {
			color: "#dc2626"
		}
	}
};

function Field({ children, className = "", label, required = false }: { children: React.ReactNode; className?: string; label: string; required?: boolean }) {
	return (
		<label className={`block text-sm font-medium text-gray-700 ${className}`}>
			<span className="mb-1 block">{label}{required && <span className="text-red-500">*</span>}</span>
			{children}
		</label>
	);
}

function PaymentOption({ icon, label, onClick, selected }: { icon: React.ReactNode; label: string; onClick: () => void; selected: boolean }) {
	return (
		<button type="button" onClick={onClick} className={`flex h-18.25 flex-col items-center justify-center rounded-[7px] border text-sm font-medium ${selected ? "border-blue-500 bg-blue-100 text-blue-600" : "border-gray-200 bg-white text-gray-700"}`}>
			{icon}
			<span className="mt-1">{label}</span>
		</button>
	);
}

function Step({ icon, label, active = false, completed = false }: { icon: React.ReactNode; label: string; active?: boolean; completed?: boolean }) {
	return (
		<div className={`flex flex-col items-center text-center ${active || completed ? "text-blue-600" : "text-gray-500"}`}>
			<span className={`flex size-7 items-center justify-center rounded-full border-2 ${completed ? "border-blue-500 bg-blue-500" : active ? "border-blue-500 bg-white" : "border-gray-300 bg-white"}`}>{icon}</span>
			<span className="mt-1 whitespace-nowrap text-xs font-medium">{label}</span>
		</div>
	);
}
