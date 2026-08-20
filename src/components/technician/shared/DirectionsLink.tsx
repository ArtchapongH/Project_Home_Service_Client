import { MapPin } from "lucide-react";
import { getDirectionsUrl } from "@/utils/technician";

export function DirectionsLink({
  latitude,
  longitude,
  address,
}: {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
}) {
  const href = getDirectionsUrl({ latitude, longitude, address });
  if (!href) return <span className="text-xs text-gray-400">ไม่มีข้อมูลสถานที่</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline">
      <MapPin size={14} /> ดูแผนที่
    </a>
  );
}
