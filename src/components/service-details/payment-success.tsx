import React from "react";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Link from "next/link";
import { PaymentContext } from "@/app/service-details/layout";

export default function PaymentSuccess() {
	const payment = React.useContext(PaymentContext);
	return (
		<section className="min-h-screen bg-utility-bg px-2 pt-6 min-[801px]:flex min-[801px]:items-start min-[801px]:justify-center min-[801px]:px-6 min-[801px]:pt-7">
			<div className="w-full rounded-[7px] border border-gray-200 bg-white px-2.5 py-6 shadow-[0_1px_3px_rgb(23_51_109/6%)] min-[801px]:w-87 min-[801px]:px-9.5 min-[801px]:py-7.5">
				<div className="flex flex-col items-center">
					<span className="flex size-11 items-center justify-center rounded-full bg-[#006f7e] text-white min-[801px]:size-12">
						<CheckRoundedIcon className="text-[31px] min-[801px]:text-[34px]" />
					</span>
					<h1 className="mt-3 text-base font-semibold text-[#17396f] min-[801px]:text-xl">ชำระเงินเรียบร้อย !</h1>
				</div>

				<div className="mt-4 border-b border-gray-200 pb-3 text-[10px]">
					<div className="flex items-start justify-between gap-2 text-gray-700">
						<span>9,000 - 18,000 BTU, แบบติดผนัง</span>
						<span className="shrink-0 text-gray-500">2 รายการ</span>
					</div>
				</div>

				<div className="space-y-1.5 border-b border-gray-200 py-3 text-[10px]">
					<SummaryRow label="วันที่" value="23 เม.ย. 2022" />
					<SummaryRow label="เวลา" value="11:00 น." />
					<SummaryRow label="สถานที่" value={<>444/4 คอนโดสุขสมัย แขวงดินแดง<br />จตุจักร กรุงเทพฯ</>} />
				</div>

				<div className="mt-3 flex items-center justify-between text-xs">
					<span className="text-gray-500">รวม</span>
					<span className="font-semibold text-black">1,550.00 ฿</span>
				</div>

				<Link href="/" className="mt-4 flex h-8 items-center justify-center rounded-[7px] bg-blue-500 text-xs font-medium text-white">
					เช็ครายการซ่อม
				</Link>
			</div>
		</section>
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
