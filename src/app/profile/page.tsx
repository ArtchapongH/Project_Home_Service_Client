import { ProfileForm } from "@/components/profile/profile-form";

export default function ProfilePage() {
  return (
    <main>
      <section className="min-h-[calc(100vh-72px)] bg-gray-100 pt-12 pb-20">
        <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
          <h1 className="mb-2 text-[32px] font-bold text-blue-700">ข้อมูลส่วนตัว</h1>
          <p className="mb-7 text-gray-500">แก้ไขชื่อ เบอร์โทร และที่อยู่ที่ใช้รับบริการ</p>
          <ProfileCard />
        </div>
      </section>
    </main>
  );
}
