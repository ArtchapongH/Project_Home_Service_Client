import Link from "next/link";
import { useTranslations } from "next-intl";
import { ServiceCard } from "./service-card";

const serviceKeys = ["cleaning", "aircon", "washingMachine"] as const;

const serviceMeta = {
  cleaning: {
    slug: "general-cleaning",
    image: "/images/landing/service-cleaning.png",
  },
  aircon: {
    slug: "air-conditioner-cleaning",
    image: "/images/landing/service-aircon.png",
  },
  washingMachine: {
    slug: "washing-machine-repair",
    image: "/images/landing/service-washing-machine.png",
  },
} as const;

export function ServicesSection() {
  const t = useTranslations("Landing.popularServices");

  return (
    <section className="min-h-[620px] bg-gray-100 py-[52px] text-center min-[801px]:pt-[68px] min-[801px]:pb-[74px]" aria-labelledby="services-title">
      <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
        <h2 className="mb-[46px] text-[26px] font-bold text-blue-900" id="services-title">{t("title")}</h2>
        <div className="grid grid-cols-1 gap-5 min-[801px]:grid-cols-3 min-[801px]:gap-8">
          {serviceKeys.map((key) => (
            <ServiceCard
              key={key}
              service={{
                slug: serviceMeta[key].slug,
                image: serviceMeta[key].image,
                category: t(`items.${key}.category`),
                name: t(`items.${key}.name`),
                price: t(`items.${key}.price`),
              }}
              selectLabel={t("select")}
            />
          ))}
        </div>
        <Link href="/services" className="mt-12 inline-flex min-h-[42px] items-center justify-center rounded-[7px] bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-blue-700">
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
}
