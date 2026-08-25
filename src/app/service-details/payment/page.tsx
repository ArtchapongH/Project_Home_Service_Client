import HeroSectionThree from "@/components/service-details/hero-section-3";
import { PaymentProvider } from "@/app/service-details/layout";
import { AuthProvider } from "@/contexts/AuthContext";


export default function ServicePaymentPage() {
  return (
    <>
    <AuthProvider>
      <PaymentProvider>
        <HeroSectionThree />
      </PaymentProvider>
    </AuthProvider>
    </>
  );
}