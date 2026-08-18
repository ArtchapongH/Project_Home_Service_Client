"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6] text-gray-700">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col w-full">{children}</div>
    </div>
  );
}
