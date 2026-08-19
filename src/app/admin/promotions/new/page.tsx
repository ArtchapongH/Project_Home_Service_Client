'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PromotionType } from '@/types/promotion';
import { createPromotion } from '@/lib/promotionApi';

export default function NewPromotionPage() {
  const router = useRouter();

  const [promotionCode, setPromotionCode] = useState('');
  const [type, setType] = useState<PromotionType>('Fixed');
  const [fixedDiscount, setFixedDiscount] = useState('');
  const [percentDiscount, setPercentDiscount] = useState('');
  const [quota, setQuota] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [expireTime, setExpireTime] = useState('23:59');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCancel = () => {
    router.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const code = promotionCode.trim().toUpperCase();
    if (!code) {
      setErrorMessage('กรุณาระบุ Promotion Code');
      return;
    }

    const discountValue = type === 'Fixed' ? parseFloat(fixedDiscount) : parseFloat(percentDiscount);
    if (isNaN(discountValue) || discountValue <= 0) {
      setErrorMessage('กรุณาระบุราคาหรือเปอร์เซ็นต์ส่วนลดที่ถูกต้อง');
      return;
    }

    if (type === 'Percent' && discountValue > 100) {
      setErrorMessage('เปอร์เซ็นต์ส่วนลดต้องไม่เกิน 100%');
      return;
    }

    const quotaValue = parseInt(quota, 10);
    if (isNaN(quotaValue) || quotaValue < 1) {
      setErrorMessage('กรุณาระบุโควต้าการใช้ตั้งแต่ 1 ครั้งขึ้นไป');
      return;
    }

    if (!expireDate) {
      setErrorMessage('กรุณาเลือกวันหมดอายุ');
      return;
    }

    // Combine date and time to ISO string
    const timeStr = expireTime || '23:59';
    const combinedDate = new Date(`${expireDate}T${timeStr}:00`);
    if (isNaN(combinedDate.getTime())) {
      setErrorMessage('รูปแบบวันและเวลาหมดอายุไม่ถูกต้อง');
      return;
    }

    try {
      setIsSubmitting(true);
      await createPromotion({
        promotion_code: code,
        type,
        discount: discountValue,
        quota: quotaValue,
        expire: combinedDate.toISOString(),
      });

      router.push('/admin/promotions');
      router.refresh();
    } catch (error: unknown) {
      console.error('Failed to create promotion:', error);
      const err = error as { response?: { data?: { code?: string; message?: string } } };
      if (err?.response?.data?.code === 'PROMOTION_CODE_EXISTS') {
        setErrorMessage('Promotion Code นี้มีอยู่ในระบบแล้ว');
      } else if (err?.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage('เกิดข้อผิดพลาดในการสร้าง Promotion Code');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col bg-[#F3F4F6]">
      {/* 1. Header Bar */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-10">
        <h1 className="text-xl font-bold text-gray-900">เพิ่ม Promotion Code</h1>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="rounded-lg border border-[#3366FF] px-6 py-2.5 text-sm font-medium text-[#3366FF] transition-colors hover:bg-blue-50 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            form="new-promotion-form"
            disabled={isSubmitting}
            className="rounded-lg bg-[#3366FF] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 active:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? 'กำลังสร้าง...' : 'สร้าง'}
          </button>
        </div>
      </header>

      {/* 2. Main Form */}
      <main className="m-8">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <form id="new-promotion-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Promotion Code */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:items-center">
              <label htmlFor="promotionCode" className="text-sm font-medium text-gray-700">
                Promotion Code<span className="ml-1 text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <input
                  id="promotionCode"
                  type="text"
                  required
                  placeholder="เช่น HOME0202"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value.toUpperCase())}
                  className="w-full max-w-md rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder-gray-400 uppercase transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ประเภท (Radio: Fixed vs Percent) */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:items-start">
              <label className="pt-2 text-sm font-medium text-gray-700">
                ประเภท<span className="ml-1 text-red-500">*</span>
              </label>
              <div className="space-y-4 sm:col-span-3">
                {/* Fixed option */}
                <div className="flex items-center gap-4">
                  <label className="flex w-24 cursor-pointer items-center gap-2 text-sm text-gray-800">
                    <input
                      type="radio"
                      name="promotionType"
                      value="Fixed"
                      checked={type === 'Fixed'}
                      onChange={() => setType('Fixed')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    Fixed
                  </label>
                  <div className="relative w-48">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      disabled={type !== 'Fixed'}
                      value={fixedDiscount}
                      onChange={(e) => setFixedDiscount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full rounded-lg border px-3.5 py-2 pr-8 text-sm text-gray-900 transition-colors focus:outline-none ${
                        type === 'Fixed'
                          ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    />
                    <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm ${type === 'Fixed' ? 'text-gray-500' : 'text-gray-400'}`}>
                      ฿
                    </span>
                  </div>
                </div>

                {/* Percent option */}
                <div className="flex items-center gap-4">
                  <label className="flex w-24 cursor-pointer items-center gap-2 text-sm text-gray-800">
                    <input
                      type="radio"
                      name="promotionType"
                      value="Percent"
                      checked={type === 'Percent'}
                      onChange={() => setType('Percent')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    Percent
                  </label>
                  <div className="relative w-48">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      disabled={type !== 'Percent'}
                      value={percentDiscount}
                      onChange={(e) => setPercentDiscount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full rounded-lg border px-3.5 py-2 pr-8 text-sm text-gray-900 transition-colors focus:outline-none ${
                        type === 'Percent'
                          ? 'border-gray-300 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                          : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    />
                    <span className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm ${type === 'Percent' ? 'text-gray-500' : 'text-gray-400'}`}>
                      %
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* โควต้าการใช้ */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:items-center">
              <label htmlFor="quota" className="text-sm font-medium text-gray-700">
                โควต้าการใช้<span className="ml-1 text-red-500">*</span>
              </label>
              <div className="sm:col-span-3">
                <div className="relative w-full max-w-xs">
                  <input
                    id="quota"
                    type="number"
                    min="1"
                    required
                    placeholder="เช่น 100"
                    value={quota}
                    onChange={(e) => setQuota(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 pr-12 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-gray-500">
                    ครั้ง
                  </span>
                </div>
              </div>
            </div>

            {/* วันหมดอายุ */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 sm:items-center">
              <label className="text-sm font-medium text-gray-700">
                วันหมดอายุ<span className="ml-1 text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-3 sm:col-span-3">
                <div className="relative w-48">
                  <input
                    type="date"
                    required
                    value={expireDate}
                    onChange={(e) => setExpireDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="relative w-36">
                  <input
                    type="time"
                    required
                    value={expireTime}
                    onChange={(e) => setExpireTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
