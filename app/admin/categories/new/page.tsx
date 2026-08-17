'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/adminSidebar';
import { createCategory } from '@/src/lib/categoryApi';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await createCategory(categoryName.trim());
      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      console.error('Failed to create category:', error);
      setErrorMessage('ไม่สามารถสร้างหมวดหมู่ได้');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F3F4F6] text-gray-700">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col w-full">
      {/* ==================== 1. Header Bar ==================== */}
      <header className="border-b border-gray-200 bg-white px-10 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">เพิ่มหมวดหมู่</h1>

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
              form="create-category-form"
              disabled={isSubmitting || !categoryName.trim()}
              className="rounded-lg bg-[#3366FF] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isSubmitting ? 'กำลังสร้าง...' : 'สร้าง'}
            </button>
          </div>
        </div>
      </header>

      {/* ==================== 2. Main Form Content ==================== */}
      <main className="p-10">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <form id="create-category-form" onSubmit={handleSubmit}>
            <div className="flex items-center">
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
                placeholder=""
                required
                className="w-80 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            {errorMessage && (
              <p className="mt-4 text-sm text-red-500">{errorMessage}</p>
            )}
          </form>
        </div>
      </main>
      </div>
    </div>
  );
}