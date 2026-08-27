"use client";

import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import Image from "next/image";
import serviceDetailBanner from "@/assets/images/service-detail-banner.png";
import MobileFooter from "./mobile-footer";
import { PaymentContext } from "@/app/service-details/layout";
import { ServiceReviewsSection } from "@/components/services/ServiceReviewsSection";

export default function HeroSection({ serviceId }: { serviceId?: string | number }) {
	const payment = React.useContext(PaymentContext);

	if (!payment) {
		throw new Error("HeroSection must be rendered inside PaymentProvider");
	}

	const { serviceDetail, setServiceDetail } = payment;

	function changeQuantity(index: number, amount: number): void {
		setServiceDetail((currentServiceDetails) =>
			currentServiceDetails.map((service, serviceIndex) =>
				serviceIndex === index
					? { ...service, quantity: Math.max(0, service.quantity + amount) }
					: service,
			),
		);
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
				<div className="absolute left-3 top-11 flex h-10 items-center rounded-[7px] bg-white px-3 text-sm shadow-sm min-[801px]:left-1/2 min-[801px]:top-10 min-[801px]:-translate-x-1/2">
					<span className="text-gray-500">บริการของเรา</span>
					<ChevronRightRoundedIcon className="mx-1 text-[17px] text-gray-500" />
					<span className="font-semibold text-blue-600">ล้างแอร์</span>
				</div>
			</div>

			<div className="relative z-10 -mt-11 mx-3 rounded-lg border border-gray-200 bg-white px-3 py-3 min-[801px]:mx-auto min-[801px]:w-[min(664px,calc(100%-48px))] min-[801px]:px-8 min-[801px]:py-5">
				<div className="absolute left-[16.67%] right-[16.67%] top-6.25 h-px bg-gray-200" />
				<div className="relative grid grid-cols-3">
					<Step icon={<ReceiptLongOutlinedIcon className="text-[16px]" />} label="รายการ" active />
					<Step icon={<EditOutlinedIcon className="text-[16px]" />} label="กรอกข้อมูลบริการ" />
					<Step icon={<CreditCardOutlinedIcon className="text-[16px]" />} label="ชำระเงิน" />
				</div>
			</div>

			<div className="mx-3 mt-3 min-[801px]:mx-auto min-[801px]:grid min-[801px]:w-[min(664px,calc(100%-48px))] min-[801px]:grid-cols-[435px_207px] min-[801px]:gap-5">
				<div className="space-y-4">
					<div className="rounded-lg border border-gray-200 bg-white p-3 min-[801px]:p-3.5">
						<h1 className="text-base font-semibold text-gray-500">เลือกรายการบริการ</h1>
						<div className="mt-2">
						{serviceDetail.map((service, index) => (
							<div
								key={`${service.serviceDetail}-${index}`}
								className="flex items-center justify-between border-b border-gray-200 py-3 last:border-b-0 last:pb-0"
							>
								<div className="pr-3">
									<p className="text-sm font-semibold leading-5 text-black">{service.serviceDetail}</p>
									<p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
										<LocalOfferOutlinedIcon className="text-[14px]" />
										{service.pricePerUnit} ฿ / {service.unit}
									</p>
								</div>
								<div className="flex shrink-0 items-center gap-3">
									<QuantityButton
										label="ลดจำนวน"
										onClick={() => changeQuantity(index, -1)}
										icon={<RemoveRoundedIcon className="text-[18px]" />}
									/>
									<span className="w-2 text-center text-sm font-medium text-gray-700">{service.quantity}</span>
									<QuantityButton
										label="เพิ่มจำนวน"
										onClick={() => changeQuantity(index, 1)}
										icon={<AddRoundedIcon className="text-[18px]" />}
									/>
								</div>
							</div>
						))}
						</div>
					</div>

					{/* Customer Reviews Section */}
					<ServiceReviewsSection serviceId={serviceId || 1} />
				</div>

				<MobileFooter />
			</div>
		</section>
	);
}

function Step({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
	return (
		<div className={`flex flex-col items-center text-center ${active ? "text-blue-600" : "text-gray-500"}`}>
			<span className={`flex size-7 items-center justify-center rounded-full border bg-white ${active ? "border-blue-500" : "border-gray-300"}`}>
				{icon}
			</span>
			<span className="mt-1 text-xs font-medium whitespace-nowrap">{label}</span>
		</div>
	);
}

function QuantityButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={label}
			className="flex size-7 items-center justify-center rounded-[7px] border border-blue-500 text-blue-600"
		>
			{icon}
		</button>
	);
}
