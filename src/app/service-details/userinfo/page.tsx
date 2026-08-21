import HeroSectionTwo from "@/components/service-details/hero-section-2";
import { PaymentProvider } from "@/app/service-details/layout";
import { AuthProvider } from "@/contexts/AuthContext";

export default function serviceUserInfoPage() {
  return(
    <>
    <AuthProvider>
      <PaymentProvider>
        <HeroSectionTwo />
      </PaymentProvider>
    </AuthProvider>
    </>
  ) 
  
}