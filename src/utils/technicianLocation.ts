import type { TechnicianLocationInput } from "@/types/technician";

function getGeolocationErrorMessage(error: GeolocationPositionError): string {
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

/** อ่านพิกัดครั้งเดียวจาก Browser และแปลง error เป็นข้อความสำหรับผู้ใช้ */
export function readBrowserLocation(): Promise<TechnicianLocationInput> {
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
      (error) => reject(new Error(getGeolocationErrorMessage(error))),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  });
}
