"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { TechnicianPageHeader } from "@/components/technician/shared/TechnicianPageHeader";
import { AcceptRequestDialog } from "@/components/technician/requests/AcceptRequestDialog";
import { ServiceRequestCard } from "@/components/technician/requests/ServiceRequestCard";
import { useTechnician } from "@/contexts/TechnicianContext";
import {
  acceptTechnicianRequest,
  declineTechnicianRequest,
  getTechnicianApiError,
  getTechnicianRequests,
} from "@/services/technicianApi";
import type { TechnicianJob } from "@/types/technician";
import { formatThaiDateTime } from "@/utils/technician";

export default function TechnicianRequestsPage() {
  const { profile, setRequestCount } = useTechnician();
  const [jobs, setJobs] = useState<TechnicianJob[]>([]);
  const [search, setSearch] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<TechnicianJob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    if (!profile?.isAvailable) {
      setJobs([]);
      setRequestCount(0);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getTechnicianRequests({ serviceId: serviceId || undefined, search: search || undefined });
      setJobs(result.data);
      setRequestCount(result.meta.total);
    } catch (requestError) {
      setError(getTechnicianApiError(requestError).message);
    } finally {
      setLoading(false);
    }
  }, [profile?.isAvailable, search, serviceId, setRequestCount]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadRequests(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadRequests]);

  const confirmAccept = async () => {
    if (!selected) return;
    setActionId(selected.orderId);
    setError(null);
    try {
      await acceptTechnicianRequest(selected.orderId);
      setSelected(null);
      await loadRequests();
    } catch (requestError) {
      const apiError = getTechnicianApiError(requestError);
      setError(apiError.code === "ORDER_ALREADY_ASSIGNED" ? "มีช่างคนอื่นรับงานนี้แล้ว รายการถูกรีเฟรชแล้ว" : apiError.message);
      setSelected(null);
      await loadRequests();
    } finally {
      setActionId(null);
    }
  };

  const decline = async (job: TechnicianJob) => {
    setActionId(job.orderId);
    setError(null);
    try {
      await declineTechnicianRequest(job.orderId);
      await loadRequests();
    } catch (requestError) {
      setError(getTechnicianApiError(requestError).message);
    } finally {
      setActionId(null);
    }
  };

  return (
    <>
      <TechnicianPageHeader title="คำขอบริการซ่อม">
        {profile?.isAvailable && (
          <div className="flex gap-3">
            <select value={serviceId} onChange={(event) => setServiceId(event.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">บริการทั้งหมด</option>
              {profile.services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm">
              <Search size={16} className="text-gray-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ค้นหารหัสหรือบริการ" className="w-48 py-2 outline-none" />
            </label>
          </div>
        )}
      </TechnicianPageHeader>
      <section className="p-8">
        {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {!profile?.isAvailable ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-8 text-center">
            <Bell size={42} className="text-blue-500" />
            <h2 className="mt-4 font-semibold">ต้องการรับแจ้งเตือนคำขอบริการหรือไม่?</h2>
            <p className="mt-2 text-sm text-gray-500">เปิดสถานะพร้อมรับบริการเพื่อดูงานที่ตรงกับบริการของคุณ</p>
            <Link href="/technician/settings" className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm text-white">เปลี่ยนสถานะเป็นพร้อมรับบริการ</Link>
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-sm text-gray-500">กำลังโหลดคำขอบริการ...</div>
        ) : jobs.length === 0 ? (
          <div className="rounded-lg bg-white p-12 text-center text-sm text-gray-500">ยังไม่มีคำขอบริการที่ตรงกับบริการของคุณ</div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <ServiceRequestCard key={job.orderId} job={job} disabled={actionId === job.orderId} onAccept={() => setSelected(job)} onDecline={() => void decline(job)} />
            ))}
          </div>
        )}
      </section>
      <AcceptRequestDialog
        open={Boolean(selected)}
        serviceName={selected?.serviceName ?? ""}
        scheduledAt={formatThaiDateTime(selected?.scheduledAt ?? null)}
        loading={Boolean(selected && actionId === selected.orderId)}
        onClose={() => setSelected(null)}
        onConfirm={() => void confirmAccept()}
      />
    </>
  );
}
