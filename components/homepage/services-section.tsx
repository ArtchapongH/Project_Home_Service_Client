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
    <section className="services-section" aria-labelledby="services-title">
      <div className="page-container">
        <h2 id="services-title">บริการยอดฮิตของเรา</h2>
        <div className="service-grid">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
        <Link href="/services" className="button button-primary all-services">
          ดูบริการทั้งหมด
        </Link>
      </div>
    </section>
  );
}
