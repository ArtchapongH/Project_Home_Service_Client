import { CustomerServicesSideNav } from "@/components/customer-services/CustomerServicesSideNav";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { ChangePasswordCard } from "@/components/profile/ChangePasswordCard";

export const metadata = {
  title: "รีเซ็ตรหัสผ่าน | HomeServices",
  description: "เปลี่ยนรหัสผ่านบัญชีผู้ใช้งานของคุณ",
};

export default function ProfilePasswordPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
        <section className="flex h-24 sm:h-28 w-full items-center justify-center bg-[#3366FF] px-4 text-white shadow-sm">
          <h1 className="text-center text-2xl font-bold tracking-tight sm:text-3xl">
            รีเซ็ตรหัสผ่าน
          </h1>
        </section>

        <main className="flex-1 py-8 sm:py-10">
          <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
            <div className="flex flex-col gap-6 min-[801px]:flex-row min-[801px]:items-start min-[801px]:gap-8">
              <CustomerServicesSideNav activeMenu="password" />
              <div className="min-w-0 flex-1">
                <ChangePasswordCard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
