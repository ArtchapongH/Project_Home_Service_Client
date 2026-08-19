import type { ReactNode } from "react";
import { TechnicianProvider } from "@/contexts/TechnicianContext";
import { TechnicianRouteShell } from "@/components/technician/layout/TechnicianRouteShell";

export default function TechnicianRootLayout({ children }: { children: ReactNode }) {
  return (
    <TechnicianProvider>
      <TechnicianRouteShell>{children}</TechnicianRouteShell>
    </TechnicianProvider>
  );
}
