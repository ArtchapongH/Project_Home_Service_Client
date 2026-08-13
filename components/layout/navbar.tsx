import Link from "next/link";
import { HomeServicesLogo } from "./home-services-logo";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner page-container">
        <Link href="/" className="logo-link" aria-label="กลับไปหน้าแรก">
          <HomeServicesLogo />
        </Link>
        <nav aria-label="เมนูหลัก">
          <Link href="/services">บริการของเรา</Link>
          <Link href="/profile">Profile</Link>
        </nav>
        <div className="navbar-actions">
          <Link href="/login" className="button button-outline">
            เข้าสู่ระบบ
          </Link>
          <Link href="/register" className="button button-primary">
            ลงทะเบียน
          </Link>
        </div>
      </div>
    </header>
  );
}
