import type { ReactNode } from "react";
import TechnicianGuard from "@/components/technician/TechnicianGuard";

export default function TechnicianRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <TechnicianGuard>{children}</TechnicianGuard>;
}
