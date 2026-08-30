"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ClipboardList, History, LogOut, Menu, Settings, Wrench, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeItem = items.find(({ href }) => pathname.startsWith(href));

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleLogout = async () => {
    await logout();
    router.push("/technician/login");
  };

  const navigation = (onNavigate?: () => void) => (
    <>
      <nav className="mt-8">
        {items.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
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
      <button type="button" onClick={handleLogout} className="mt-auto flex h-12 w-full cursor-pointer items-center gap-3 px-6 text-sm text-blue-100 hover:bg-[#0641A6]/70">
        <LogOut size={18} /> ออกจากระบบ
      </button>
    </>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-[#062968] py-6 text-white md:flex">
      <Link href="/" className="mx-4 flex h-11 items-center justify-center gap-2 rounded-lg bg-white font-semibold text-blue-600">
        <Wrench size={18} /> HomeServices
      </Link>
        {navigation()}
      </aside>

      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-[#062968] px-4 text-white shadow-sm md:hidden">
        <Link href="/" aria-label="HomeServices" className="inline-flex h-9 items-center gap-2 rounded-md bg-white px-3 text-xs font-semibold text-blue-600">
          <Wrench size={16} /> HomeServices
        </Link>
        <span className="mx-3 truncate text-sm font-medium">{activeItem?.label ?? "ช่างบริการ"}</span>
        <button type="button" aria-label="เปิดเมนู" aria-expanded={open} aria-controls="technician-mobile-menu" onClick={() => setOpen(true)} className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <Menu size={24} />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button type="button" aria-label="ปิดเมนู" onClick={() => setOpen(false)} className="absolute inset-0 bg-black/45" />
          <aside id="technician-mobile-menu" role="dialog" aria-modal="true" aria-label="เมนูช่างบริการ" className="relative flex h-full w-[min(82vw,320px)] flex-col bg-[#062968] py-4 text-white shadow-xl">
            <div className="flex items-center justify-between px-4">
              <Link href="/" onClick={() => setOpen(false)} className="flex h-10 items-center gap-2 rounded-lg bg-white px-4 font-semibold text-blue-600">
                <Wrench size={18} /> HomeServices
              </Link>
              <button ref={closeButtonRef} type="button" aria-label="ปิดเมนู" onClick={() => setOpen(false)} className="inline-flex size-11 items-center justify-center rounded-lg hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <X size={24} />
              </button>
            </div>
            {navigation(() => setOpen(false))}
          </aside>
        </div>
      )}
    </>
  );
}
