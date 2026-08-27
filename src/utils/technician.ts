export function formatThaiDateTime(value: string | null): string {
  if (!value) return "ยังไม่ระบุวันเวลา";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Bangkok",
  }).format(new Date(value));
}

export function formatBaht(value: number | null): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(value ?? 0);
}

// งานที่ไกลกว่านี้จะไม่โชว์ให้ช่างเห็น
export const MAX_JOB_RADIUS_KM = 4;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

/** หาระยะทางระหว่าง 2 จุดบนแผนที่ หน่วยเป็นกิโลเมตร */
export function getDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

/** งานที่ไม่มีพิกัด หรือไกลเกิน 4 กม. จะไม่แสดง */
export function isJobWithinRadius(
  technicianLat: number,
  technicianLng: number,
  jobLat: number | null,
  jobLng: number | null,
  maxKm: number = MAX_JOB_RADIUS_KM,
): boolean {
  if (jobLat === null || jobLng === null) return false;
  return getDistanceKm(technicianLat, technicianLng, jobLat, jobLng) <= maxKm;
}

export function getDirectionsUrl({
  latitude,
  longitude,
  address,
}: {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}): string | null {
  const destination =
    latitude !== null && longitude !== null
      ? `${latitude},${longitude}`
      : address?.trim();
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
