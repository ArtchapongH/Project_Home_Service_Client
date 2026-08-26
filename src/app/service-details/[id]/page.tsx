import HeroSection from "@/components/service-details/hero-section-1";

interface ServiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { id } = await params;
  const serviceId = Number(id);
  
  return (
    <>
      <HeroSection serviceId={serviceId} />
    </>
  );
}
