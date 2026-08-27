"use client";

import HeroSection from "@/components/service-details/hero-section-1";
import { PaymentProvider } from "@/app/service-details/layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { useParams } from "next/navigation";

export default function ServiceDetailPage() {
 const params = useParams();
 const serviceId = Number(params?.id ?? 0);
  return(
    <>
    <AuthProvider>
      <PaymentProvider>
        <HeroSection serviceId={serviceId} />
      </PaymentProvider>
    </AuthProvider>
    </>
  );
}