import React from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { useRouter } from "next/navigation";
import { PaymentContext } from "@/app/service-details/layout";

export default function MobileFooter() {
	const payment = React.useContext(PaymentContext);
	const [summaryExpanded, setSummaryExpanded] = React.useState(true);
	const router = useRouter();

	if (!payment) {
		throw new Error("HeroSection must be rendered inside PaymentProvider");
	}

	const { serviceDetail, setIsFirstPageCompleted, totAmount, setTotAmount } = payment;

	function calculateTotalAmount(): number {
		return serviceDetail
			.map((service) => service.quantity * service.price)
			.reduce((total, amount) => total + amount, 0);
	}

	React.useEffect(() => {
		const nextTotalAmount = serviceDetail
			.map((service) => service.quantity * service.price)
			.reduce((total, amount) => total + amount, 0);
		setTotAmount(nextTotalAmount);
	}, [serviceDetail, setTotAmount]);

	const selectedServices = serviceDetail.filter((service) => service.quantity !== 0);

	function handleNext(): void {
		const nextTotalAmount = calculateTotalAmount();
		setTotAmount(nextTotalAmount);

		if (nextTotalAmount === 0) {
			window.alert("กรุณาเลือกบริการอย่างน้อย 1 รายการ");
			return;
		}

		setIsFirstPageCompleted(true);
		router.push("/service-details/userinfo");
	}

	return (
		<>
			<aside className="hidden h-fit rounded-lg border border-gray-200 bg-white p-3 min-[801px]:block">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-medium text-gray-500">สรุปรายการ</h2>
					<span className="flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">{selectedServices.length}</span>
				</div>
				<div className="mt-2 space-y-2 border-b border-gray-200 pb-3 text-[10px] text-gray-500">
					{selectedServices.map((service, index) => (
						<div key={`service-${service.service_id || "0"}-${service.option_id || "0"}-${index}`} className="flex items-start justify-between gap-2">
							<span>{service.option_name}</span>
							<span className="shrink-0 text-gray-700">{service.quantity} รายการ</span>
						</div>
					))}
				</div>
				<div className="mt-3 flex items-center justify-between text-xs">
					<span className="text-gray-500">รวม</span>
					<span className="font-semibold text-black">{totAmount.toFixed(2)} ฿</span>
				</div>
			</aside>

			<aside className="fixed inset-x-0 bottom-0 z-20 h-fit rounded-t-lg border border-gray-200 bg-white p-3 shadow-[0_-2px_10px_rgb(23_51_109/10%)] min-[801px]:hidden">
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
								<span className="shrink-0">{service.quantity} รายการ</span>
							</div>
						))}
					</div>
				</div>
				<div className="mt-3 flex items-center justify-between text-xs">
					<span className="text-gray-500">รวม</span>
					<span className="font-semibold text-black">{totAmount.toFixed(2)} ฿</span>
				</div>
				<div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
					<button type="button" className="flex h-9 items-center justify-center gap-1 rounded-[7px] border border-blue-500 text-sm font-medium text-blue-600">
						<ChevronLeftRoundedIcon className="text-[18px]" />
						ย้อนกลับ
					</button>
					<button
						type="button"
						onClick={handleNext}
						className={`flex h-9 items-center justify-center gap-1 rounded-[7px] text-sm font-medium text-white ${totAmount > 0 ? "bg-blue-500" : "bg-[#d0d5df]"}`}
					>
						ดำเนินการต่อ
						<ChevronRightRoundedIcon className="text-[18px]" />
					</button>
				</div>
			</aside>

			<footer className="fixed inset-x-0 bottom-0 z-20 hidden h-16 border-t border-gray-200 bg-white min-[801px]:block">
				<div className="mx-auto flex h-full w-[min(820px,calc(100%-48px))] items-center justify-between">
				<button
					type="button"
					className="flex h-8 items-center justify-center gap-1 rounded-[7px] border border-blue-500 px-6 text-xs font-medium text-blue-600"
				>
					<ChevronLeftRoundedIcon className="text-[17px]" />
					ย้อนกลับ
				</button>
				<button
					type="button"
					onClick={handleNext}
					className="flex h-8 items-center justify-center gap-1 rounded-[7px] bg-blue-500 px-5 text-xs font-medium text-white"
				>
					ดำเนินการต่อ
					<ChevronRightRoundedIcon className="text-[17px]" />
				</button>
				</div>
			</footer>
		</>
	);
}
