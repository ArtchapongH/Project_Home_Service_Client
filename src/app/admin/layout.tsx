import { ReactNode } from "react";
import AdminGuard from "@/components/admin/AdminGuard";

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminGuard>{children}</AdminGuard>;
}
