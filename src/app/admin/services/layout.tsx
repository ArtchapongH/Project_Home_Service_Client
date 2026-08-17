"use client";

import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ServiceProvider } from "@/contexts/ServiceContext";

export default function AdminServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ServiceProvider>
      <div className="flex min-h-screen w-full bg-[#F3F4F6] text-gray-700">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col w-full">{children}</div>
      </div>
    </ServiceProvider>
  );
}
