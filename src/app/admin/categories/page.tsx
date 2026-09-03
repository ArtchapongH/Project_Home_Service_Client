'use client';

import React, { useEffect, useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AlertConfirmation from '@/components/admin/AlertConfirmation';
import { Category } from '@/types/category';
import Link from 'next/link';
import Image from 'next/image';
import { deleteCategory, getCategories } from '@/lib/categoryApi';
import DragVerticalIcon from '@/components/admin/DragVerticalIcon';

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [draggedCategoryId, setDraggedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await getCategories(controller.signal);
        setCategories(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to fetch categories:', error);
        setErrorMessage('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return categories;
    return categories.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [categories, searchTerm]);

  const handleOpenDeleteModal = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      setIsDeleting(true);
      setErrorMessage('');
      await deleteCategory(selectedCategory.id);
      setCategories((prev) => prev.filter((item) => item.id !== selectedCategory.id));
      setIsModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
      setErrorMessage('ไม่สามารถลบหมวดหมู่ได้');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDrop = (targetCategoryId: number) => {
    if (draggedCategoryId === null || draggedCategoryId === targetCategoryId) {
      setDraggedCategoryId(null);
      return;
    }

    setCategories((prev) => {
      const sourceIndex = prev.findIndex((item) => item.id === draggedCategoryId);
      const targetIndex = prev.findIndex((item) => item.id === targetCategoryId);

      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const reorderedCategories = [...prev];
      const [movedCategory] = reorderedCategories.splice(sourceIndex, 1);
      reorderedCategories.splice(targetIndex, 0, movedCategory);
      return reorderedCategories;
    });

    setDraggedCategoryId(null);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col w-full">
      {/* ==================== 1. Top Header Bar ==================== */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-10">
        <h1 className="text-xl font-bold text-gray-900">หมวดหมู่</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              fontSize="small"
            />
            <input
              type="text"
              placeholder="ค้นหาหมวดหมู่..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <Link href="/admin/categories/new">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-[#3366FF] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
            >
              <span>เพิ่มหมวดหมู่</span>
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
              <th className="w-28 pl-8 pr-4 py-4 text-left font-normal text-xs text-gray-500">ลำดับ</th>
              <th className="px-6 py-4 font-normal text-xs text-gray-500">ชื่อหมวดหมู่</th>
              <th className="px-6 py-4 font-normal text-xs text-gray-500">สร้างเมื่อ</th>
              <th className="px-6 py-4 font-normal text-xs text-gray-500">แก้ไขล่าสุด</th>
              <th className="w-28 px-6 py-4 text-center font-normal text-xs text-gray-500">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-red-500">
                  {errorMessage}
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  {searchTerm ? `ไม่พบคำที่ค้นหา "${searchTerm}"` : "ไม่พบข้อมูลหมวดหมู่"}
                </td>
              </tr>
            ) : (
              filteredCategories.map((row, index) => (
                <tr
                  key={row.id}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => handleDrop(row.id)}
                  className={`transition-colors hover:bg-gray-50/50 ${draggedCategoryId === row.id ? "opacity-50" : ""}`}
                >
                  <td className="w-28 pl-8 pr-4 py-5">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          setDraggedCategoryId(row.id);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/plain", String(row.id));
                        }}
                        onDragEnd={() => setDraggedCategoryId(null)}
                        className="p-1 -m-1 cursor-grab active:cursor-grabbing text-[#C8CCDB] hover:text-gray-600 active:text-[#3366FF] transition-colors"
                        title="ลากเพื่อสลับลำดับ"
                        aria-label={`สลับลำดับ ${row.name}`}
                      >
                        <DragVerticalIcon />
                      </button>
                      <span className="font-normal text-gray-800 tabular-nums">
                        {index + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-gray-900">
                    <Link href={`/admin/categories/${row.id}`} className="block hover:text-blue-600">
                      {row.name}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-gray-500">
                    <Link href={`/admin/categories/${row.id}`} className="block">
                      {row.createdAt}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-gray-500">
                    <Link href={`/admin/categories/${row.id}`} className="block">
                      {row.updatedAt}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(row)}
                        className="flex h-8 w-8 items-center justify-center text-gray-400 hover:opacity-75 transition-opacity"
                        title="ลบ"
                      >
                        <Image src="/delete.svg" alt="ลบ" width={20} height={20} className="block" />
                      </button>
                      <Link
                        href={`/admin/categories/${row.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center text-blue-600 hover:opacity-75 transition-opacity"
                        title="แก้ไข"
                      >
                        <Image src="/edit.svg" alt="แก้ไข" width={18} height={18} className="block" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>

      <AlertConfirmation
        isOpen={isModalOpen}
        itemName={selectedCategory?.name || ""}
        loading={isDeleting}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}
