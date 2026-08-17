import { ReactNode } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AdminGuard>
  );
}
