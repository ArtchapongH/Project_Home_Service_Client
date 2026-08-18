import type { ReactNode } from "react";
import { TechnicianSidebar } from "@/components/technician/layout/TechnicianSidebar";

export function TechnicianLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F4F6FA] text-gray-800">
      <TechnicianSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
