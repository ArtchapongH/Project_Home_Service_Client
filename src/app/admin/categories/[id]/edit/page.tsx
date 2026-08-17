'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import AlertConfirmation from '@/components/admin/AlertConfirmation';
import { Category } from '@/types/category';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  deleteCategory,
  getCategory,
  updateCategory,
} from '@/lib/categoryApi';

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const router = useRouter();
  // ใช้ React.use() สำหรับ unwrapping params ใน Next.js 15
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  const [categoryName, setCategoryName] = useState('');
  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // State สำหรับ Modal ยืนยันการลบ
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await getCategory(categoryId, controller.signal);
        setCategoryData(data);
        setCategoryName(data.name);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to fetch category:', error);
        setErrorMessage('ไม่สามารถโหลดข้อมูลหมวดหมู่ได้');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (categoryId) {
      fetchCategory();
    }

    return () => controller.abort();
  }, [categoryId]);

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await updateCategory(categoryId, categoryName.trim());
      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Failed to update category:', error);
      setErrorMessage('ไม่สามารถแก้ไขหมวดหมู่ได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage('');
      await deleteCategory(categoryId);
      setIsDeleteModalOpen(false);
      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete category:', error);
      setErrorMessage('ไม่สามารถลบหมวดหมู่ได้');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-red-500">
        {errorMessage || 'ไม่พบข้อมูลหมวดหมู่'}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6] text-gray-700">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col w-full">

      {/* ==================== 1. Header Bar ==================== */}
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center text-gray-500 transition-colors hover:text-gray-800"
            >
              <ChevronLeftIcon className="text-3xl" />
            </button>
            <div>
              <p className="text-xs text-gray-400">หมวดหมู่</p>
              <h1 className="text-xl font-bold text-gray-800">
                {categoryData?.name || 'แก้ไขหมวดหมู่'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-[#3366FF] px-6 py-2 text-sm font-medium text-[#3366FF] transition-colors hover:bg-blue-50 disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              form="edit-category-form"
              disabled={isSubmitting || !categoryName.trim()}
              className="rounded-lg bg-[#3366FF] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? 'กำลังบันทึก...' : 'ยืนยัน'}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. Main Form Content ==================== */}
      <main className="flex-1 p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <form id="edit-category-form" onSubmit={handleSubmit}>
            {/* Field: ชื่อหมวดหมู่ */}
            <div className="flex items-center py-2">
              <label
                htmlFor="categoryName"
                className="w-36 text-sm font-medium text-gray-700"
              >
                ชื่อหมวดหมู่<span className="ml-0.5 text-red-500">*</span>
              </label>
              
              <input
                id="categoryName"
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                className="w-96 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errorMessage && (
              <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
            )}

            <hr className="my-6 border-gray-100" />

            {/* Meta Information: สร้างเมื่อ & แก้ไขล่าสุด */}
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-36 font-medium text-gray-700">สร้างเมื่อ</span>
                <span>{categoryData?.createdAt}</span>
              </div>
              <div className="flex items-center">
                <span className="w-36 font-medium text-gray-700">แก้ไขล่าสุด</span>
                <span>{categoryData?.updatedAt}</span>
              </div>
            </div>
          </form>
        </div>

        {/* ปุ่มลบหมวดหมู่ ด้านล่างขวา */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-400 transition-colors hover:text-red-500"
          >
            <DeleteOutlineIcon fontSize="small" />
            <span className="underline">ลบหมวดหมู่</span>
          </button>
        </div>
      </main>

      {/* Modal ยืนยันการลบ */}
      <AlertConfirmation
        isOpen={isDeleteModalOpen}
        itemName={categoryData?.name || ''}
        loading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
      />
    </div>
    </div>
  );
}