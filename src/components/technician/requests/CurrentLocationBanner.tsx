"use client";

import { MapPin } from "lucide-react";

function geolocationMessage(error: GeolocationPositionError): string {
  if (error.code === error.PERMISSION_DENIED) {
    return "ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง กรุณาเปิดสิทธิ์ Location ใน Browser";
  }
  if (error.code === error.POSITION_UNAVAILABLE) {
    return "ไม่สามารถระบุตำแหน่งปัจจุบันได้";
  }
  if (error.code === error.TIMEOUT) {
    return "ใช้เวลาค้นหาตำแหน่งนานเกินไป กรุณาลองใหม่";
  }
  return "ไม่สามารถรับพิกัดได้";
}

export function readBrowserLocation(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new Error("Browser นี้ไม่รองรับการใช้งาน Location"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(geolocationMessage(error)));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });
}

export function CurrentLocationBanner({
  address,
  hasCoordinates,
  loading,
  message,
  onRefresh,
}: {
  address: string | null;
  hasCoordinates: boolean;
  loading: boolean;
  message: string | null;
  onRefresh: () => void;
}) {
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
            {address?.trim() || (hasCoordinates ? "อัปเดตพิกัดแล้ว" : "ยังไม่มีตำแหน่ง กรุณากดรีเฟรช")}
          </p>
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
