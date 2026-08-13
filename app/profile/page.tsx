import { ProfileForm } from "@/components/profile/profile-form";

export default function ProfilePage() {
  return (
    <main>
      <section className="profile-page">
        <div className="page-container">
          <h1>ข้อมูลส่วนตัว</h1>
          <p>แก้ไขชื่อ เบอร์โทร และที่อยู่ที่ใช้รับบริการ</p>
          <ProfileForm />
        </div>
      </section>
    </main>
  );
}
