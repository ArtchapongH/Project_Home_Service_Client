"use client";

import { useState } from "react";
import { updateTechnicianLocation } from "@/services/technicianApi";
import type { TechnicianProfile } from "@/types/technician";
import { formatThaiDateTime } from "@/utils/technician";

function geolocationMessage(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) return "ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง กรุณาเปิดสิทธิ์ Location ใน Browser";
  if (error.code === error.POSITION_UNAVAILABLE) return "ไม่สามารถระบุตำแหน่งปัจจุบันได้";
  if (error.code === error.TIMEOUT) return "ใช้เวลาค้นหาตำแหน่งนานเกินไป กรุณาลองใหม่";
  return "ไม่สามารถรับพิกัดได้";
}

export function LocationControl({
  profile,
  onUpdated,
}: {
  profile: TechnicianProfile;
  onUpdated: (location: Pick<TechnicianProfile, "latitude" | "longitude" | "locationUpdatedAt">) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const locate = () => {
    if (!("geolocation" in navigator)) {
      setMessage("Browser นี้ไม่รองรับการใช้งาน Location");
      return;
    }
    setLoading(true);
    setMessage(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await updateTechnicianLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          onUpdated(result);
          setMessage("บันทึกพิกัดปัจจุบันแล้ว");
        } catch {
          setMessage("บันทึกพิกัดไม่สำเร็จ กรุณาลองใหม่");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setMessage(geolocationMessage(error));
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={locate} disabled={loading} className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-blue-600 px-4 text-sm font-medium text-blue-600 disabled:opacity-50 md:w-auto">
          {loading ? "กำลังรีเฟรช..." : "รีเฟรช"}
        </button>
      </div>
      {profile.locationUpdatedAt && <p className="mt-2 text-xs text-gray-400">อัปเดตล่าสุด {formatThaiDateTime(profile.locationUpdatedAt)}</p>}
      {message && <p role="status" className="mt-2 text-xs text-gray-600">{message}</p>}
    </div>
  );
}
