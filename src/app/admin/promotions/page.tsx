'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AlertConfirmation from '@/components/admin/AlertConfirmation';
import { Promotion } from '@/types/promotion';
import { deletePromotion, getPromotions } from '@/lib/promotionApi';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setErrorMessage('');
        const data = await getPromotions('', controller.signal);
        setPromotions(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Failed to fetch promotions:', error);
        setErrorMessage('ไม่สามารถโหลดข้อมูลโปรโมชั่นได้');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPromotions();

    return () => controller.abort();
  }, []);

  const filteredPromotions = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return promotions;
    return promotions.filter((item) =>
      item.code.toLowerCase().includes(keyword)
    );
  }, [promotions, searchTerm]);

  const handleOpenDeleteModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setIsModalOpen(false);
    setSelectedPromotion(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedPromotion) return;
    try {
      setIsDeleting(true);
      setErrorMessage('');
      await deletePromotion(selectedPromotion.id);
      setPromotions((prev) => prev.filter((p) => p.id !== selectedPromotion.id));
      setIsModalOpen(false);
      setSelectedPromotion(null);
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      setErrorMessage('ไม่สามารถลบโปรโมชั่นได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsDeleting(false);
    }
  };

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
        <h1 className="text-xl font-bold text-gray-900">Promotion Code</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <SearchIcon fontSize="small" />
            </span>
            <input
              type="text"
              placeholder="ค้นหา Promotion Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-72 rounded-lg border border-gray-300 bg-white pl-9 pr-4 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <Link
            href="/admin/promotions/new"
            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#3366FF] px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 active:bg-blue-700"
          >
            เพิ่ม Promotion Code
            <AddIcon fontSize="small" />
          </Link>
        </div>
      </header>

      {/* 2. Main Table Area */}
      <main className="m-8 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-[#EFEFF2] text-xs font-medium text-gray-500">
              <th className="px-6 py-4 font-normal">Promotion Code</th>
              <th className="px-6 py-4 font-normal">ประเภท</th>
              <th className="px-6 py-4 font-normal">โควต้าการใช้(ครั้ง)</th>
              <th className="px-6 py-4 font-normal">ราคาที่ลด</th>
              <th className="px-6 py-4 font-normal">สร้างเมื่อ</th>
              <th className="px-6 py-4 font-normal">วันหมดอายุ</th>
              <th className="px-6 py-4 text-center font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  กำลังโหลดข้อมูล...
                </td>
              </tr>
            ) : errorMessage ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-red-500">
                  {errorMessage}
                </td>
              </tr>
            ) : filteredPromotions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  {searchTerm
                    ? `ไม่พบคำที่ค้นหา "${searchTerm}"`
                    : 'ยังไม่มีรายการ Promotion Code'}
                </td>
              </tr>
            ) : (
              filteredPromotions.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-gray-50/50"
                >
                  <td className="px-6 py-5 font-medium text-gray-900">
                    <Link
                      href={`/admin/promotions/${row.id}`}
                      className="block hover:text-blue-600"
                    >
                      {row.code}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-gray-700">
                    <Link
                      href={`/admin/promotions/${row.id}`}
                      className="block"
                    >
                      {row.type}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-gray-700">
                    <Link
                      href={`/admin/promotions/${row.id}`}
                      className="block"
                    >
                      {row.quotaUsed}/{row.quota}
                    </Link>
                  </td>
                  <td className="px-6 py-5 font-medium text-red-500">
                    <Link
                      href={`/admin/promotions/${row.id}`}
                      className="block"
                    >
                      {formatDiscountDisplay(row)}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-gray-500">
                    <Link
                      href={`/admin/promotions/${row.id}`}
                      className="block"
                    >
                      {row.createdAt}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-gray-500">
                    <Link
                      href={`/admin/promotions/${row.id}`}
                      className="block"
                    >
                      {row.expire}
                    </Link>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(row)}
                        className="flex h-8 w-8 items-center justify-center text-gray-400 transition-opacity hover:opacity-75"
                        title="ลบ"
                      >
                        <Image
                          src="/delete.svg"
                          alt="ลบ"
                          width={20}
                          height={20}
                          className="block"
                        />
                      </button>
                      <Link
                        href={`/admin/promotions/${row.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center text-blue-600 transition-opacity hover:opacity-75"
                        title="แก้ไข"
                      >
                        <Image
                          src="/edit.svg"
                          alt="แก้ไข"
                          width={18}
                          height={18}
                          className="block"
                        />
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
        itemName={selectedPromotion?.code || ''}
        loading={isDeleting}
        onClose={handleCloseDeleteModal}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
}
