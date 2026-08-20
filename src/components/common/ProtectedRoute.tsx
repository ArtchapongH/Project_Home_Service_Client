"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  fallbackUrl = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(fallbackUrl);
    }
  }, [isLoading, isAuthenticated, router, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-3">
        <CircularProgress size={36} sx={{ color: "#3366FF" }} />
        <p className="text-sm font-medium text-gray-500">
          กำลังตรวจสอบสิทธิ์การเข้าถึง...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
