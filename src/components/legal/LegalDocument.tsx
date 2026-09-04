import Link from "next/link";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

type LegalDocumentProps = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export default function LegalDocument({
  title,
  lastUpdated,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <main className="bg-utility-bg px-4 py-8 sm:py-12">
      <article className="mx-auto w-full max-w-3xl rounded-xl border border-gray-200 bg-white px-5 py-8 sm:px-10 sm:py-12">
        <p className="mb-2 text-sm text-blue-600">HomeServices</p>
        <h1 className="mb-2 text-2xl font-bold text-[#092c76] sm:text-3xl">
          {title}
        </h1>
        <p className="mb-6 text-sm text-gray-500">อัปเดตล่าสุด: {lastUpdated}</p>
        <p className="mb-8 text-sm leading-7 text-gray-700 sm:text-base">
          {intro}
        </p>

        <div className="flex flex-col gap-8">
          {sections.map((section, index) => (
            <section key={section.title}>
              <h2 className="mb-3 text-base font-semibold text-gray-900 sm:text-lg">
                {index + 1}. {section.title}
              </h2>
              <div className="flex flex-col gap-3">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-gray-700 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <Link
            href="/register"
            className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
          >
            กลับไปหน้าลงทะเบียน
          </Link>
        </div>
      </article>
    </main>
  );
}
