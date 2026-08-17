"use client";

import { useEffect, useState } from "react";
import { getMyProfile } from "@/src/services/profile.service";
import type { UserProfile } from "@/src/types/user";

export function ProfileCard() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getMyProfile()
      .then((data) => { if (active) setProfile(data); })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          typeof reason === "object" && reason !== null && "message" in reason
            ? String(reason.message)
            : "ไม่สามารถโหลดโปรไฟล์ได้",
        );
      });
    return () => { active = false; };
  }, []);

  if (error) {
    return <div role="alert" className="max-w-160 rounded-xl bg-red-50 p-6 text-sm text-red-700">{error}</div>;
  }
  if (!profile) {
    return <p className="m-0 text-sm text-gray-500">กำลังโหลดข้อมูลโปรไฟล์...</p>;
  }

  const rows = [
    ["ชื่อ-นามสกุล", profile.fullName || "-"],
    ["อีเมล", profile.email || "-"],
    ["เบอร์โทรศัพท์", profile.phone || "-"],
    ["สิทธิ์ผู้ใช้งาน", profile.role || "-"],
  ];

  return (
    <section aria-label="ข้อมูลโปรไฟล์" className="grid max-w-160 gap-1 overflow-hidden rounded-xl bg-white p-7 shadow-[0_8px_24px_rgb(23_51_109/6%)]">
      <dl className="m-0 divide-y divide-gray-100">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="m-0 text-sm font-medium text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
