'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Promotion } from '@/types/promotion';
import { getPromotion } from '@/lib/promotionApi';

interface PromotionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PromotionDetailPage({ params }: PromotionDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const promotionId = resolvedParams.id;

  const [promotionData, setPromotionData] = useState<Promotion | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchPromotion = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await getPromotion(promotionId, controller.signal);
        setPromotionData(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to fetch promotion details:', error);
        setErrorMessage('ไม่สามารถโหลดรายละเอียด Promotion Code ได้');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (promotionId) {
      fetchPromotion();
    }

    return () => controller.abort();
  }, [promotionId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-gray-500">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  if (errorMessage || !promotionData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-red-500">
        {errorMessage || 'ไม่พบข้อมูล Promotion Code'}
      </div>
    );
  }

  const formatDiscountDisplay = (item: Promotion) => {
    if (item.type === 'Percent') {
      return `-${Number(item.discount).toFixed(2)}%`;
    }
    return `-${Number(item.discount).toFixed(2)}฿`;
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F3F4F6]">
      {/* 1. Header Bar */}
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
            <p className="text-xs text-gray-400">Promotion Code</p>
            <h1 className="text-xl font-bold text-gray-900">
              {promotionData.code}
            </h1>
          </div>
        </div>

        <div>
          <Link href={`/admin/promotions/${promotionId}/edit`}>
            <button
              type="button"
              className="rounded-lg bg-[#3366FF] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 active:bg-blue-700"
            >
              แก้ไข
            </button>
          </Link>
        </div>
      </header>

      {/* 2. Main Content */}
      <main className="m-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="space-y-6 text-sm">
            {/* Promotion Code */}
            <div className="flex items-center">
              <span className="w-48 font-medium text-gray-700">Promotion Code</span>
              <span className="font-semibold text-gray-900">{promotionData.code}</span>
            </div>

            {/* ประเภท */}
            <div className="flex items-center">
              <span className="w-48 font-medium text-gray-700">ประเภท</span>
              <span className="text-gray-900">{promotionData.type}</span>
            </div>

            {/* ราคาที่ลด */}
            <div className="flex items-center">
              <span className="w-48 font-medium text-gray-700">ราคาที่ลด</span>
              <span className="font-semibold text-red-500">
                {formatDiscountDisplay(promotionData)}
              </span>
            </div>

            {/* โควต้าการใช้ */}
            <div className="flex items-center">
              <span className="w-48 font-medium text-gray-700">โควต้าการใช้</span>
              <span className="text-gray-900">
                {promotionData.quotaUsed}/{promotionData.quota} ครั้ง
              </span>
            </div>

            {/* วันหมดอายุ */}
            <div className="flex items-center">
              <span className="w-48 font-medium text-gray-700">วันหมดอายุ</span>
              <span className="text-gray-900">{promotionData.expire}</span>
            </div>

            <hr className="border-gray-100" />

            {/* สร้างเมื่อ */}
            <div className="flex items-center">
              <span className="w-48 font-medium text-gray-700">สร้างเมื่อ</span>
              <span className="text-gray-500">{promotionData.createdAt}</span>
            </div>

            {/* แก้ไขล่าสุด */}
            <div className="flex items-center">
              <span className="w-48 font-medium text-gray-700">แก้ไขล่าสุด</span>
              <span className="text-gray-500">{promotionData.updatedAt}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
