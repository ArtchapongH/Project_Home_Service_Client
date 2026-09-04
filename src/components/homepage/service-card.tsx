import Image from "next/image";
import Link from "next/link";

export type ServiceItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  image: string;
};

export function ServiceCard({
  service,
  selectLabel,
}: {
  service: ServiceItem;
  selectLabel: string;
}) {
  const detailHref = `/service-details/${service.id}`;

  return (
    <article className="overflow-hidden rounded-[7px] border border-[#dfe3ea] bg-white text-left shadow-[0_2px_5px_rgb(23_51_109/3%)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgb(23_51_109/12%)] max-[800px]:mx-auto max-[800px]:w-full max-[800px]:max-w-[430px]">
      <Link href={detailHref} className="block">
        <div className="relative h-[205px] overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            sizes="(max-width: 800px) 100vw, 33vw"
            className="object-cover object-center"
          />
        </div>
      </Link>
      <div className="px-[18px] pt-4 pb-[18px]">
        <span className="inline-block rounded-full bg-blue-100 px-[9px] py-1 text-[10px] text-blue-600">{service.category}</span>
        <h3 className="mt-2.5 mb-1.5 text-[17px] font-semibold">
          <Link href={detailHref} className="hover:text-blue-600">{service.name}</Link>
        </h3>
        <p className="mb-4 text-xs text-gray-500">
          <span aria-hidden="true">◇</span> {service.price}
        </p>
        <Link className="cursor-pointer text-[13px] font-semibold text-blue-600 underline underline-offset-2" href={detailHref}>{selectLabel}</Link>
      </div>
    </article>
  );
}
