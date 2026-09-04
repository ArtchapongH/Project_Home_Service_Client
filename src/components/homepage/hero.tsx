import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations("Landing.hero");

  return (
    <section className="relative min-h-[calc(100dvh-3.5rem)] overflow-hidden bg-[#eaf1ff] min-[801px]:min-h-[430px]">
      <Image
        src="/images/landing/hero-technician.png"
        alt={t("imageAlt")}
        width={720}
        height={960}
        priority
        unoptimized
        className="pointer-events-none absolute right-[6%] bottom-[15%] z-0 h-[53%] w-auto max-w-none object-contain object-bottom min-[801px]:hidden"
      />
      <Image
        src="/images/landing/hero-technician.png"
        alt={t("imageAlt")}
        fill
        priority
        unoptimized
        sizes="100vw"
        className="hidden object-contain object-[calc(50%+330px)_bottom] min-[801px]:block"
      />
      <div className="relative z-[1] mx-auto flex min-h-[calc(100dvh-3.5rem)] w-[min(1140px,calc(100%-32px))] items-start pt-8 min-[801px]:min-h-[430px] min-[801px]:w-[min(1140px,calc(100%-48px))] min-[801px]:items-center min-[801px]:pt-0">
        <div className="w-[78%] pb-1 text-left min-[801px]:w-[57%]">
          <h1 className="mb-2 text-[29px] leading-[1.18] font-extrabold tracking-[-1.5px] text-blue-700 min-[421px]:text-[34px] min-[801px]:text-[clamp(32px,4vw,52px)]">
            {t("title")}
          </h1>
          <h2 className="mb-7 text-lg font-bold min-[421px]:text-[21px] min-[801px]:text-[clamp(22px,2.5vw,31px)]">
            {t("subtitle")}
          </h2>
          <p className="mb-[34px] text-sm leading-[1.8] text-[#697386] min-[801px]:text-base [&_br]:max-[420px]:hidden">
            {t.rich("description", {
              newline: () => <br />,
            })}
          </p>
          <Link
            href="/services"
            className="inline-flex min-h-[42px] items-center justify-center rounded-[7px] bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-blue-700"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
