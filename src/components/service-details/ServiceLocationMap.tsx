"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER: L.LatLngExpression = [13.7563, 100.5018];
const DEFAULT_ZOOM = 12;
const PINNED_ZOOM = 16;

const pinIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type ServiceLocationMapProps = {
  latitude: number | null;
  longitude: number | null;
  onPinSelect: (latitude: number, longitude: number) => void;
};

export function ServiceLocationMap({ latitude, longitude, onPinSelect }: ServiceLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onPinSelectRef = useRef(onPinSelect);

  onPinSelectRef.current = onPinSelect;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (event: L.LeafletMouseEvent) => {
      onPinSelectRef.current(event.latlng.lat, event.latlng.lng);
    });

    mapRef.current = map;
    window.setTimeout(() => map.invalidateSize(), 80);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || latitude == null || longitude == null) return;

    const position: L.LatLngExpression = [latitude, longitude];

    if (!markerRef.current) {
      markerRef.current = L.marker(position, { icon: pinIcon, draggable: true })
        .addTo(map)
        .on("dragend", () => {
          const next = markerRef.current?.getLatLng();
          if (next) onPinSelectRef.current(next.lat, next.lng);
        });
    } else {
      markerRef.current.setLatLng(position);
    }

    map.setView(position, Math.max(map.getZoom(), PINNED_ZOOM));
  }, [latitude, longitude]);

  return (
    <div className="service-location-map h-64 overflow-hidden rounded-[7px] border border-gray-300">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
