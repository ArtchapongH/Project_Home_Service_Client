import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import houseIcon from "@/assets/icons/house 1.png";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบแอดมิน",
};

export default function AdminLoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f5fa] px-4 py-12">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center">
        <div className="mb-10 flex items-center gap-3 text-[#2d63f6]">
          <Image
            src={houseIcon}
            alt="Home Services"
            width={40}
            height={40}
            className="h-10 w-10"
            priority
          />
          <span className="text-5xl font-semibold leading-none">HomeServices</span>
        </div>

        <div className="w-full rounded-md border border-[#d7dbe5] bg-white px-14 py-12 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {children}
        </div>
      </div>
    </div>
  );
}
