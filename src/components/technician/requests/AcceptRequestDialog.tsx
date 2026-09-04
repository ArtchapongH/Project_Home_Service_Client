"use client";

import { BriefcaseBusiness, X } from "lucide-react";

interface AcceptRequestDialogProps {
  open: boolean;
  serviceName: string;
  scheduledAt: string;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AcceptRequestDialog({
  open,
  serviceName,
  scheduledAt,
  loading,
  onClose,
  onConfirm,
}: AcceptRequestDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="accept-title"
        className="relative w-full max-w-sm rounded-xl bg-white p-7 text-center shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="ปิด"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <X size={18} />
        </button>
        <BriefcaseBusiness className="mx-auto text-blue-600" size={34} />
        <h2 id="accept-title" className="mt-4 text-lg font-semibold">
          ยืนยันการรับงาน?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {serviceName}
          <br />
          {scheduledAt}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-blue-600 px-5 py-2 text-sm text-blue-600 disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white disabled:opacity-50"
          >
            {loading ? "กำลังรับงาน..." : "ยืนยัน"}
          </button>
        </div>
      </div>
    </div>
  );
}
