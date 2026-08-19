"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function TechnicianHomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/technician/login");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5fa] px-4">
      <section className="w-full max-w-lg rounded-md border border-[#d7dbe5] bg-white p-10 text-center shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <h1 className="mb-3 text-2xl font-bold text-[#092c76]">
          เข้าสู่ระบบช่างสำเร็จ
        </h1>
        <p className="mb-8 text-sm text-gray-600">
          ยินดีต้อนรับ {user?.fullName || user?.email}
          <br />
          หน้าจัดการงานช่างจะเชื่อมกับ backend ในขั้นถัดไป
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="h-11 rounded-md border border-gray-300 px-6 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          ออกจากระบบ
        </button>
      </section>
    </main>
  );
}
