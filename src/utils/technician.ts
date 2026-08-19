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
