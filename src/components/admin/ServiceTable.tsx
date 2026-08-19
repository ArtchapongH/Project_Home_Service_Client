"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AlertConfirmation from "@/components/admin/AlertConfirmation";
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

export const ServiceTable: React.FC = () => {
  const {
    services,
    isLoading,
    searchQuery,
    setSearchQuery,
    removeService,
    reorderServicesList,
  } = useServiceContext();

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [draggedServiceId, setDraggedServiceId] = useState<string | number | null>(null);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await removeService(deleteTargetId);
      setDeleteTargetId(null);
      setDeleteTargetName("");
    } catch (err) {
      console.error("Failed to delete service:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDrop = (targetServiceId: string | number) => {
    if (draggedServiceId === null || draggedServiceId === targetServiceId) {
      setDraggedServiceId(null);
      return;
    }

    const sourceIndex = services.findIndex((item) => item.id === draggedServiceId);
    const targetIndex = services.findIndex((item) => item.id === targetServiceId);

    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedServiceId(null);
      return;
    }

    const reordered = [...services];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    reorderServicesList(reordered);
    setDraggedServiceId(null);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col w-full">
      {/* ==================== 1. Top Header Bar ==================== */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-10">
        <h1 className="text-xl font-bold text-gray-900">บริการ</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              fontSize="small"
            />
            <input
              type="text"
              placeholder="ค้นหาบริการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Link href="/admin/services/create">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-[#3366FF] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
            >
              <span>เพิ่มบริการ</span>
              <AddIcon fontSize="small" />
            </button>
          </Link>
        </div>
      </header>

      {/* ==================== 2. Main Content Table ==================== */}
      <main className="m-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="border-b border-gray-200 bg-[#EFEFEF] text-gray-500">
            <tr>
              <th className="w-32 px-6 py-4 text-center font-normal text-xs text-gray-500">ลำดับ</th>
              <th className="px-6 py-4 font-normal text-xs text-gray-500">ชื่อบริการ</th>
              <th className="px-6 py-4 font-normal text-xs text-gray-500">หมวดหมู่</th>
              <th className="px-6 py-4 font-normal text-xs text-gray-500">สร้างเมื่อ</th>
              <th className="px-6 py-4 font-normal text-xs text-gray-500">แก้ไขล่าสุด</th>
              <th className="w-28 px-6 py-4 text-center font-normal text-xs text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : services.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-400">
                  {searchQuery ? `ไม่พบคำที่ค้นหา "${searchQuery}"` : "ไม่พบข้อมูลบริการ"}
                </td>
              </tr>
            ) : (
              services.map((item: ServiceItem, index: number) => {
                const chipStyle = getCategoryBadgeStyle(item.category);
                return (
                  <tr
                    key={item.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => handleDrop(item.id)}
                    className={`transition-colors hover:bg-gray-50/50 ${draggedServiceId === item.id ? "opacity-50" : ""}`}
                  >
                    <td className="px-6 py-5">
                      <div className="relative flex items-center justify-center">
                        <button
                          type="button"
                          draggable
                          onDragStart={(event) => {
                            setDraggedServiceId(item.id);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", String(item.id));
                          }}
                          onDragEnd={() => setDraggedServiceId(null)}
                          className="absolute -left-5 top-1/2 -translate-y-1/2 cursor-grab touch-none text-gray-300 active:cursor-grabbing"
                          title="ลากเพื่อสลับลำดับ"
                          aria-label={`สลับลำดับ ${item.name}`}
                        >
                          <Image
                            src="/dragvertical.svg"
                            alt=""
                            width={24}
                            height={32}
                            draggable={false}
                            className="block"
                          />
                        </button>
                        <span className="font-normal text-gray-800">{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-900">
                      <Link
                        href={`/admin/services/${item.id}`}
                        className="block hover:text-blue-600"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${chipStyle}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      <Link href={`/admin/services/${item.id}`} className="block">
                        {item.createdAt}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-gray-500">
                      <Link href={`/admin/services/${item.id}`} className="block">
                        {item.updatedAt}
                      </Link>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteTargetId(String(item.id));
                            setDeleteTargetName(item.name);
                          }}
                          className="flex h-8 w-8 items-center justify-center text-gray-400 hover:opacity-75 transition-opacity"
                          title="ลบ"
                        >
                          <Image src="/delete.svg" alt="ลบ" width={20} height={20} className="block" />
                        </button>
                        <Link
                          href={`/admin/services/${item.id}/edit`}
                          className="flex h-8 w-8 items-center justify-center text-blue-600 hover:opacity-75 transition-opacity"
                          title="แก้ไข"
                        >
                          <Image src="/edit.svg" alt="แก้ไข" width={18} height={18} className="block" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </main>

      <AlertConfirmation
        isOpen={!!deleteTargetId}
        itemName={deleteTargetName}
        loading={isDeleting}
        onClose={() => {
          if (isDeleting) return;
          setDeleteTargetId(null);
          setDeleteTargetName("");
        }}
        onDelete={confirmDelete}
      />
    </div>
  );
};
