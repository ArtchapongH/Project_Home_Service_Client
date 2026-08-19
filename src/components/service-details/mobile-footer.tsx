import React from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { PaymentContext } from "@/app/service-details/layout";

export default function MobileFooter() {
	const payment = React.useContext(PaymentContext);
	return (
		<>
			<aside className="hidden h-fit rounded-lg border border-gray-200 bg-white p-3 min-[801px]:block">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-medium text-gray-500">สรุปรายการ</h2>
					<span className="flex size-4 items-center justify-center rounded-full bg-blue-500 text-[10px] font-semibold text-white">1</span>
				</div>
				<div className="mt-2 border-b border-gray-200 pb-3 text-[10px] text-gray-500">
					<div className="flex items-start justify-between gap-2">
						<span>9,000 - 18,000 BTU, แบบติดผนัง</span>
						<span className="shrink-0 text-gray-700">2 รายการ</span>
					</div>
				</div>
				<div className="mt-3 flex items-center justify-between text-xs">
					<span className="text-gray-500">รวม</span>
					<span className="font-semibold text-black">1,600.00 ฿</span>
				</div>
			</aside>

			<footer className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-200 bg-white">
				<div className="px-3 pt-3 pb-4 min-[801px]:hidden">
				<button
					type="button"
					className="flex w-full items-center justify-between text-left"
					aria-label="เปิดสรุปรายการ"
				>
					<span className="text-sm font-medium text-gray-500">สรุปรายการ</span>
					<KeyboardArrowDownRoundedIcon className="text-[18px] text-gray-700" />
				</button>

				<div className="mt-1 flex items-center justify-between">
					<span className="text-sm text-gray-500">รวม</span>
					<span className="text-sm font-semibold text-black">0.00 ฿</span>
				</div>

				<div className="mt-3 grid grid-cols-2 gap-3">
					<button
						type="button"
						className="flex h-9 items-center justify-center gap-1 rounded-[7px] border border-blue-500 text-sm font-medium text-blue-600"
					>
						<ChevronLeftRoundedIcon className="text-[18px]" />
						ย้อนกลับ
					</button>
					<button
						type="button"
						disabled
						className="flex h-9 items-center justify-center gap-1 rounded-[7px] bg-[#d0d5df] text-sm font-medium text-white disabled:cursor-not-allowed"
					>
						ดำเนินการต่อ
						<ChevronRightRoundedIcon className="text-[18px]" />
					</button>
				</div>
				</div>

				<div className="mx-auto hidden h-16 w-[min(820px,calc(100%-48px))] items-center justify-between min-[801px]:flex">
				<button
					type="button"
					className="flex h-8 items-center justify-center gap-1 rounded-[7px] border border-blue-500 px-6 text-xs font-medium text-blue-600"
				>
					<ChevronLeftRoundedIcon className="text-[17px]" />
					ย้อนกลับ
				</button>
				<button
					type="button"
					className="flex h-8 items-center justify-center gap-1 rounded-[7px] bg-blue-500 px-5 text-xs font-medium text-white"
				>
					ยืนยันการชำระเงิน
					<ChevronRightRoundedIcon className="text-[17px]" />
				</button>
				</div>
			</footer>
		</>
	);
}
