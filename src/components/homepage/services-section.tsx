import Link from "next/link";
import { ServiceCard } from "./service-card";
import {
  getApiErrorMessage,
  getPublicServices,
} from "@/services/publicServiceApi";
import type { PublicService } from "@/types/public-service";

export function ServicesSection() {
  return (
    <section className="min-h-[620px] bg-gray-100 py-[52px] text-center min-[801px]:pt-[68px] min-[801px]:pb-[74px]" aria-labelledby="services-title">
      <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
        <h2 className="mb-[46px] text-[26px] font-bold text-blue-900" id="services-title">บริการยอดฮิตของเรา</h2>
        <div className="grid grid-cols-1 gap-5 min-[801px]:grid-cols-3 min-[801px]:gap-8">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <Link href="/services" className="mt-12 inline-flex min-h-[42px] items-center justify-center rounded-[7px] bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-blue-700">
          ดูบริการทั้งหมด
        </Link>
      </div>
    </section>
  );
}
