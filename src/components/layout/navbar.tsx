"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { HomeServicesLogo } from "./home-services-logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserAvatar } from "./UserAvatar";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isTechnician, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Nav");

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="relative z-10 h-16 bg-white shadow-[0_2px_14px_rgb(23_51_109/8%)] min-[801px]:h-[72px]">
      <div className="mx-auto flex h-full w-[min(1140px,calc(100%-32px))] items-center justify-between gap-4 min-[801px]:w-[min(1140px,calc(100%-48px))]">
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link href="/" className="shrink-0" aria-label={t("homeAria")}>
            <HomeServicesLogo />
          </Link>
          <nav
            className="hidden items-center gap-6 text-sm font-semibold min-[801px]:flex"
            aria-label={t("mainMenu")}
          >
            <Link href="/services" className="whitespace-nowrap hover:text-blue-600">
              {t("services")}
            </Link>
            {isAuthenticated && (
              <Link href="/profile" className="whitespace-nowrap hover:text-blue-600">
                {t("profile")}
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/admin/categories"
                className="whitespace-nowrap text-blue-600 font-bold hover:underline"
              >
                {t("admin")}
              </Link>
            )}
            {isTechnician && (
              <Link href="/technician/requests" className="whitespace-nowrap font-bold text-blue-600 hover:underline">
                {t("technician")}
              </Link>
            )}
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 min-[801px]:gap-3">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex min-w-0 items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                aria-label={t("openProfile")}
              >
                <span className="hidden max-w-32 truncate font-semibold text-gray-700 hover:text-blue-600 sm:inline sm:max-w-48">
                  {user?.displayName || user?.fullName || user?.email}
                </span>
                <UserAvatar
                  displayName={user?.displayName}
                  fullName={user?.fullName}
                  email={user?.email}
                  avatarUrl={user?.avatarUrl}
                />
              </Link>
              <Link
                href="/notifications"
                className="flex size-9 items-center justify-center rounded-full bg-[#eef1f7] text-gray-600 transition hover:bg-blue-100 hover:text-blue-600"
                aria-label={t("notifications")}
              >
                <NotificationsNoneRoundedIcon className="text-[20px]" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex min-h-9 items-center justify-center rounded-[7px] border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 min-[801px]:min-h-[42px] min-[801px]:px-[18px] min-[801px]:py-2 min-[801px]:text-sm"
              >
                {t("logout")}
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-9 items-center justify-center rounded-[7px] border border-blue-500 px-3.5 py-1.5 text-xs font-medium text-blue-600 transition hover:-translate-y-px hover:bg-blue-100 min-[801px]:min-h-[42px] min-[801px]:px-[22px] min-[801px]:py-2.5 min-[801px]:text-sm"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-9 items-center justify-center rounded-[7px] border border-transparent bg-blue-500 px-3.5 py-1.5 text-xs font-medium text-white transition hover:-translate-y-px hover:bg-blue-700 min-[801px]:min-h-[42px] min-[801px]:px-[22px] min-[801px]:py-2.5 min-[801px]:text-sm"
              >
                {t("register")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
