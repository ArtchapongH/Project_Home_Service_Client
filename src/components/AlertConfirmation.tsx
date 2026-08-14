'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  itemName?: string;
  loading?: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export default function AlertConfirmation({
  isOpen,
  itemName = 'รายการนี้',
  loading = false,
  onClose,
  onDelete,
}: DeleteConfirmationModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close modal"
          disabled={loading}
          className="absolute top-4 right-4 text-gray-400 transition-colors hover:text-gray-600 disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="mb-3 flex justify-center">
          <div className="rounded-full text-red-600">
            <AlertCircle size={56} className="fill-red-600 text-white" />
          </div>
        </div>

        <h2 className="mb-2 text-xl font-bold text-gray-900">ยืนยันการลบรายการ?</h2>

        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          คุณต้องการลบรายการ &lsquo;{itemName}&rsquo; <br />
          ใช่หรือไม่
        </p>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="min-w-[110px] rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50"
          >
            {loading ? 'กำลังลบ...' : 'ลบรายการ'}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="min-w-[110px] rounded-lg border border-blue-600 px-5 py-2 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-50 active:bg-blue-100 disabled:opacity-50"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
