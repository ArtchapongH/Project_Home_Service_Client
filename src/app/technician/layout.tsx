import type { ReactNode } from "react";
import { TechnicianProvider } from "@/contexts/TechnicianContext";
import { TechnicianGuard } from "@/components/technician/layout/TechnicianGuard";
import { TechnicianLayout } from "@/components/technician/layout/TechnicianLayout";

export default function TechnicianRootLayout({ children }: { children: ReactNode }) {
  return (
    <TechnicianProvider>
      <TechnicianGuard>
        <TechnicianLayout>{children}</TechnicianLayout>
      </TechnicianGuard>
    </TechnicianProvider>
  );
}
