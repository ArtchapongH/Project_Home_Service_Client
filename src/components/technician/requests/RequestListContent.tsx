"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { ServiceRequestCard } from "@/components/technician/requests/ServiceRequestCard";
import type { TechnicianJob } from "@/types/technician";

interface RequestListContentProps {
  isAvailable: boolean;
  hasCoordinates: boolean;
  isLoading: boolean;
  requests: TechnicianJob[];
  activeRequestId: string | null;
  onAccept: (request: TechnicianJob) => void;
  onDecline: (request: TechnicianJob) => void;
}

function UnavailableState() {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-5 text-center md:min-h-72 md:p-8">
      <Bell size={42} className="text-blue-500" aria-hidden="true" />
      <h2 className="mt-4 font-semibold">ต้องการรับแจ้งเตือนคำขอบริการหรือไม่?</h2>
      <p className="mt-2 text-sm text-gray-500">
        เปิดสถานะพร้อมรับบริการเพื่อดูงานที่ตรงกับบริการของคุณ
      </p>
      <Link
        href="/technician/settings"
        className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm text-white sm:w-auto"
      >
        เปลี่ยนสถานะเป็นพร้อมรับบริการ
      </Link>
    </div>
  );
}

function InformationState({ children }: { children: string }) {
  return (
    <div className="rounded-lg bg-white p-6 text-center text-sm text-gray-500 md:p-12">
      {children}
    </div>
  );
}

export function RequestListContent({
  isAvailable,
  hasCoordinates,
  isLoading,
  requests,
  activeRequestId,
  onAccept,
  onDecline,
}: RequestListContentProps) {
  if (!isAvailable) return <UnavailableState />;

  if (!hasCoordinates) {
    return (
      <InformationState>
        ยังไม่มีพิกัดในระบบ กรุณากดรับพิกัดที่หน้าตั้งค่าบัญชีผู้ใช้
      </InformationState>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-gray-500">
        กำลังโหลดคำขอบริการ...
      </div>
    );
  }

  if (requests.length === 0) {
    return <InformationState>ยังไม่มีคำขอบริการในรัศมี 4 กิโลเมตร</InformationState>;
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <ServiceRequestCard
          key={request.orderId}
          job={request}
          disabled={activeRequestId === request.orderId}
          onAccept={() => onAccept(request)}
          onDecline={() => onDecline(request)}
        />
      ))}
    </div>
  );
}
