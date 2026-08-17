"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@mui/material";

export function ServiceBottomBanner() {
  return (
    <section
      className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-blue-500 px-4 py-[64px] text-center text-white min-[801px]:min-h-[370px] min-[801px]:py-[76px]"
      aria-label="เกี่ยวกับบริการ HomeServices"
    >
      <div className="relative z-10 mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
        <Typography
          variant="h5"
          component="p"
          sx={{
            fontWeight: 500,
            fontSize: { xs: "1rem", sm: "1.15rem", md: "1.375rem" },
            lineHeight: { xs: 1.85, md: 2.1 },
            maxWidth: 920,
            mx: "auto",
            letterSpacing: "-0.01em",
            fontFamily: "inherit",
          }}
        >
          เพราะเราคือช่าง ผู้ให้บริการเรื่องบ้านอันดับ 1 แบบครบวงจร โดยทีมช่างมืออาชีพมากกว่า 100 ทีม
          <br className="hidden sm:inline" />
          {" "}สามารถตอบโจทย์ด้านการบริการเรื่องบ้านของคุณ และสร้าง
          <br className="hidden sm:inline" />
          {" "}ความสะดวกสบายในการติดต่อกับทีมช่าง ได้ทุกที่ ทุกเวลา ตลอด 24 ชม.
          <br className="hidden sm:inline" />
          {" "}มั่นใจ ช่างไม่ทิ้งงาน พร้อมรับประกันคุณภาพงาน
        </Typography>
      </div>

      {/* Watermark House Logo - จัดขนาด ความสูง และตำแหน่ง ให้ตรงตามรูปที่ 1 */}
      <Image
        src="/images/landing/Logo-Home2.png"
        alt=""
        width={420}
        height={420}
        unoptimized
        className="pointer-events-none absolute right-[-5%] bottom-[-18%] z-0 h-auto w-[360px] object-contain opacity-[0.18] brightness-[1.7] min-[801px]:right-[-2%] min-[801px]:bottom-[-16%] min-[801px]:w-[420px]"
        aria-hidden="true"
      />
    </section>
  );
}
