"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTechnician } from "@/contexts/TechnicianContext";

export function TechnicianGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { profile, isLoading, error, loadProfile } = useTechnician();
  const requestedRef = useRef(false);
  const isLoginPage = pathname === "/technician/login";

  useEffect(() => {
    if (!isLoginPage && !isAuthLoading && isAuthenticated && !requestedRef.current) {
      requestedRef.current = true;
      void loadProfile();
    }
  }, [isLoginPage, isAuthLoading, isAuthenticated, loadProfile]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthLoading || (isAuthenticated && isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FA]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FA] p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">กรุณาเข้าสู่ระบบก่อนใช้งานระบบช่าง</h1>
          <Link href="/technician/login" className="mt-5 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-white">
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F4F6FA] p-6">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">ไม่สามารถเข้าใช้งานระบบช่าง</h1>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <Link href="/" className="mt-5 inline-flex rounded-lg border border-blue-600 px-5 py-2.5 text-blue-600">
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
