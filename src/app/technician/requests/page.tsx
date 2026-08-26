"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { TechnicianPageHeader } from "@/components/technician/shared/TechnicianPageHeader";
import { AcceptRequestDialog } from "@/components/technician/requests/AcceptRequestDialog";
import {
  CurrentLocationBanner,
  readBrowserLocation,
} from "@/components/technician/requests/CurrentLocationBanner";
import { ServiceRequestCard } from "@/components/technician/requests/ServiceRequestCard";
import { useTechnician } from "@/contexts/TechnicianContext";
import {
  acceptTechnicianRequest,
  declineTechnicianRequest,
  getTechnicianApiError,
  getTechnicianRequests,
  updateTechnicianLocation,
} from "@/services/technicianApi";
import type { TechnicianJob } from "@/types/technician";
import { formatThaiDateTime } from "@/utils/technician";

export default function TechnicianRequestsPage() {
  const { profile, setProfile, setRequestCount } = useTechnician();
  const [jobs, setJobs] = useState<TechnicianJob[]>([]);
  const [search, setSearch] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [selected, setSelected] = useState<TechnicianJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const didAutoLocate = useRef(false);

  const techLat = profile?.latitude ?? null;
  const techLng = profile?.longitude ?? null;
  const hasCoordinates = techLat !== null && techLng !== null;

  const loadRequests = useCallback(async () => {
    if (!profile?.isAvailable) {
      setJobs([]);
      setRequestCount(0);
      setLoading(false);
      return;
    }

    if (techLat === null || techLng === null) {
      setJobs([]);
      setRequestCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await getTechnicianRequests({
        serviceId: serviceId || undefined,
        search: search || undefined,
        latitude: techLat,
        longitude: techLng,
      });
      setJobs(result.data);
      setRequestCount(result.meta.total);
    } catch (requestError) {
      setError(getTechnicianApiError(requestError).message);
    } finally {
      setLoading(false);
    }
  }, [
    profile?.isAvailable,
    search,
    serviceId,
    setRequestCount,
    techLat,
    techLng,
  ]);

  useEffect(() => {
    const timeout = window.setTimeout(() => void loadRequests(), 250);
    return () => window.clearTimeout(timeout);
  }, [loadRequests]);

  const refreshLocation = useCallback(async () => {
    if (!profile) return;
    setLocationLoading(true);
    setLocationMessage(null);
    try {
      const coords = await readBrowserLocation();
      const result = await updateTechnicianLocation(coords);
      setProfile({ ...profile, ...result });
      //setLocationMessage("อัปเดตตำแหน่งแล้ว แสดงเฉพาะงานในรัศมี 4 กิโลเมตร");
    } catch (locationError) {
      setLocationMessage(
        locationError instanceof Error
          ? locationError.message
          : "ไม่สามารถอัปเดตตำแหน่งได้",
      );
    } finally {
      setLocationLoading(false);
    }
  }, [profile, setProfile]);

  useEffect(() => {
    if (!profile?.isAvailable || didAutoLocate.current) return;
    if (hasCoordinates) return;
    didAutoLocate.current = true;
    void refreshLocation();
  }, [hasCoordinates, profile?.isAvailable, refreshLocation]);

  const confirmAccept = async () => {
    if (!selected) return;
    setActionId(selected.orderId);
    setError(null);
    setSuccess(null);
    try {
      await acceptTechnicianRequest(selected.orderId);
      setSelected(null);
      setSuccess(`รับงาน ${selected.orderCode} เรียบร้อยแล้ว`);
      await loadRequests();
    } catch (requestError) {
      const apiError = getTechnicianApiError(requestError);
      setError(
        apiError.code === "ORDER_ALREADY_ASSIGNED"
          ? "มีช่างคนอื่นรับงานนี้แล้ว รายการถูกรีเฟรชแล้ว"
          : apiError.message,
      );
      setSelected(null);
      await loadRequests();
    } finally {
      setActionId(null);
    }
  };

  const decline = async (job: TechnicianJob) => {
    setActionId(job.orderId);
    setError(null);
    setSuccess(null);
    try {
      await declineTechnicianRequest(job.orderId);
      setSuccess(`ปฏิเสธงาน ${job.orderCode} เรียบร้อยแล้ว`);
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
          <div className="flex flex-col gap-3 md:flex-row">
            <select
              value={serviceId}
              onChange={(event) => setServiceId(event.target.value)}
              className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm md:min-h-0 md:w-auto"
            >
              <option value="">บริการทั้งหมด</option>
              {profile.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <label className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm md:min-h-0 md:w-auto">
              <Search size={16} className="text-gray-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ค้นหารหัสหรือบริการ"
                className="min-w-0 flex-1 py-2 outline-none md:w-48 md:flex-none"
              />
            </label>
          </div>
        )}
      </TechnicianPageHeader>
      <section className="p-4 md:p-8">
        {profile?.isAvailable && (
          <CurrentLocationBanner
            address={profile.address}
            hasCoordinates={hasCoordinates}
            loading={locationLoading}
            message={locationMessage}
            onRefresh={() => void refreshLocation()}
          />
        )}
        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
          >
            {success}
          </div>
        )}
        {!profile?.isAvailable ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-5 text-center md:min-h-72 md:p-8">
            <Bell size={42} className="text-blue-500" />
            <h2 className="mt-4 font-semibold">
              ต้องการรับแจ้งเตือนคำขอบริการหรือไม่?
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              เปิดสถานะพร้อมรับบริการเพื่อดูงานที่ตรงกับบริการของคุณ
            </p>
            <Link
              href="/technician/settings"
              className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm text-white sm:w-auto"
            >
              เปลี่ยนสถานะเป็นพร้อมรับบริการ
            </Link>
          </div>
        ) : !hasCoordinates ? (
          <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-500 md:p-12">
            กดรีเฟรชตำแหน่งเพื่อดูคำขอบริการในรัศมี 4 กิโลเมตร
          </div>
        ) : loading ? (
          <div className="py-20 text-center text-sm text-gray-500">
            กำลังโหลดคำขอบริการ...
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-500 md:p-12">
            ยังไม่มีคำขอบริการในรัศมี 4 กิโลเมตร
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <ServiceRequestCard
                key={job.orderId}
                job={job}
                disabled={actionId === job.orderId}
                onAccept={() => setSelected(job)}
                onDecline={() => void decline(job)}
              />
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
