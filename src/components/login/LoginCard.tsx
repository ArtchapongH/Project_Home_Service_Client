import type { ReactNode } from "react";

type LoginCardWidth = "default" | "medium" | "wide";

type LoginCardProps = {
  children: ReactNode;
  isWide?: boolean;
  width?: LoginCardWidth;
};

const widthClassName: Record<LoginCardWidth, string> = {
  default: "max-w-105 px-5 sm:px-8",
  medium: "max-w-lg px-6 sm:px-9",
  wide: "max-w-xl px-6 sm:px-10",
};

export default function LoginCard({
  children,
  isWide = false,
  width,
}: LoginCardProps) {
  const resolvedWidth: LoginCardWidth = width ?? (isWide ? "wide" : "default");

  return (
    <main className="flex min-h-screen items-center justify-center bg-utility-bg px-4 py-6 sm:px-6 sm:py-10">
      <section
        className={`w-full rounded-xl border border-gray-200 bg-white py-8 sm:py-10 ${widthClassName[resolvedWidth]}`}
      >
        {children}
      </section>
    </main>
  );
}
