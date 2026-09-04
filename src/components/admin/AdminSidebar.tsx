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
      href: "/admin/promotions",
      icon: promotionIcon,
    },
  ];

  const getActiveItem = (): ActiveKey | null => {
    if (pathname.startsWith("/admin/categories")) return "category";
    if (pathname.startsWith("/admin/services")) return "service";
    if (pathname.startsWith("/admin/promotions") || pathname.startsWith("/admin/promotion")) return "promotion";
    return null;
  };

  const currentActive = getActiveItem();

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-[#001C54] py-6 text-white select-none">
      <div className="px-4">
        <Link
          href="/"
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 font-bold text-[#3366FF] shadow-sm transition-opacity hover:opacity-90"
        >
          <Image src={houseIcon} alt="HomeServices" className="h-5 w-5 object-contain" />
          <span className="text-base tracking-tight">HomeServices</span>
        </Link>
      </div>

      <nav className="mt-8 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = currentActive === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex h-12 items-center gap-3.5 px-6 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#022B8A] text-white"
                  : "text-gray-300 hover:bg-[#022B8A]/60 hover:text-white"
              }`}
            >
              <Image src={item.icon} alt={item.label} className="h-5 w-5 object-contain opacity-90" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-12 w-full cursor-pointer items-center gap-3.5 px-6 text-left text-sm font-medium text-gray-300 transition-colors hover:bg-[#022B8A]/60 hover:text-white"
        >
          <Image src={logoutIcon} alt="ออกจากระบบ" className="h-5 w-5 object-contain opacity-90" />
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
