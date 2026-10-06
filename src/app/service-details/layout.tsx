import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { PaymentProvider } from "@/contexts/PaymentContext";

export default function ServiceDetailsLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <PaymentProvider>{children}</PaymentProvider>
    </ProtectedRoute>
  );
}
