"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

interface CustomerServicesSideNavProps {
  activeMenu?: "profile" | "password" | "services" | "history";
}

export function CustomerServicesSideNav({
  activeMenu = "services",
}: CustomerServicesSideNavProps) {
  const pathname = usePathname();

  const isProfileActive =
    activeMenu === "profile" || pathname === "/profile";
  const isPasswordActive =
    activeMenu === "password" || pathname.startsWith("/profile/password");
  const isServicesActive =
    activeMenu === "services" ||
    pathname === "/customer-services" ||
    pathname === "/customer-services/list" ||
    pathname === "/orders" ||
    pathname === "/profile/orders";
  const isHistoryActive =
    activeMenu === "history" ||
    pathname === "/customer-services/history" ||
    pathname === "/orders/history" ||
    pathname === "/profile/history" ||
    pathname === "/history";

  return (
    <aside className="w-full min-[801px]:w-[250px] shrink-0">
      <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-500 pb-3 border-b border-gray-200">
          บัญชีผู้ใช้
        </h2>

        <nav className="mt-3 flex flex-col gap-1 text-sm font-medium">
          {/* ข้อมูลผู้ใช้งาน */}
          <Link
            href="/profile"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
              isProfileActive
                ? "bg-blue-50 text-[#3366FF] font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <PersonOutlineOutlinedIcon
              sx={{
                fontSize: 20,
                color: isProfileActive ? "#3366FF" : "#64748B",
              }}
            />
            <span>ข้อมูลผู้ใช้งาน</span>
          </Link>

          <Link
            href="/profile/password"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
              isPasswordActive
                ? "bg-blue-50 text-[#3366FF] font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LockOutlinedIcon
              sx={{
                fontSize: 20,
                color: isPasswordActive ? "#3366FF" : "#64748B",
              }}
            />
            <span>รีเซ็ตรหัสผ่าน</span>
          </Link>

          {/* รายการคำสั่งซ่อม */}
          <Link
            href="/customer-services"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
              isServicesActive
                ? "bg-blue-50 text-[#3366FF] font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <AssignmentOutlinedIcon
              sx={{
                fontSize: 20,
                color: isServicesActive ? "#3366FF" : "#64748B",
              }}
            />
            <span>รายการคำสั่งซ่อม</span>
          </Link>

          {/* ประวัติการซ่อม */}
          <Link
            href="/customer-services/history"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-colors ${
              isHistoryActive
                ? "bg-blue-50 text-[#3366FF] font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <HistoryOutlinedIcon
              sx={{
                fontSize: 20,
                color: isHistoryActive ? "#3366FF" : "#64748B",
              }}
            />
            <span>ประวัติการซ่อม</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default CustomerServicesSideNav;
