"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ClipboardList, History, LogOut, Settings, Wrench } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTechnician } from "@/contexts/TechnicianContext";

const items = [
  { href: "/technician/requests", label: "คำขอบริการซ่อม", Icon: Bell },
  { href: "/technician/jobs", label: "รายการที่รอดำเนินการ", Icon: ClipboardList },
  { href: "/technician/history", label: "ประวัติการซ่อม", Icon: History },
  { href: "/technician/settings", label: "ตั้งค่าบัญชีผู้ใช้", Icon: Settings },
];

export function TechnicianSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { requestCount } = useTechnician();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#062968] py-6 text-white">
      <Link href="/" className="mx-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-white font-semibold text-blue-600">
        <Wrench size={18} /> HomeServices
      </Link>
      <nav className="mt-8">
        {items.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex h-12 items-center gap-3 px-6 text-sm transition ${active ? "bg-[#0641A6]" : "text-blue-100 hover:bg-[#0641A6]/70"}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {href.endsWith("/requests") && requestCount > 0 && (
                <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{requestCount}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={handleLogout} className="mt-auto flex h-12 items-center gap-3 px-6 text-sm text-blue-100 hover:bg-[#0641A6]/70">
        <LogOut size={18} /> ออกจากระบบ
      </button>
    </aside>
  );
}
