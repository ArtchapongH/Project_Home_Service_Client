"use client";

import { MapPin } from "lucide-react";
import { formatThaiDateTime } from "@/utils/technician";

interface CurrentLocationBannerProps {
  address: string | null;
  hasCoordinates: boolean;
  locationUpdatedAt: string | null;
  loading: boolean;
  message: string | null;
  onRefresh: () => void;
}

export function CurrentLocationBanner({
  address,
  hasCoordinates,
  locationUpdatedAt,
  loading,
  message,
  onRefresh,
}: CurrentLocationBannerProps) {
  return (
    <section
      aria-label="ตำแหน่งที่อยู่ปัจจุบัน"
      className="mb-4 flex flex-col items-stretch gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 md:flex-row md:flex-wrap md:items-center md:justify-between"
    >
      <div className="flex min-w-0 items-start gap-3">
        <MapPin className="mt-0.5 size-5 shrink-0 text-blue-600" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-blue-700">ตำแหน่งที่อยู่ปัจจุบัน</h2>
          <p className="mt-0.5 text-sm text-blue-700">
            {hasCoordinates ? address?.trim() || "มีพิกัดที่บันทึกไว้" : "ยังไม่มีพิกัด กรุณากดรีเฟรชเพื่อรับตำแหน่งปัจจุบัน"}
          </p>
          {hasCoordinates ? (
            <p className="mt-1 text-xs text-blue-800">
              ตำแหน่งที่บันทึกไว้ · อัปเดตล่าสุด {formatThaiDateTime(locationUpdatedAt)}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="min-h-11 w-full rounded-lg border border-blue-600 bg-white px-4 py-1.5 text-sm text-blue-600 disabled:opacity-50 md:min-h-0 md:w-auto"
      >
        {loading ? "กำลังรีเฟรช..." : "รีเฟรช"}
      </button>
      {message ? (
        <p role="status" className="w-full text-xs text-blue-800">
          {message}
        </p>
      ) : null}
    </section>
  );
}
