import Link from "next/link";
import { HomeServicesLogo } from "./home-services-logo";

export function Navbar() {
  return (
    <header className="relative z-10 h-16 bg-white shadow-[0_2px_14px_rgb(23_51_109/8%)] min-[801px]:h-[72px]">
      <div className="mx-auto grid h-full w-[min(1140px,calc(100%-32px))] grid-cols-[1fr_auto] items-center min-[801px]:w-[min(1140px,calc(100%-48px))] min-[801px]:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="w-fit" aria-label="กลับไปหน้าแรก">
          <HomeServicesLogo />
        </Link>
        <nav className="ml-[-300px] hidden justify-self-start gap-6 text-sm font-semibold min-[801px]:flex" aria-label="เมนูหลัก">
          <Link href="/services">บริการของเรา</Link>
          <Link href="/profile">Profile</Link>
        </nav>
        <div className="flex items-center justify-self-end gap-2 min-[801px]:gap-3">
          <Link href="/login" className="inline-flex min-h-9 items-center justify-center rounded-[7px] border border-blue-500 px-3.5 py-1.5 text-xs font-medium text-blue-600 transition hover:-translate-y-px hover:bg-blue-100 min-[801px]:min-h-[42px] min-[801px]:px-[22px] min-[801px]:py-2.5 min-[801px]:text-sm">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="inline-flex min-h-9 items-center justify-center rounded-[7px] border border-transparent bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white transition hover:-translate-y-px hover:bg-blue-700 min-[801px]:min-h-[42px] min-[801px]:px-[22px] min-[801px]:py-2.5 min-[801px]:text-sm">
            ลงทะเบียน
          </Link>
        </div>
      </div>
    </header>
  );
}
