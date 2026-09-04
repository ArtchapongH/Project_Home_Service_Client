"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function TechnicianGuard({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, isTechnician } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/technician/login";

  useEffect(() => {
    if (!isLoading && !isLoginPage) {
      if (!isAuthenticated || !isTechnician) {
        router.replace("/technician/login");
      }
    }
  }, [isLoading, isAuthenticated, isTechnician, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">
            กำลังตรวจสอบสิทธิ์การเข้าถึง...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isTechnician) {
    return null;
  }

  return <>{children}</>;
}
