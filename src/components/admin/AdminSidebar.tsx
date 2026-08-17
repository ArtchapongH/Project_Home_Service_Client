"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import houseIcon from "@/assets/icons/house 1.png";
import categoryIcon from "@/assets/icons/category.png";
import serviceIcon from "@/assets/icons/service.png";
import promotionIcon from "@/assets/icons/promotion.png";
import logoutIcon from "@/assets/icons/logout.png";

type ActiveKey = "category" | "service" | "promotion" | "logout";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems: {
    key: ActiveKey;
    label: string;
    href: string;
    icon: typeof categoryIcon;
  }[] = [
    {
      key: "category",
      label: "หมวดหมู่",
      href: "/admin/categories",
      icon: categoryIcon,
    },
    {
      key: "service",
      label: "บริการ",
      href: "/admin/services",
      icon: serviceIcon,
    },
    {
      key: "promotion",
      label: "Promotion Code",
      href: "/admin/promotion",
      icon: promotionIcon,
    },
  ];

  const getActiveItem = (): ActiveKey | null => {
    if (pathname.startsWith("/admin/categories")) return "category";
    if (pathname.startsWith("/admin/services")) return "service";
    if (pathname.startsWith("/admin/promotion")) return "promotion";
    return null;
  };

  const currentActive = getActiveItem();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-72 shrink-0 flex-col bg-[#031b67] py-6 text-white">
      <div className="px-4">
        <Link
          href="/"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#eef3ff] px-4 font-semibold text-[#2d63f6]"
        >
          <Image src={houseIcon} alt="Home Services" className="h-5 w-5" />
          <span>Home Services</span>
        </Link>
      </div>

      <nav className="mt-8 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentActive === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex h-12 items-center gap-3 px-6 transition-colors ${
                isActive ? "bg-[#12358f]" : "hover:bg-[#0a2a7d]"
              }`}
            >
              <Image src={item.icon} alt={item.label} className="h-5 w-5" />
              <span className="text-lg">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-2">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left transition-colors hover:bg-[#0a2a7d]"
        >
          <Image src={logoutIcon} alt="ออกจากระบบ" className="h-5 w-5" />
          <span className="text-lg">ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
