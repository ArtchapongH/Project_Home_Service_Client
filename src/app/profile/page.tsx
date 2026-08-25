import { CustomerServicesSideNav } from "@/components/customer-services/CustomerServicesSideNav";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { ProfileCard2 } from "@/components/profile/profile-card2";

export const metadata = {
  title: "ข้อมูลผู้ใช้งาน | HomeServices",
  description: "จัดการข้อมูลส่วนตัวและบัญชีผู้ใช้งานของคุณ",
};

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
        {/* Top Blue Hero Banner */}
        <section className="flex h-24 sm:h-28 w-full items-center justify-center bg-[#3366FF] px-4 text-white shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            ข้อมูลผู้ใช้งาน
          </h1>
        </section>

        {/* Main Content Layout */}
        <main className="flex-1 py-8 sm:py-10">
          <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
            <div className="flex flex-col gap-6 min-[801px]:flex-row min-[801px]:items-start min-[801px]:gap-8">
              {/* 1. Side Navbar (Sticky) */}
              <CustomerServicesSideNav activeMenu="profile" />

              {/* 2. User Profile Card */}
              <div className="flex-1 min-w-0">
                <ProfileCard2 />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
