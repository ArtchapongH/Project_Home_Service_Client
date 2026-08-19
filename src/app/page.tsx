import { Hero } from "@/components/homepage/hero";
import { RecruitmentSection } from "@/components/homepage/recruitment-section";
import { ServicesSection } from "@/components/homepage/services-section";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ServicesSection />
        <RecruitmentSection />
      </main>
      <Footer />
    </>
  );
}
