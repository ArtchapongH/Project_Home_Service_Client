"use client";
import React from "react";
import { useState } from "react";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import { PaymentContext } from "@/app/service-details/layout";
import { useRouter } from "next/navigation";



export default function MobileFooterTwo() {
    const payment = React.useContext(PaymentContext);
    const [summaryExpanded, setSummaryExpanded] = useState(true);
    const router = useRouter();

    if (!payment) {
        throw new Error("MobileFooterTwo must be rendered inside PaymentProvider");
    }

    const { serviceDetail, serviceFormData, paymentFormData, totAmount } = payment;

    function handleBack(): void {
        router.push("/service-details/userinfo");
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
                <div className="mt-2 border-b border-gray-200 pb-3 text-[10px]">
                    <div className="flex items-start justify-between gap-2 text-gray-700">
                        <span>9,000 - 18,000 BTU, แบบติดผนัง</span>
                        <span className="shrink-0">2 เครื่อง</span>
                    </div>
                </div>
                <div className="space-y-2 border-b border-gray-200 py-3 text-[10px]">
                    <SummaryRow label="วันที่" value="23 เม.ย. 2022" />
                    <SummaryRow label="เวลา" value="11:00 น." />
                    <SummaryRow label="สถานที่" value={<>444/4 คอนโดสุขสมัย แขวงดินแดง<br />จตุจักร กรุงเทพฯ</>} />
                </div>
                <SummaryRow className="mt-3 text-xs" label="Promotion Code" value={<span className="text-red-500">-50.00 ฿</span>} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-gray-500">รวม</span>
                <span className="font-semibold text-black">1,600.00 ฿</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-gray-200 pt-3">
                <button type="button" onClick={handleBack} className="flex h-8 items-center justify-center gap-1 rounded-[7px] border border-blue-500 text-xs font-medium text-blue-600">
                    <ChevronLeftRoundedIcon className="text-[17px]" />
                    ย้อนกลับ
                </button>
                <button type="button" className="flex h-8 items-center justify-center gap-1 rounded-[7px] bg-blue-500 text-xs font-medium text-white">
                    ดำเนินการต่อ
                    <ChevronRightRoundedIcon className="text-[17px]" />
                </button>
            </div>
            </aside>

            <aside className="hidden h-fit rounded-lg border border-gray-200 bg-white p-3 min-[801px]:block">
                <h2 className="text-sm font-medium text-gray-500">สรุปรายการ</h2>
                <div className="mt-2 border-b border-gray-200 pb-3 text-[10px]">
                    <div className="flex items-start justify-between gap-2 text-gray-700">
                        <span>9,000 - 18,000 BTU, แบบติดผนัง</span>
                        <span className="shrink-0">2 เครื่อง</span>
                    </div>
                </div>
                <div className="space-y-2 border-b border-gray-200 py-3 text-[10px]">
                    <SummaryRow label="วันที่" value="23 เม.ย. 2022" />
                    <SummaryRow label="เวลา" value="11:00 น." />
                    <SummaryRow label="สถานที่" value={<>444/4 คอนโดสุขสมัย แขวงดินแดง<br />จตุจักร กรุงเทพฯ</>} />
                </div>
                <SummaryRow className="mt-3 text-xs" label="Promotion Code" value={<span className="text-red-500">-50.00 ฿</span>} />
                <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-500">รวม</span>
                    <span className="font-semibold text-black">1,600.00 ฿</span>
                </div>
            </aside>

            <footer className="fixed inset-x-0 bottom-0 z-30 hidden h-16 border-t border-gray-200 bg-white min-[801px]:block">
                <div className="mx-auto flex h-full w-[min(644px,calc(100%-48px))] items-center justify-between">
                    <button type="button" onClick={handleBack} className="flex h-8 items-center justify-center gap-1 rounded-[7px] border border-blue-500 px-6 text-xs font-medium text-blue-600">
                        <ChevronLeftRoundedIcon className="text-[17px]" />
                        ย้อนกลับ
                    </button>
                    <button type="button" className="flex h-8 items-center justify-center gap-1 rounded-[7px] bg-blue-500 px-5 text-xs font-medium text-white">
                        ดำเนินการต่อ
                        <ChevronRightRoundedIcon className="text-[17px]" />
                    </button>
                </div>
            </footer>
        </>
    );
}

function SummaryRow({ className = "", label, value }: { className?: string; label: string; value: React.ReactNode }) {
    return (
        <div className={`flex items-start justify-between gap-3 ${className}`}>
            <span className="text-gray-500">{label}</span>
            <span className="text-right text-gray-800">{value}</span>
        </div>
    );
}