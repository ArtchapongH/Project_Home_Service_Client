"use client";

import { useState } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Image from "next/image";
import serviceDetailBanner from "@/assets/images/service-detail-banner.png";
import MobileFooterThree from "./mobile-footer3";

type PaymentMethod = "promptpay" | "card";

export default function HeroSectionThree() {
	const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
	const [form, setForm] = useState({ cardNumber: "", cardholder: "", expiry: "", cvc: "", promotionCode: "" });

	function updateField(field: keyof typeof form, value: string): void {
		setForm((currentForm) => ({ ...currentForm, [field]: value }));
	}

	return (
		<section className="min-h-screen bg-utility-bg pb-24 min-[801px]:pb-10">
			<div className="relative h-34.5 overflow-hidden bg-[#315d9a] min-[801px]:h-35">
				<Image src={serviceDetailBanner} alt="บริการล้างเครื่องปรับอากาศ" fill priority className="object-cover object-center opacity-75" />
				<div className="absolute inset-0 bg-[#17396f]/20" />
				<div className="absolute left-3 top-11 flex h-10 items-center rounded-[7px] bg-white px-3 text-sm shadow-sm min-[801px]:left-1/2 min-[801px]:top-10 min-[801px]:-translate-x-1/2">
					<span className="text-gray-500">บริการของเรา</span>
					<ChevronRightRoundedIcon className="mx-1 text-[17px] text-gray-500" />
					<span className="font-semibold text-blue-600">ล้างแอร์</span>
				</div>
			</div>

			<div className="relative z-10 -mt-11 mx-3 rounded-lg border border-gray-200 bg-white px-3 py-3 min-[801px]:mx-auto min-[801px]:w-[min(672px,calc(100%-48px))] min-[801px]:px-10 min-[801px]:py-5">
				<div className="absolute left-[16.67%] right-[16.67%] top-6.25 h-px bg-blue-500" />
				<div className="relative grid grid-cols-3">
					<Step icon={<ReceiptLongOutlinedIcon className="text-[16px]" />} label="รายการ" active />
					<Step icon={<EditOutlinedIcon className="text-[16px]" />} label="กรอกข้อมูลบริการ" active />
					<Step icon={<CreditCardOutlinedIcon className="text-[16px]" />} label="ชำระเงิน" active />
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
							<input type="text" inputMode="numeric" value={form.cardNumber} onChange={(event) => updateField("cardNumber", event.target.value)} placeholder="กรุณากรอกหมายเลขบัตรเครดิต" className={inputClass} />
						</Field>
						<Field label="ชื่อบนบัตร" required className="min-[801px]:col-span-2">
							<input type="text" value={form.cardholder} onChange={(event) => updateField("cardholder", event.target.value)} placeholder="กรุณากรอกชื่อบนบัตร" className={inputClass} />
						</Field>
						<Field label="วันหมดอายุ" required>
							<input type="text" inputMode="numeric" value={form.expiry} onChange={(event) => updateField("expiry", event.target.value)} placeholder="MM/YY" className={inputClass} />
						</Field>
						<Field label="รหัส CVC / CVV" required>
							<input type="text" inputMode="numeric" value={form.cvc} onChange={(event) => updateField("cvc", event.target.value)} placeholder="xxx" className={inputClass} />
						</Field>
					</div>
				)}

					<div className="mt-4 border-t border-gray-200 pt-4">
					<label className="block text-sm font-medium text-gray-700">Promotion Code</label>
					<div className="mt-1 grid grid-cols-[1fr_69px] gap-3">
						<input type="text" value={form.promotionCode} onChange={(event) => updateField("promotionCode", event.target.value)} placeholder="กรุณากรอกโค้ดส่วนลด (ถ้ามี)" className={`${inputClass} h-10`} />
						<button type="button" className="h-10 rounded-[7px] bg-blue-500 text-sm font-medium text-white">ใช้โค้ด</button>
					</div>
					</div>
				</form>

				<MobileFooterThree />
			</div>
		</section>
	);
}

const inputClass = "h-8 w-full rounded-[7px] border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-500 focus:border-blue-500";

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

function Step({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
	return (
		<div className={`flex flex-col items-center text-center ${active ? "text-blue-600" : "text-gray-500"}`}>
			<span className={`flex size-7 items-center justify-center rounded-full border bg-white ${active ? "border-blue-500" : "border-gray-300"}`}>{icon}</span>
			<span className="mt-1 whitespace-nowrap text-xs font-medium">{label}</span>
		</div>
	);
}
