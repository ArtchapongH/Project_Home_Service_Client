"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  locales,
  type Locale,
} from "@/i18n/config";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Common");
  const localeLabels = {
    th: t("locale.th"),
    en: t("locale.en"),
  } as const;

  const switchLocale = (nextLocale: Locale) => {
    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`;
    router.refresh();
  };

  return (
    <div
      className="flex items-center gap-1 text-xs font-semibold"
      role="group"
      aria-label={t("language")}
    >
      {locales.map((code, index) => (
        <Fragment key={code}>
          {index > 0 && (
            <span className="text-gray-300" aria-hidden="true">
              |
            </span>
          )}
          <button
            type="button"
            onClick={() => switchLocale(code)}
            aria-pressed={locale === code}
            className={`cursor-pointer rounded px-1 py-0.5 transition min-[801px]:px-1.5 min-[801px]:py-1 ${
              locale === code
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            <span className="min-[801px]:hidden">{code.toUpperCase()}</span>
            <span className="hidden min-[801px]:inline">{localeLabels[code]}</span>
          </button>
        </Fragment>
      ))}
    </div>
  );
}
