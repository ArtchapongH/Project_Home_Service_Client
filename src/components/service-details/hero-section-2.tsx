"use client";
import React from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Image from "next/image";
import serviceDetailBanner from "@/assets/images/service-detail-banner.png";
import MobileFooterTwo from "./mobile-footer2";
import { PaymentContext } from "@/app/service-details/layout";

export default function HeroSectionTwo() {
	
	const payment = React.useContext(PaymentContext);
	
		if (!payment) {
			throw new Error("HeroSection must be rendered inside PaymentProvider");
		}
	
	const { serviceFormData, setServiceFormData, setIsSecondPageCompleted } = payment;

	function updateField(field: keyof typeof serviceFormData, value: string): void {
		setServiceFormData((currentForm) => {
			const nextForm = { ...currentForm, [field]: value };
			const isComplete = Object.entries(nextForm)
				.filter(([formField]) => formField !== "information")
				.every(([, formValue]) => formValue.trim().length > 0);

			setIsSecondPageCompleted(isComplete);
			return nextForm;
		});
	}


	return (
		<section className="min-h-screen bg-utility-bg pb-24 min-[801px]:pb-10">
			<div className="relative h-34.5 overflow-hidden bg-[#315d9a] min-[801px]:h-35">
				<Image
					src={serviceDetailBanner}
					alt="บริการล้างเครื่องปรับอากาศ"
					fill
					priority
					className="object-cover object-center opacity-75"
				/>
				<div className="absolute inset-0 bg-[#17396f]/20" />
				<div className="absolute left-3 top-9 flex h-10 items-center rounded-[7px] bg-white px-3 text-sm shadow-sm min-[801px]:left-1/2 min-[801px]:top-10 min-[801px]:-translate-x-1/2">
					<span className="text-gray-500">บริการของเรา</span>
					<ChevronRightRoundedIcon className="mx-1 text-[17px] text-gray-500" />
					<span className="font-semibold text-blue-600">ล้างแอร์</span>
				</div>
			</div>

			<div className="relative z-10 -mt-14 mx-3 rounded-lg border border-gray-200 bg-white px-3 py-3 min-[801px]:mx-auto min-[801px]:w-[min(720px,calc(100%-48px))] min-[801px]:px-10 min-[801px]:py-5">
				<div className="absolute left-[16.67%] right-[16.67%] top-6.25 h-px bg-gray-200" />
				<div className="relative grid grid-cols-3">
					<Step icon={<ReceiptLongOutlinedIcon className="text-[16px]" />} label="รายการ" />
					<Step icon={<EditOutlinedIcon className="text-[16px]" />} label="กรอกข้อมูลบริการ" active />
					<Step icon={<CreditCardOutlinedIcon className="text-[16px]" />} label="ชำระเงิน" />
				</div>
			</div>

			<div className="mx-3 mt-3 min-[801px]:mx-auto min-[801px]:grid min-[801px]:w-[min(720px,calc(100%-48px))] min-[801px]:grid-cols-[471px_224px] min-[801px]:gap-5">
				<form className="rounded-lg border border-gray-200 bg-white p-3 min-[801px]:p-3.5" onSubmit={(event) => event.preventDefault()}>
					<h1 className="text-base font-semibold text-gray-500">กรอกข้อมูลบริการ</h1>
					<div className="mt-3 space-y-3 min-[801px]:grid min-[801px]:grid-cols-2 min-[801px]:gap-x-3 min-[801px]:gap-y-3 min-[801px]:space-y-0">
					<Field label="วันที่สะดวกใช้บริการ" required>
						<input type="date" value={serviceFormData.serviceDate} onChange={(event) => updateField("serviceDate", event.target.value)} className={inputClass} />
					</Field>
					<Field label="เวลาที่สะดวกใช้บริการ" required>
						<input type="time" value={serviceFormData.serviceTime} onChange={(event) => updateField("serviceTime", event.target.value)} className={inputClass} />
					</Field>
					<Field label="ที่อยู่" required>
						<input type="text" value={serviceFormData.address} onChange={(event) => updateField("address", event.target.value)} placeholder="กรุณากรอกที่อยู่" className={inputClass} />
					</Field>
					<Field label="แขวง / ตำบล" required>
						<Select value={serviceFormData.subdistrict} onChange={(value) => updateField("subdistrict", value)} placeholder="เลือกแขวง / ตำบล" />
					</Field>
					<Field label="เขต / อำเภอ" required>
						<Select value={serviceFormData.district} onChange={(value) => updateField("district", value)} placeholder="เลือกเขต / อำเภอ" />
					</Field>
					<Field label="จังหวัด" required>
						<Select value={serviceFormData.province} onChange={(value) => updateField("province", value)} placeholder="เลือกจังหวัด" />
					</Field>
					<Field label="ระบุข้อมูลเพิ่มเติม" className="min-[801px]:col-span-2">
						<textarea value={serviceFormData.information} onChange={(event) => updateField("information", event.target.value)} placeholder="กรุณาระบุข้อมูลเพิ่มเติม" className={`${inputClass} h-17.25 resize-none py-2`} />
					</Field>
				</div>
				</form>

				<MobileFooterTwo />
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

function Select({ onChange, placeholder, value }: { onChange: (value: string) => void; placeholder: string; value: string }) {
	return (
		<select value={value} onChange={(event) => onChange(event.target.value)} className={`${inputClass} appearance-auto`}>
			<option value="" disabled>{placeholder}</option>
			<option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
			<option value="นนทบุรี">นนทบุรี</option>
			<option value="ปทุมธานี">ปทุมธานี</option>
		</select>
	);
}

function Step({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
	return (
		<div className={`flex flex-col items-center text-center ${active ? "text-blue-600" : "text-gray-500"}`}>
			<span className={`flex size-7 items-center justify-center rounded-full border bg-white ${active ? "border-blue-500" : "border-gray-300"}`}>
				{icon}
			</span>
			<span className="mt-1 whitespace-nowrap text-xs font-medium">{label}</span>
		</div>
	);
}
