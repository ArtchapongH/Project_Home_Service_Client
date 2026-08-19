import NavbarResponsive from "@/components/service-details/navbar-responsive";

import HeroSection from "@/components/service-details/hero-section-1";
import { PaymentProvider } from "@/app/service-details/layout";
import { AuthProvider } from "@/contexts/AuthContext";

export default function serviceDetailPage() {
  return(
    <>
    <AuthProvider>
      <PaymentProvider>
        <HeroSection />
      </PaymentProvider>
    </AuthProvider>
    </>
  ) 
  
  
  
}