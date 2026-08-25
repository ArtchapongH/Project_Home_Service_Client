import type { ReactNode } from "react";

type LoginCardProps = {
  children: ReactNode;
  isWide?: boolean;
};

export default function LoginCard({
  children,
  isWide = false,
}: LoginCardProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-utility-bg px-4 py-6 sm:px-6 sm:py-10">
      <section
        className={`w-full rounded-xl border border-gray-200 bg-white py-8 sm:py-10 ${
          isWide
            ? "max-w-xl px-6 sm:px-10"
            : "max-w-105 px-5 sm:px-8"
        }`}
      >
        {children}
      </section>
    </main>
  );
}
