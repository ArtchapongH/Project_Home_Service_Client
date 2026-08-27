import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import AppProviders from "@/components/providers/AppProviders";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-[#171b24]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            <SiteChrome>{children}</SiteChrome>
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
