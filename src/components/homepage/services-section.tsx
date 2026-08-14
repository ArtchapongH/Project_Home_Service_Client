import Link from "next/link";
import { ServiceCard } from "./service-card";

const services = [
  {
    slug: "general-cleaning",
    category: "บริการทั่วไป",
    name: "ทำความสะอาดทั่วไป",
    price: "ค่าบริการประมาณ 500.00 - 1,000.00 ฿",
    image: "/images/landing/service-cleaning.png",
  },
  {
    slug: "air-conditioner-cleaning",
    category: "บริการทั่วไป",
    name: "ล้างแอร์",
    price: "ค่าบริการประมาณ 500.00 - 1,000.00 ฿",
    image: "/images/landing/service-aircon.png",
  },
  {
    slug: "washing-machine-repair",
    category: "บริการทั่วไป",
    name: "ซ่อมเครื่องซักผ้า",
    price: "ค่าบริการประมาณ 500.00 ฿",
    image: "/images/landing/service-washing-machine.png",
  },
];

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
