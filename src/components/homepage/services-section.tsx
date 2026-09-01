"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ServiceCard } from "./service-card";
import { getApiErrorMessage, getPublicServices } from "@/services/publicServiceApi";
import type { PublicService } from "@/types/public-service";

const FALLBACK_IMAGE = "/images/landing/service-aircon.png";

export function ServicesSection() {
  const t = useTranslations("Landing.popularServices");
  const tServices = useTranslations("Services");
  const locale = useLocale();
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function formatPriceText(service: PublicService): string {
    const formatNumber = (value: number) =>
      value.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    if (service.maxPrice > service.minPrice) {
      return tServices("priceRange", {
        min: formatNumber(service.minPrice),
        max: formatNumber(service.maxPrice),
      });
    }

    return tServices("priceEstimate", {
      price: formatNumber(service.minPrice),
    });
  }

  useEffect(() => {
    let active = true;
    getPublicServices({ featured: true, limit: 3 })
      .then((data) => {
        if (active) setServices(data);
      })
      .catch((reason) => {
        if (active) setError(getApiErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="min-h-[620px] bg-gray-100 py-[52px] text-center min-[801px]:pt-[68px] min-[801px]:pb-[74px]" aria-labelledby="services-title">
      <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
        <h2 className="mb-[46px] text-[26px] font-bold text-blue-900" id="services-title">{t("title")}</h2>
        {loading ? (
          <p className="text-sm text-gray-500">{t("loading")}</p>
        ) : error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : services.length === 0 ? (
          <p className="text-sm text-gray-500">{t("empty")}</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 min-[801px]:grid-cols-3 min-[801px]:gap-8">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={{
                  id: service.id,
                  image: service.imageUrl || FALLBACK_IMAGE,
                  category: service.category,
                  name: service.name,
                  price: formatPriceText(service),
                }}
                selectLabel={t("select")}
              />
            ))}
          </div>
        )}
        <Link href="/services" className="mt-12 inline-flex min-h-[42px] cursor-pointer items-center justify-center rounded-[7px] bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-blue-700">
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
}
