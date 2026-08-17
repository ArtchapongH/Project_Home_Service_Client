'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import houseIcon from "@/assets/icons/house 1.png";
import categoryIcon from "@/assets/icons/category.png";
import serviceIcon from "@/assets/icons/service.png";
import promotionIcon from "@/assets/icons/promotion.png";
import logoutIcon from "@/assets/icons/logout.png";
import axios from "axios";

type ActiveKey = "category" | "service" | "promotion" | "logout";

const AdminSidebar = () => {
    const [activeItem, setActiveItem] = React.useState<ActiveKey>("category");

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
            href: "/admin/service",
            icon: serviceIcon,
        },
        {
            key: "promotion",
            label: "Promotion Code",
            href: "/admin/promotion",
            icon: promotionIcon,
        },
    ];


    const handleLogout = async () => {
        await axios.post("/auth/logout");
    };

    return (
        <aside className="flex h-screen w-72 flex-col bg-[#031b67] py-6 text-white">
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
                    const isActive = activeItem === item.key;

                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            onClick={() => setActiveItem(item.key)}
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
                    onClick={() => {
                        setActiveItem("logout");
                        handleLogout();
                    }}
                    className={`flex h-12 w-full items-center gap-3 rounded-lg px-4 text-left transition-colors ${
                        activeItem === "logout" ? "bg-[#12358f]" : "hover:bg-[#0a2a7d]"
                    }`}
                >
                    <Image src={logoutIcon} alt="ออกจากระบบ" className="h-5 w-5" />
                    <span className="text-lg">ออกจากระบบ</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
