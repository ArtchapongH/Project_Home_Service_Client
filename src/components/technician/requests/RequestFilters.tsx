"use client";

import { Search } from "lucide-react";
import type { TechnicianService } from "@/types/technician";

interface RequestFiltersProps {
  services: TechnicianService[];
  selectedServiceId: string;
  searchText: string;
  onServiceChange: (serviceId: string) => void;
  onSearchChange: (searchText: string) => void;
}

export function RequestFilters({
  services,
  selectedServiceId,
  searchText,
  onServiceChange,
  onSearchChange,
}: RequestFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <select
        aria-label="กรองตามบริการ"
        value={selectedServiceId}
        onChange={(event) => onServiceChange(event.target.value)}
        className="min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm md:min-h-0 md:w-auto"
      >
        <option value="">บริการทั้งหมด</option>
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>

      <label className="flex min-h-11 w-full items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm md:min-h-0 md:w-auto">
        <Search size={16} className="text-gray-400" aria-hidden="true" />
        <span className="sr-only">ค้นหาคำขอบริการ</span>
        <input
          value={searchText}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ค้นหารหัสหรือบริการ"
          className="min-w-0 flex-1 py-2 outline-none md:w-48 md:flex-none"
        />
      </label>
    </div>
  );
}
