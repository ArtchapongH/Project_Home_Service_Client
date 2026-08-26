"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, type Locale } from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Common");

  const switchLocale = (nextLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };

  return (
    <div className="flex items-center gap-1 text-xs font-semibold" role="group" aria-label={t("language")}>
      <button
        type="button"
        onClick={() => switchLocale("th")}
        className={`rounded px-1.5 py-1 transition ${
          locale === "th" ? "text-blue-600" : "text-gray-400 hover:text-gray-700"
        }`}
        aria-pressed={locale === "th"}
      >
        {t("thai")}
      </button>
      <span className="text-gray-300" aria-hidden="true">
        |
      </span>
      <button
        type="button"
        onClick={() => switchLocale("en")}
        className={`rounded px-1.5 py-1 transition ${
          locale === "en" ? "text-blue-600" : "text-gray-400 hover:text-gray-700"
        }`}
        aria-pressed={locale === "en"}
      >
        {t("english")}
      </button>
    </div>
  );
}
