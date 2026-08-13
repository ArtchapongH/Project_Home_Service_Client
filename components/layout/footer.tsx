import Link from "next/link";
import { HomeServicesLogo } from "./home-services-logo";
import {
  FacebookIcon,
  GithubIcon,
  GmailIcon,
  LineIcon,
  LinkedinIcon,
} from "./social-icons";
import Image from "next/image";
import TelephoneIcon from "@/assets/icons/Telephone.png";
import EmailIcon from "@/assets/icons/Email.png";

const socialLinks = [
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://github.com", label: "GitHub", Icon: GithubIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://line.me", label: "LINE", Icon: LineIcon },
  { href: "mailto:contact@homeservices.co", label: "Gmail", Icon: GmailIcon },
] as const;

export function Footer() {
  return (
    <footer className="footer">
      <div className="page-container footer-main">
        <div className="footer-brand">
          <Link href="/" className="logo-link" aria-label="กลับไปหน้าแรก">
            <HomeServicesLogo />
          </Link>
          <nav className="footer-social" aria-label="โซเชียลมีเดีย">
            <ul>
              {socialLinks.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={label}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="company-details">
          <strong>บริษัท โฮมเซอร์วิส จำกัด</strong>
          <p>
            452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
          </p>
        </div>
        <address>
          <a href="tel:0805406357" className="footer-contact-link">
            <Image src={TelephoneIcon} alt="" width={12} height={16} />
            080-540-6357
          </a>
          <a
            href="mailto:contact@homeservices.co"
            className="footer-email-link"
          >
            <Image src={EmailIcon} alt="" width={12} height={16} />
            contact@homeservices.co
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
