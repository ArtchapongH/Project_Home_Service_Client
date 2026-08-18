"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useServiceContext } from "@/contexts/ServiceContext";
import { ServiceItem } from "@/types/service";

function getCategoryBadgeStyle(category: string): string {
  switch (category) {
    case "บริการห้องครัว":
      return "bg-[#F4E6FF] text-[#6B11B5]";
    case "บริการห้องน้ำ":
      return "bg-[#E5F9F6] text-[#009282]";
    case "บริการห้องนอน":
      return "bg-[#FFF0E6] text-[#B54708]";
    case "บริการทั่วไป":
    default:
      return "bg-[#E7F0FF] text-[#0E49B5]";
  }
}

export default function AdminServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { getService } = useServiceContext();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadDetail() {
      setLoading(true);
      const data = await getService(resolvedParams.id);
      setService(data);
      setLoading(false);
    }
    loadDetail();
  }, [resolvedParams.id, getService]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-gray-500">
        กำลังโหลดรายละเอียดบริการ...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-red-500">
        ไม่พบข้อมูลบริการ
      </div>
    );
  }

  const chipStyle = getCategoryBadgeStyle(service.category);
  const optionsList = service.serviceOptions || [];

  return (
    <div className="flex min-w-0 flex-1 flex-col w-full">
      {/* ==================== 1. Header Bar ==================== */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center text-gray-500 transition-colors hover:text-gray-800"
          >
            <ChevronLeftIcon className="text-3xl" />
          </button>
          <div>
            <p className="text-xs text-gray-400">บริการ</p>
            <h1 className="text-xl font-bold text-gray-900">
              {service.name}
            </h1>
          </div>
        </div>

        <div>
          <Link href={`/admin/services/${service.id}/edit`}>
            <button
              type="button"
              className="rounded-lg bg-[#3366FF] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
            >
              แก้ไข
            </button>
          </Link>
        </div>
      </header>

      {/* ==================== 2. Main Content ==================== */}
      <main className="m-8 space-y-6">
        {/* Detail Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
          {/* ชื่อบริการ */}
          <div className="flex items-center">
            <span className="w-36 text-sm font-medium text-gray-700">ชื่อบริการ</span>
            <span className="text-sm font-semibold text-gray-900">{service.name}</span>
          </div>

          <hr className="border-gray-100" />

          {/* หมวดหมู่ */}
          <div className="flex items-center">
            <span className="w-36 text-sm font-medium text-gray-700">หมวดหมู่</span>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${chipStyle}`}>
              {service.category}
            </span>
          </div>

          <hr className="border-gray-100" />

          {/* รูปภาพ */}
          <div className="flex items-start">
            <span className="w-36 pt-1 text-sm font-medium text-gray-700">รูปภาพ</span>
            <div className="flex-1 max-w-lg">
              {service.imageUrl ? (
                <div className="relative h-48 w-full overflow-hidden rounded-xl border border-gray-200">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    sizes="440px"
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-36 w-full items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-400">
                  ไม่มีรูปภาพ
                </div>
              )}
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* วันที่สร้าง */}
          <div className="flex items-center">
            <span className="w-36 text-sm font-medium text-gray-700">สร้างเมื่อ</span>
            <span className="text-sm text-gray-500">{service.createdAt}</span>
          </div>

          <hr className="border-gray-100" />

          {/* วันที่แก้ไข */}
          <div className="flex items-center">
            <span className="w-36 text-sm font-medium text-gray-700">แก้ไขล่าสุด</span>
            <span className="text-sm text-gray-500">{service.updatedAt}</span>
          </div>
        </div>

        {/* Service Options Table Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-800">รายการบริการย่อย</h2>
          {optionsList.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="border-b border-gray-200 bg-[#EFEFEF] text-gray-500">
                  <tr>
                    <th className="px-6 py-3.5 font-normal text-xs text-gray-500">ชื่อรายการ</th>
                    <th className="px-6 py-3.5 font-normal text-xs text-gray-500">หน่วยบริการ</th>
                    <th className="px-6 py-3.5 font-normal text-xs text-gray-500 text-right">ค่าบริการ / 1 หน่วย</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {optionsList.map((sub, idx) => (
                    <tr key={sub.id || sub.option_id || idx} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {sub.name || sub.option_name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{sub.unit}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                        {Number(sub.price).toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-400">ไม่มีรายการบริการย่อย</p>
          )}
        </div>
      </main>
    </div>
  );
}
