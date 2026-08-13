import Link from "next/link";
import { HomeServicesLogo } from "./home-services-logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="page-container footer-main">
        <Link href="/" className="logo-link" aria-label="กลับไปหน้าแรก">
          <HomeServicesLogo />
        </Link>
        <div className="company-details">
          <strong>บริษัท โฮมเซอร์วิส จำกัด</strong>
          <p>
            452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
          </p>
        </div>
        <address>
          <a href="tel:0805406357">⌕&nbsp;&nbsp; 080-540-6357</a>
          <a href="mailto:contact@homeservices.co">
            ✉&nbsp;&nbsp; contact@homeservices.co
          </a>
        </address>
      </div>
      <div className="footer-bottom">
        <div className="page-container footer-bottom-inner">
          <small>copyright © 2026 HomeServices.com All rights reserved</small>
          <div>
            <a href="#terms">เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์</a>
            <a href="#privacy">นโยบายความเป็นส่วนตัว</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
