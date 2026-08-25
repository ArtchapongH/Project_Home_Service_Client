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
  { href: "https://linkedin.com", label: "LinkedIn", className: "linkedin", Icon: LinkedinIcon },
  { href: "https://github.com", label: "GitHub", className: "github", Icon: GithubIcon },
  { href: "https://facebook.com", label: "Facebook", className: "facebook", Icon: FacebookIcon },
  { href: "https://line.me", label: "LINE", className: "line", Icon: LineIcon },
  { href: "mailto:contact@homeservices.co", label: "Gmail", className: "gmail", Icon: GmailIcon },
] as const;

export function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto grid min-h-[122px] w-[min(1140px,calc(100%-32px))] grid-cols-1 items-center gap-[22px] py-10 text-center min-[801px]:w-[min(1140px,calc(100%-48px))] min-[801px]:grid-cols-[1.2fr_1.8fr_1fr] min-[801px]:gap-9 min-[801px]:py-0 min-[801px]:text-left">
        <div className="flex flex-col items-center gap-3 min-[801px]:items-start">
          <Link href="/" className="w-fit" aria-label="กลับไปหน้าแรก">
            <HomeServicesLogo />
          </Link>
          <nav className="footer-social" aria-label="โซเชียลมีเดีย">
            <ul>
              {socialLinks.map(({ href, label, className, Icon }) => (
                <li key={label}>
                  <a
                    className={className}
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

        <div>
          <strong className="mb-[7px] block text-sm">
            บริษัท โฮมเซอร์วิส จำกัด
          </strong>
          <p className="m-0 text-[11px] leading-[1.7] text-[#667085]">
            452 ซอยสุขุมวิท 79 แขวงพระโขนงเหนือ เขตวัฒนา กรุงเทพมหานคร 10260
          </p>
        </div>
        <address className="mx-auto flex flex-col gap-[5px] text-[11px] leading-[1.7] text-[#667085] not-italic min-[801px]:mx-0">
          <a href="tel:0805406357" className="inline-flex items-center gap-2">
            <Image
              className="h-4 w-auto"
              src={TelephoneIcon}
              alt=""
              width={12}
              height={16}
            />
            080-540-6357
          </a>
          <a
            href="mailto:contact@homeservices.co"
            className="inline-flex items-center gap-2"
          >
            <Image
              className="h-4 w-auto"
              src={EmailIcon}
              alt=""
              width={12}
              height={16}
            />
            contact@homeservices.co
          </a>
        </address>
      </div>
      <div className="bg-[#f1f2f4] text-[#949aaa]">
        <div className="mx-auto flex min-h-[46px] w-[min(1140px,calc(100%-32px))] flex-col-reverse items-center justify-between gap-4 py-[18px] text-center text-[9px] min-[801px]:w-[min(1140px,calc(100%-48px))] min-[801px]:flex-row min-[801px]:gap-0 min-[801px]:py-0 min-[801px]:text-left">
          <small>copyright © 2026 HomeServices.com All rights reserved</small>
          <div className="flex flex-col gap-2 min-[801px]:flex-row min-[801px]:gap-[30px]">
            <a href="#terms">เงื่อนไขและข้อตกลงการใช้งานเว็บไซต์</a>
            <a href="#privacy">นโยบายความเป็นส่วนตัว</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
