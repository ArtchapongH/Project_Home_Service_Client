"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ExternalLink, Search } from "lucide-react";
import { TechnicianPageHeader } from "@/components/technician/shared/TechnicianPageHeader";
import { useTechnician } from "@/contexts/TechnicianContext";
import { getTechnicianApiError, getTechnicianJobs } from "@/services/technicianApi";
import type { TechnicianJob } from "@/types/technician";
import { formatBaht, formatThaiDateTime } from "@/utils/technician";

export function TechnicianJobList({ mode }: { mode: "active" | "history" }) {
  const { profile } = useTechnician();
  const [jobs, setJobs] = useState<TechnicianJob[]>([]);
  const [search, setSearch] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest"| "nearest">("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTechnicianJobs({ search: search || undefined, serviceId: serviceId || undefined, sort });
      setJobs(result.data);
    } catch (requestError) {
      setError(getTechnicianApiError(requestError).message);
    } finally {
      setLoading(false);
    }
  }, [search, serviceId, sort]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadJobs(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadJobs]);

  const visibleJobs = useMemo(
    () => jobs.filter((job) => mode === "active"
      ? job.assignmentStatus === "ACCEPTED" || job.assignmentStatus === "IN_PROGRESS"
      : job.assignmentStatus === "COMPLETED" || job.assignmentStatus === "CANCELLED"),
    [jobs, mode],
  );
  const basePath = mode === "active" ? "/technician/jobs" : "/technician/history";

  return (
    <>
      <TechnicianPageHeader title={mode === "active" ? "รายการที่รอดำเนินการ" : "ประวัติการซ่อม"}>
        <label className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm md:min-h-0 md:w-auto">
          <Search size={16} className="text-gray-400" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหารหัสคำสั่งซ่อม" className="min-w-0 flex-1 py-2 outline-none md:w-48 md:flex-none" />
        </label>
      </TechnicianPageHeader>
      <section className="p-4 md:p-8">
        <div className="mb-5 grid gap-3 md:flex md:flex-wrap md:items-center md:gap-x-7 md:gap-y-3">
          <label className="grid min-w-0 gap-1.5 md:flex md:items-center md:gap-3">
            <span className="whitespace-nowrap text-xs font-medium text-gray-500">บริการ</span>
            <select
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
              className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 md:h-10 md:min-h-0 md:w-56"
            >
              <option value="">ทั้งหมด</option>
              {profile?.services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
          </label>

          <label className="grid min-w-0 gap-1.5 md:flex md:items-center md:gap-3">
            <span className="whitespace-nowrap text-xs font-medium text-gray-500">เรียงตาม</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as "newest" | "oldest" | "nearest")}
              className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition-colors focus:border-blue-500 md:h-10 md:min-h-0 md:w-56"
            >
              <option value="oldest">รายการเก่าที่สุด</option>
              <option value="newest">รายการล่าสุด</option>
              <option value="nearest">วันดำเนินการที่ใกล้ถึง</option>

            </select>
          </label>
        </div>
        {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        <div className="rounded-lg border border-gray-200 bg-white md:overflow-hidden">
          {loading ? <p className="p-12 text-center text-sm text-gray-500">กำลังโหลดรายการ...</p> : visibleJobs.length === 0 ? (
            <p className="p-12 text-center text-sm text-gray-500">ยังไม่มีรายการ</p>
          ) : (
            <>
            <div className="space-y-3 p-3 md:hidden">
              {visibleJobs.map((job) => (
                <article key={job.assignmentId} className="min-w-0 rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <h2 className="min-w-0 break-words font-semibold text-gray-900">{job.serviceName}</h2>
                    <Link href={`${basePath}/${job.assignmentId}`} aria-label={`ดูรายละเอียด ${job.serviceName}`} className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg border border-blue-200 text-blue-600">
                      <ExternalLink size={18} />
                    </Link>
                  </div>
                  <dl className="mt-3 grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
                    <dt className="text-gray-500">วันนัดหมาย</dt><dd className="break-words">{formatThaiDateTime(job.scheduledAt)}</dd>
                    <dt className="text-gray-500">รหัสคำสั่งซื้อ</dt><dd className="break-all">{job.orderCode}</dd>
                    <dt className="text-gray-500">ราคารวม</dt><dd>{formatBaht(job.totalPrice)}</dd>
                  </dl>
                </article>
              ))}
            </div>
            <table className="hidden w-full text-left text-sm md:table">
              <thead className="bg-gray-50 text-gray-500"><tr><th className="px-5 py-3 font-medium">ชื่อบริการ</th><th className="px-5 py-3 font-medium">วันเวลานัดหมาย</th><th className="px-5 py-3 font-medium">รหัสคำสั่งซื้อ</th><th className="px-5 py-3 font-medium">ราคารวม</th><th className="px-5 py-3 text-center font-medium">Action</th></tr></thead>
              <tbody>
                {visibleJobs.map((job) => (
                  <tr key={job.assignmentId} className="border-t border-gray-100">
                    <td className="px-5 py-4">{job.serviceName}</td>
                    <td className="px-5 py-4">{formatThaiDateTime(job.scheduledAt)}</td>
                    <td className="px-5 py-4">{job.orderCode}</td>
                    <td className="px-5 py-4">{formatBaht(job.totalPrice)}</td>
                    <td className="px-5 py-4 text-center"><Link href={`${basePath}/${job.assignmentId}`} aria-label="ดูรายละเอียด" className="inline-flex text-blue-600"><ExternalLink size={17} /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </>
          )}
        </div>
      </section>
    </>
  );
}
