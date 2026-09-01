import type { TechnicianLocationInput } from "@/types/technician";

const ADDRESS_MAX_LENGTH = 500;

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

function formatCoordinateFallback(latitude: number, longitude: number): string {
  return `พิกัด ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

function truncateAddress(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length <= ADDRESS_MAX_LENGTH) return trimmed;
  return trimmed.slice(0, ADDRESS_MAX_LENGTH).trim();
}

/** แปลงพิกัดเป็นข้อความที่อยู่ (OpenStreetMap Nominatim) */
export async function reverseGeocodeAddress(
  latitude: number,
  longitude: number,
): Promise<string> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    "accept-language": "th",
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return formatCoordinateFallback(latitude, longitude);
    }

    const data = (await response.json()) as { display_name?: string };
    if (typeof data.display_name === "string" && data.display_name.trim()) {
      return truncateAddress(data.display_name);
    }
  } catch {
    // fall through to coordinate label
  }

  return formatCoordinateFallback(latitude, longitude);
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
