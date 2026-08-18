import NavbarResponsive from "@/components/service-details/navbar-responsive";
import HeroSectionThree from "@/components/service-details/hero-section-3";
import { PaymentProvider } from "@/app/service-details/layout";

export default function servicePaymentPage() {
  return (
    <>
      <PaymentProvider>
        <HeroSectionThree />
      </PaymentProvider>
    </>
  );
}