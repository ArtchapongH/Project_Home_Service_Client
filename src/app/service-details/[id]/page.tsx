import HeroSection from "@/components/service-details/hero-section-1";
import { PaymentProvider } from "@/app/service-details/layout";
import { AuthProvider } from "@/contexts/AuthContext";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const serviceId = Number(id);
  
  return (
    <>
      <AuthProvider>
        <PaymentProvider>
          <HeroSection serviceId={serviceId} />
        </PaymentProvider>
      </AuthProvider>
    </>
  );
}