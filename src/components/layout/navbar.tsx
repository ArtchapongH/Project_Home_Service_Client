import Link from "next/link";
import { HomeServicesLogo } from "./home-services-logo";

export function Navbar() {
  return (
    <header className="relative z-10 h-16 bg-white shadow-[0_2px_14px_rgb(23_51_109/8%)] min-[801px]:h-[72px]">
      <div className="mx-auto flex h-full w-[min(1140px,calc(100%-32px))] items-center justify-between gap-4 min-[801px]:w-[min(1140px,calc(100%-48px))]">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link href="/" className="shrink-0" aria-label="กลับไปหน้าแรก">
            <HomeServicesLogo />
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm font-semibold min-[801px]:flex"
            aria-label="เมนูหลัก"
          >
            <Link href="/services" className="whitespace-nowrap">
              บริการของเรา
            </Link>
            <Link href="/profile" className="whitespace-nowrap">
              Profile
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2 min-[801px]:gap-3">
          <Link
            href="/login"
            className="inline-flex min-h-9 items-center justify-center rounded-[7px] border border-blue-500 px-3.5 py-1.5 text-xs font-medium text-blue-600 transition hover:-translate-y-px hover:bg-blue-100 min-[801px]:min-h-[42px] min-[801px]:px-[22px] min-[801px]:py-2.5 min-[801px]:text-sm"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-9 items-center justify-center rounded-[7px] border border-transparent bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white transition hover:-translate-y-px hover:bg-blue-700 min-[801px]:min-h-[42px] min-[801px]:px-[22px] min-[801px]:py-2.5 min-[801px]:text-sm"
          >
            ลงทะเบียน
          </Link>
        </div>
      </div>
    </header>
  );
}
