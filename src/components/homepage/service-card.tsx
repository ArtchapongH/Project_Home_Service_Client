import Image from "next/image";
import Link from "next/link";
import type { PublicService } from "@/types/public-service";

function formatPrice(minPrice: number, maxPrice: number): string {
  const format = (value: number) => value.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return maxPrice > minPrice
    ? `ค่าบริการประมาณ ${format(minPrice)} - ${format(maxPrice)} ฿`
    : `ค่าบริการประมาณ ${format(minPrice)} ฿`;
}

export function ServiceCard({ service }: { service: PublicService }) {
  return (
    <article className="overflow-hidden rounded-[7px] border border-[#dfe3ea] bg-white text-left shadow-[0_2px_5px_rgb(23_51_109/3%)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_12px_26px_rgb(23_51_109/12%)] max-[800px]:mx-auto max-[800px]:w-full max-[800px]:max-w-[430px]">
      <div className="relative h-[205px] overflow-hidden">
        <Image
          src={service.imageUrl || "/images/landing/service-aircon.png"}
          alt={service.name}
          fill
          sizes="(max-width: 800px) 100vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      <div className="px-[18px] pb-[18px] pt-4">
        <span className="inline-block rounded-full bg-blue-100 px-[9px] py-1 text-[10px] text-blue-600">{service.category}</span>
        <h3 className="mb-1.5 mt-2.5 text-[17px] font-semibold">{service.name}</h3>
        <p className="mb-4 text-xs text-gray-500"><span aria-hidden="true">◇</span> {formatPrice(service.minPrice, service.maxPrice)}</p>
        <Link className="text-[13px] font-semibold text-blue-600 underline underline-offset-2" href={`/services/${service.id}`}>เลือกบริการ</Link>
      </div>
    </article>
  );
}
