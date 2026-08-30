"use client";
import React from "react";
import { useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useRouter } from "next/navigation";
import { PaymentContext } from "@/app/service-details/layout";
import { formatThaiServiceDate, formatThaiServiceTime } from "@/utils/serviceSchedule";

export default function MobileFooterTwo() {
	const payment = React.useContext(PaymentContext);
	const [summaryExpanded, setSummaryExpanded] = useState(true);
	const router = useRouter();

	if (!payment) {
		throw new Error("MobileFooterTwo must be rendered inside PaymentProvider");
	}

	const { serviceDetail, serviceFormData, totAmount, isSecondPageCompleted, serviceId } = payment;
	const selectedServices = serviceDetail.filter((service) => service.quantity !== 0);
	const address = [
		serviceFormData.address,
		serviceFormData.district,
		serviceFormData.subdistrict,
		serviceFormData.province,
	]
		.filter(Boolean)
		.join(" ");

	function handleBack(): void {
		router.push(`/service-details/${serviceId}`);
	}

	function handleNext(): void {
		if (isSecondPageCompleted) {
			router.push("/service-details/payment");
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
						aria-label={summaryExpanded ? "ซ่อนรายละเอียดสรุปรายการ" : "แสดงรายละเอียดสรุปรายการ"}
						aria-expanded={summaryExpanded}
					>
						{summaryExpanded ? <KeyboardArrowDownRoundedIcon className="text-[18px]" /> : <KeyboardArrowUpRoundedIcon className="text-[18px]" />}
					</button>
				</div>
			<div className={summaryExpanded ? "block" : "hidden"}>
				<div className="mt-2 space-y-2 border-b border-gray-200 pb-3 text-[10px] text-gray-700">
					{selectedServices.map((service, index) => (
						<div key={`service-${service.service_id || "0"}-${service.option_id || "0"}-${index}`} className="flex items-start justify-between gap-2">
							<span>{service.option_name}</span>
							<span className="shrink-0">{service.quantity} {service.unit}</span>
						</div>
					))}
				</div>
				<div className="space-y-2 border-b border-gray-200 py-3 text-[10px]">
					<SummaryRow label="วันที่" value={formatThaiServiceDate(serviceFormData.serviceDate)} />
					<SummaryRow label="เวลา" value={formatThaiServiceTime(serviceFormData.serviceTime)} />
					<SummaryRow label="สถานที่" value={address} />
				</div>
			</div>
			<div className="mt-3 flex items-center justify-between text-xs">
				<span className="text-gray-500">รวม</span>
				<span className="font-semibold text-black">{totAmount.toFixed(2)} ฿</span>
			</div>
			<div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
				<button type="button" onClick={handleBack} className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] border border-blue-500 text-xs font-medium text-blue-600">
					<ChevronLeftRoundedIcon className="text-[17px]" />
					ย้อนกลับ
				</button>
				<button
					type="button"
					disabled={!isSecondPageCompleted}
					onClick={handleNext}
					className={`flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] text-xs font-medium text-white disabled:cursor-not-allowed ${isSecondPageCompleted ? "bg-blue-500" : "bg-[#d0d5df]"}`}
				>
					ดำเนินการต่อ
					<ChevronRightRoundedIcon className="text-[17px]" />
				</button>
			</div>
			</aside>

			<aside className="hidden h-fit rounded-lg border border-gray-200 bg-white p-3 min-[801px]:block">
				<h2 className="text-sm font-medium text-gray-500">สรุปรายการ</h2>
				<div className="mt-2 space-y-2 border-b border-gray-200 pb-3 text-[10px] text-gray-700">
					{selectedServices.map((service, index) => (
						<div key={`service-${service.service_id || "0"}-${service.option_id || "0"}-${index}`} className="flex items-start justify-between gap-2">
							<span>{service.option_name}</span>
							<span className="shrink-0">{service.quantity} {service.unit}</span>
						</div>
					))}
				</div>
				<div className="space-y-2 border-b border-gray-200 py-3 text-[10px]">
					<SummaryRow label="วันที่" value={formatThaiServiceDate(serviceFormData.serviceDate)} />
					<SummaryRow label="เวลา" value={formatThaiServiceTime(serviceFormData.serviceTime)} />
					<SummaryRow label="สถานที่" value={address} />
				</div>
				<div className="mt-3 flex items-center justify-between text-xs">
					<span className="text-gray-500">รวม</span>
					<span className="font-semibold text-black">{totAmount.toFixed(2)} ฿</span>
				</div>
			</aside>

			<footer className="fixed inset-x-0 bottom-0 z-30 hidden h-16 border-t border-gray-200 bg-white min-[801px]:block">
				<div className="mx-auto flex h-full w-[min(644px,calc(100%-48px))] items-center justify-between">
					<button type="button" onClick={handleBack} className="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] border border-blue-500 px-6 text-xs font-medium text-blue-600">
						<ChevronLeftRoundedIcon className="text-[17px]" />
						ย้อนกลับ
					</button>
					<button
						type="button"
						disabled={!isSecondPageCompleted}
						onClick={handleNext}
						className={`flex h-8 cursor-pointer items-center justify-center gap-1 rounded-[7px] px-5 text-xs font-medium text-white disabled:cursor-not-allowed ${isSecondPageCompleted ? "bg-blue-500" : "bg-[#d0d5df]"}`}
					>
						ดำเนินการต่อ
						<ChevronRightRoundedIcon className="text-[17px]" />
					</button>
				</div>
			</footer>
		</>
	);
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-3">
			<span className="text-gray-500">{label}</span>
			<span className="text-right text-gray-800">{value}</span>
		</div>
	);
}