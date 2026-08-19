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
  if (error) return <div className="p-8 text-sm text-red-600">{error}</div>;
  if (!job) return <div className="p-8 text-sm text-gray-500">กำลังโหลดรายละเอียด...</div>;
  const itemText = job.items.length ? job.items.map((item) => `${item.optionName} ${item.quantity} ${item.unit}`).join(", ") : job.serviceName;

  return (
    <>
      <header className="flex h-20 items-center gap-4 border-b border-gray-200 bg-white px-8">
        <Link href={backHref} aria-label="กลับ" className="text-gray-500"><ArrowLeft /></Link>
        <div><p className="text-xs text-gray-500">{history ? "ประวัติการซ่อม" : "บริการที่รับ"}</p><h1 className="font-semibold">{job.serviceName}</h1></div>
      </header>
      <section className="p-8">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <h2 className="text-lg font-semibold">{job.serviceName}</h2>
          <dl className="mt-6 grid gap-x-8 gap-y-5 text-sm sm:grid-cols-[180px_1fr]">
            <dt className="text-gray-500">หมวดหมู่</dt><dd><span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">{job.categoryName}</span></dd>
            <dt className="text-gray-500">รายการ</dt><dd>{itemText}</dd>
            <dt className="text-gray-500">วันเวลานัดหมาย</dt><dd>{formatThaiDateTime(job.scheduledAt)}</dd>
            <dt className="text-gray-500">สถานที่</dt><dd>{job.address || "ยังไม่ระบุ"}<div className="mt-1"><DirectionsLink latitude={job.serviceLatitude} longitude={job.serviceLongitude} address={job.address} /></div></dd>
            <dt className="text-gray-500">รหัสคำสั่งซื้อ</dt><dd>{job.orderCode}</dd>
            <dt className="text-gray-500">ราคารวม</dt><dd>{formatBaht(job.totalPrice)}</dd>
            <dt className="text-gray-500">ผู้รับบริการ</dt><dd>{job.customerName || "ไม่ระบุ"}</dd>
            <dt className="text-gray-500">เบอร์ติดต่อ</dt><dd>{job.customerPhone || "ไม่ระบุ"}</dd>
          </dl>
        </div>
      </section>
    </>
  );
}
