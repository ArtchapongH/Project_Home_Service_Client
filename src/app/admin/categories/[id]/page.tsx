'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Category } from '@/types/category';
import { getCategory } from '@/lib/categoryApi';

interface CategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await getCategory(categoryId, controller.signal);
        setCategoryData(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to fetch category details:', error);
        setErrorMessage('ไม่สามารถโหลดรายละเอียดหมวดหมู่ได้');
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (errorMessage || !categoryData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-red-500">
        {errorMessage || 'ไม่พบข้อมูลหมวดหมู่'}
      </div>
    );
  }

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
            <p className="text-xs text-gray-400">หมวดหมู่</p>
            <h1 className="text-xl font-bold text-gray-900">
              {categoryData?.name || 'รายละเอียดหมวดหมู่'}
            </h1>
          </div>
        </div>

        <div>
          <Link href={`/admin/categories/${categoryId}/edit`}>
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
      <main className="m-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-6 text-sm">
            {/* ชื่อหมวดหมู่ */}
            <div className="flex items-center">
              <span className="w-36 font-medium text-gray-700">ชื่อหมวดหมู่</span>
              <span className="text-gray-900 font-medium">{categoryData?.name}</span>
            </div>

            <hr className="border-gray-100" />

            {/* สร้างเมื่อ */}
            <div className="flex items-center">
              <span className="w-36 font-medium text-gray-700">สร้างเมื่อ</span>
              <span className="text-gray-500">{categoryData?.createdAt}</span>
            </div>

            <hr className="border-gray-100" />

            {/* แก้ไขล่าสุด */}
            <div className="flex items-center">
              <span className="w-36 font-medium text-gray-700">แก้ไขล่าสุด</span>
              <span className="text-gray-500">{categoryData?.updatedAt}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}