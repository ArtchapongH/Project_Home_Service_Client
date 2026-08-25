"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DirectionsLink } from "@/components/technician/shared/DirectionsLink";
import { getTechnicianApiError, getTechnicianJob } from "@/services/technicianApi";
import type { TechnicianJob } from "@/types/technician";
import { formatBaht, formatThaiDateTime } from "@/utils/technician";

export function TechnicianJobDetail({ assignmentId, history = false }: { assignmentId: string; history?: boolean }) {
  const [job, setJob] = useState<TechnicianJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getTechnicianJob(assignmentId).then(setJob).catch((requestError) => setError(getTechnicianApiError(requestError).message));
  }, [assignmentId]);

  const backHref = history ? "/technician/history" : "/technician/jobs";
  if (error) return <div className="p-4 text-sm text-red-600 md:p-8">{error}</div>;
  if (!job) return <div className="p-4 text-sm text-gray-500 md:p-8">กำลังโหลดรายละเอียด...</div>;
  const itemText = job.items.length ? job.items.map((item) => `${item.optionName} ${item.quantity} ${item.unit}`).join(", ") : job.serviceName;

  return (
    <>
      <header className="flex min-h-20 items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:h-20 md:gap-4 md:px-8 md:py-0">
        <Link href={backHref} aria-label="กลับ" className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:size-auto"><ArrowLeft /></Link>
        <div className="min-w-0"><p className="text-xs text-gray-500">{history ? "ประวัติการซ่อม" : "บริการที่รับ"}</p><h1 className="break-words font-semibold">{job.serviceName}</h1></div>
      </header>
      <section className="p-4 md:p-8">
        <div className="min-w-0 rounded-lg bg-white p-4 shadow-sm md:p-8">
          <h2 className="text-lg font-semibold">{job.serviceName}</h2>
          <dl className="mt-6 grid gap-x-8 gap-y-2 text-sm md:grid-cols-[180px_minmax(0,1fr)] md:gap-y-5">
            <dt className="text-gray-500">หมวดหมู่</dt><dd><span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">{job.categoryName}</span></dd>
            <dt className="mt-2 text-gray-500 first:mt-0 md:mt-0">รายการ</dt><dd className="break-words">{itemText}</dd>
            <dt className="text-gray-500">วันเวลานัดหมาย</dt><dd>{formatThaiDateTime(job.scheduledAt)}</dd>
            <dt className="text-gray-500">สถานที่</dt><dd className="break-words">{job.address || "ยังไม่ระบุ"}<div className="mt-1"><DirectionsLink latitude={job.serviceLatitude} longitude={job.serviceLongitude} address={job.address} /></div></dd>
            <dt className="text-gray-500">รหัสคำสั่งซื้อ</dt><dd className="break-all">{job.orderCode}</dd>
            <dt className="text-gray-500">ราคารวม</dt><dd>{formatBaht(job.totalPrice)}</dd>
            <dt className="text-gray-500">ผู้รับบริการ</dt><dd>{job.customerName || "ไม่ระบุ"}</dd>
            <dt className="text-gray-500">เบอร์ติดต่อ</dt><dd>{job.customerPhone || "ไม่ระบุ"}</dd>
          </dl>
        </div>
      </section>
    </>
  );
}
