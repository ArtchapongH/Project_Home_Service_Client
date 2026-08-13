import Image from "next/image";
import Link from "next/link";

export type ServiceItem = {
  slug: string;
  category: string;
  name: string;
  price: string;
  image: string;
};

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <article className="service-card">
      <div className="service-image">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 800px) 100vw, 33vw"
        />
      </div>
      <div className="service-card-content">
        <span className="category-tag">{service.category}</span>
        <h3>{service.name}</h3>
        <p className="price-line">
          <span aria-hidden="true">◇</span> {service.price}
        </p>
        <Link href={`/services/${service.slug}`}>เลือกบริการ</Link>
      </div>
    </article>
  );
}
