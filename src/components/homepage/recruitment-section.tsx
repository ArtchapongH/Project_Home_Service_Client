import Image from "next/image";
import { useTranslations } from "next-intl";

export function RecruitmentSection() {
  const t = useTranslations("Landing.recruitment");

  return (
    <section className="grid min-h-[400px] grid-cols-1 bg-blue-500 text-white min-[801px]:grid-cols-[35%_65%]" aria-labelledby="recruitment-title">
      <div className="relative min-h-[260px] overflow-hidden min-[801px]:min-h-[305px]">
        <Image
          src="/images/landing/recruitment-technician-original.png"
          alt={t("imageAlt")}
          fill
          sizes="(max-width: 768px) 100vw, 36vw"
          className="object-cover object-[center_35%] min-[801px]:object-center"
        />
      </div>
      <div className="relative flex min-h-[290px] items-center overflow-hidden px-8 py-[45px] text-center min-[801px]:min-h-0 min-[801px]:px-[11%] min-[801px]:pt-7 min-[801px]:pb-[46px] min-[801px]:text-left">
        <div className="relative z-[1] w-full min-[801px]:w-auto">
          <h2 className="mb-[18px] text-[35px] leading-[1.35] font-semibold min-[801px]:text-[41px]" id="recruitment-title">
            {t.rich("title", {
              newline: () => <br />,
            })}
          </h2>
          <p className="mb-[21px] text-[25px] leading-[1.7]">
            {t.rich("body", {
              newline: () => <br />,
            })}
          </p>
          <a className="text-[15px] font-semibold min-[801px]:text-[38px]" href="mailto:job@homeservices.co">
            {t("contact")}
          </a>
        </div>
        <Image
          src="/images/landing/Logo-Home2.png"
          alt=""
          width={420}
          height={420}
          unoptimized
          className="pointer-events-none absolute right-[-7%] bottom-[-13%] z-0 h-auto w-[420px] object-contain opacity-[0.18] brightness-[1.7]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
