'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Category } from '@/types/category';

interface CategoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const router = useRouter();
  // ใช้ React.use() สำหรับ unwrapping params ใน Next.js 15
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  const [categoryData, setCategoryData] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        // TODO: เปลี่ยนเป็นเรียก API จริง เช่น:
        // const res = await axios.get(`/api/categories/${categoryId}`);
        // setCategoryData(res.data);

        // Mockup ข้อมูลตัวอย่างตามภาพ
        const mockData: Category = {
          id: Number(categoryId),
          name: 'บริการห้องครัว',
          createdAt: '12/02/2022 10:30PM',
          updatedAt: '12/02/2022 10:30PM',
        };

        setCategoryData(mockData);
      } catch (error) {
        console.error('Failed to fetch category details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6] text-gray-700 w-full">
      {/* ==================== 1. Header Bar ==================== */}
      <header className="border-b border-gray-200 bg-white px-8 py-4">
        <div className="flex items-center justify-between">
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
              <h1 className="text-xl font-bold text-gray-800">
                {categoryData?.name || 'รายละเอียดหมวดหมู่'}
              </h1>
            </div>
          </div>

          <div>
            <Link href={`/admin/categories/${categoryId}/edit`}>
              <button
                type="button"
                className="rounded-lg bg-[#3366FF] px-6 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600"
              >
                แก้ไข
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ==================== 2. Main Content ==================== */}
      <main className="p-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-6 text-sm">
            {/* ชื่อหมวดหมู่ */}
            <div className="flex items-center">
              <span className="w-36 font-medium text-gray-700">ชื่อหมวดหมู่</span>
              <span className="text-gray-900">{categoryData?.name}</span>
            </div>

            <hr className="border-gray-100" />

            {/* สร้างเมื่อ */}
            <div className="flex items-center">
              <span className="w-36 font-medium text-gray-700">สร้างเมื่อ</span>
              <span className="text-gray-900">{categoryData?.createdAt}</span>
            </div>

            {/* แก้ไขล่าสุด */}
            <div className="flex items-center">
              <span className="w-36 font-medium text-gray-700">แก้ไขล่าสุด</span>
              <span className="text-gray-900">{categoryData?.updatedAt}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}