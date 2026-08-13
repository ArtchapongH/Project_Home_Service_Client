import type { ReactNode } from "react";

export default function LoginCard({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-utility-bg px-4 py-6 sm:px-6 sm:py-10">
      <section className="w-full max-w-105 rounded-xl border border-gray-200 bg-white px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </section>
    </main>
  );
}
