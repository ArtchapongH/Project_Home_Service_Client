import { ServiceListContent } from "@/components/services/ServiceListContent";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Services");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default function ServicesPage() {
  return (
    <main>
      <ServiceListContent />
    </main>
  );
}
