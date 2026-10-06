"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { hasValidCoordinates } from "@/utils/technicianLocation";

export interface RequestLocationMapProps {
  technicianLatitude: number | null;
  technicianLongitude: number | null;
  serviceLatitude: number | null;
  serviceLongitude: number | null;
}

export function RequestLocationMap({
  technicianLatitude,
  technicianLongitude,
  serviceLatitude,
  serviceLongitude,
}: RequestLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tileError, setTileError] = useState(false);
  const hasTechnician = hasValidCoordinates(technicianLatitude, technicianLongitude);
  const hasService = hasValidCoordinates(serviceLatitude, serviceLongitude);

  useEffect(() => {
    if (!containerRef.current || (!hasTechnician && !hasService)) return;
    const map = L.map(containerRef.current, { scrollWheelZoom: true });
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    tiles.on("tileerror", () => setTileError(true));
    tiles.on("loading", () => setTileError(false));

    const positions: L.LatLngTuple[] = [];
    const addPin = (latitude: number, longitude: number, technician: boolean) => {
      const position: L.LatLngTuple = [latitude, longitude];
      positions.push(position);
      L.marker(position, {
        draggable: false,
        title: technician ? "ตำแหน่งช่าง" : "สถานที่ให้บริการ",
        icon: L.divIcon({
          className: "",
          html: `<span class="block size-5 rounded-full border-2 border-white shadow-md ${technician ? "bg-blue-600" : "bg-green-600"}"></span>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map).bindTooltip(technician ? "ตำแหน่งช่าง" : "สถานที่ให้บริการ", {
        permanent: true,
        direction: technician ? "top" : "bottom",
        offset: technician ? [0, -12] : [0, 12],
      });
    };
    if (hasTechnician) addPin(technicianLatitude!, technicianLongitude!, true);
    if (hasService) addPin(serviceLatitude!, serviceLongitude!, false);

    const fit = () => {
      map.invalidateSize();
      map.fitBounds(L.latLngBounds(positions), { padding: [72, 48], maxZoom: 16 });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      map.remove();
    };
  }, [hasTechnician, hasService, technicianLatitude, technicianLongitude, serviceLatitude, serviceLongitude]);

  return (
    <div>
      {!hasTechnician ? <p role="status" className="mb-2 text-sm text-gray-500">ไม่มีพิกัดช่าง กรุณากดรีเฟรชเพื่อรับตำแหน่งปัจจุบัน</p> : null}
      {!hasService ? <p role="status" className="mb-2 text-sm text-gray-500">ไม่มีพิกัดสถานที่ให้บริการ</p> : null}
      {tileError ? <p role="status" className="mb-2 text-sm text-red-600">โหลดแผนที่ไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วเปิดแผนที่ใหม่</p> : null}
      {hasTechnician || hasService ? (
        <div className="service-location-map h-[50vh] min-h-64 overflow-hidden rounded-lg border border-gray-200" role="region" aria-label="แผนที่ตำแหน่งช่างและสถานที่ให้บริการ">
          <div ref={containerRef} className="h-full w-full" />
        </div>
      ) : null}
    </div>
  );
}
