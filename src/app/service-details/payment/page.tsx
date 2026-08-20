import HeroSectionThree from "@/components/service-details/hero-section-3";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function ServicePaymentPage() {
  return (
    <ProtectedRoute>
      <HeroSectionThree />
    </ProtectedRoute>
  );
}