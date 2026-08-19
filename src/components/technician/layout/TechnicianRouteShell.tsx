"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { TechnicianGuard } from "@/components/technician/layout/TechnicianGuard";
import { TechnicianLayout } from "@/components/technician/layout/TechnicianLayout";

export function TechnicianRouteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/technician/login") {
    return <>{children}</>;
  }

  return (
    <TechnicianGuard>
      <TechnicianLayout>{children}</TechnicianLayout>
    </TechnicianGuard>
  );
}
