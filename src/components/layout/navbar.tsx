"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { HomeServicesLogo } from "./home-services-logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { UserAvatar } from "./UserAvatar";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isTechnician, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Nav");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const menuLinkClassName =
    "flex items-center gap-2 rounded-[7px] px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100";

  return (
    <header className="relative z-10 h-14 bg-white shadow-[0_2px_14px_rgb(23_51_109/8%)] min-[801px]:h-[72px]">
      <div className="mx-auto flex h-full w-[min(1140px,calc(100%-24px))] items-center justify-between gap-1 min-[801px]:w-[min(1140px,calc(100%-48px))] min-[801px]:gap-4">
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
                className="whitespace-nowrap font-bold text-blue-600 hover:underline"
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

        <div className="flex shrink-0 items-center gap-1 min-[801px]:gap-3">
          <LanguageSwitcher />
          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="flex min-w-0 items-center gap-2 text-sm font-medium text-gray-800 hover:text-blue-600"
                aria-label={t("openProfile")}
              >
                <span className="hidden max-w-32 truncate font-semibold text-gray-700 hover:text-blue-600 min-[801px]:inline sm:max-w-48">
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
                className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-[#eef1f7] text-gray-600 transition hover:bg-blue-100 hover:text-blue-600 min-[801px]:size-9"
                aria-label={t("notifications")}
              >
                <NotificationsNoneRoundedIcon className="text-[18px] min-[801px]:text-[20px]" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden min-h-[42px] cursor-pointer items-center justify-center rounded-[7px] border border-gray-300 px-[18px] py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 min-[801px]:inline-flex"
              >
                {t("logout")}
              </button>
            </>
          ) : (
            <div className="hidden items-center gap-2 min-[801px]:flex">
              <Link
                href="/login"
                className="inline-flex min-h-[42px] items-center justify-center rounded-[7px] border border-blue-500 px-[22px] py-2.5 text-sm font-medium text-blue-600 transition hover:-translate-y-px hover:bg-blue-100"
              >
                {t("login")}
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-[42px] items-center justify-center rounded-[7px] border border-transparent bg-blue-500 px-[22px] py-2.5 text-sm font-medium text-white transition hover:-translate-y-px hover:bg-blue-700"
              >
                {t("register")}
              </Link>
            </div>
          )}

          <div className="relative min-[801px]:hidden" ref={menuRef}>
            <button
              type="button"
              className="flex size-8 cursor-pointer items-center justify-center rounded-[7px] border border-gray-300 text-gray-700"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <CloseRoundedIcon className="text-[20px]" /> : <MenuRoundedIcon className="text-[20px]" />}
            </button>
            {menuOpen ? (
              <nav
                id="mobile-nav-menu"
                aria-label={t("mainMenu")}
                className="absolute right-0 top-[calc(100%+8px)] w-56 rounded-[10px] border border-gray-200 bg-white p-2 shadow-[0_8px_24px_rgb(23_51_109/12%)]"
              >
                <Link href="/services" className={menuLinkClassName} onClick={() => setMenuOpen(false)}>
                  {t("services")}
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link href="/profile" className={menuLinkClassName} onClick={() => setMenuOpen(false)}>
                      {t("profile")}
                    </Link>
                    {isAdmin ? (
                      <Link href="/admin/categories" className={menuLinkClassName} onClick={() => setMenuOpen(false)}>
                        {t("admin")}
                      </Link>
                    ) : null}
                    {isTechnician ? (
                      <Link href="/technician/requests" className={menuLinkClassName} onClick={() => setMenuOpen(false)}>
                        {t("technician")}
                      </Link>
                    ) : null}
                    <button type="button" onClick={handleLogout} className={`${menuLinkClassName} w-full cursor-pointer`}>
                      <LogoutRoundedIcon className="text-[18px]" />
                      {t("logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={menuLinkClassName} onClick={() => setMenuOpen(false)}>
                      {t("login")}
                    </Link>
                    <Link href="/register" className={menuLinkClassName} onClick={() => setMenuOpen(false)}>
                      {t("register")}
                    </Link>
                  </>
                )}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
