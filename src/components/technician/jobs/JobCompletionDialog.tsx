"use client";

import { useState, type ChangeEvent } from "react";
import { ImagePlus, LoaderCircle, Trash2, X } from "lucide-react";
import type { TechnicianJobCompletionImage } from "@/types/technician";

interface SelectedImage {
  file: File;
  previewUrl: string;
}

interface JobCompletionDialogProps {
  open: boolean;
  phase: "idle" | "uploading" | "completing";
  error: string | null;
  existingImageCount: number;
  existingImages: TechnicianJobCompletionImage[];
  onClose: () => void;
  onSubmit: (images: File[]) => Promise<void>;
}

const MIN_IMAGE_COUNT = 3;
const MAX_IMAGE_COUNT = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export function JobCompletionDialog({
  open,
  phase,
  error,
  existingImageCount,
  existingImages,
  onClose,
  onSubmit,
}: JobCompletionDialogProps) {
  const [images, setImages] = useState<Array<SelectedImage | null>>(
    Array(MAX_IMAGE_COUNT).fill(null),
  );
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const loading = phase !== "idle";
  const hasUploadedEvidence = existingImageCount >= MIN_IMAGE_COUNT;
  const selectedImageCount = images.filter((image) => image !== null).length;
  const hasRequiredImages =
    hasUploadedEvidence ||
    (selectedImageCount >= MIN_IMAGE_COUNT &&
      selectedImageCount <= MAX_IMAGE_COUNT);

  const handleImageChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const isDuplicate = images.some(
      (image, imageIndex) =>
        imageIndex !== index &&
        image?.file.name === file.name &&
        image.file.size === file.size &&
        image.file.lastModified === file.lastModified,
    );
    if (isDuplicate) {
      setSelectionError("ไม่สามารถเลือกรูปภาพซ้ำกันได้");
      return;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setSelectionError("รองรับเฉพาะไฟล์ JPG, PNG, GIF และ WEBP");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setSelectionError("รูปภาพแต่ละรูปต้องมีขนาดไม่เกิน 5 MB");
      return;
    }
    setSelectionError(null);

    const reader = new FileReader();
    reader.onload = () => {
      setImages((current) => {
        const next = [...current];
        next[index] = { file, previewUrl: String(reader.result) };
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index: number) => {
    setImages((current) => {
      const next = [...current];
      next[index] = null;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (hasUploadedEvidence) {
      setSelectionError(null);
      await onSubmit([]);
      return;
    }

    const selectedImages = images.filter(
      (image): image is SelectedImage => image !== null,
    );
    if (
      selectedImages.length < MIN_IMAGE_COUNT ||
      selectedImages.length > MAX_IMAGE_COUNT
    ) {
      setSelectionError("กรุณาเลือกรูป 3–5 รูป");
      return;
    }
    await onSubmit(selectedImages.map((image) => image.file));
  };

  if (!open) return null;

  return (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-completion-title"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-4 shadow-xl sm:p-6 md:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="ปิด"
          className="absolute right-4 top-4 cursor-pointer text-gray-400 hover:text-gray-700 disabled:cursor-not-allowed"
        >
          <X size={20} />
        </button>

        <h2 id="job-completion-title" className="pr-8 text-lg font-semibold">
          ส่งมอบงาน
        </h2>
        {hasUploadedEvidence ? (
          <>
            <p className="mt-1 text-sm text-green-700">
              อัปโหลดรูปหลักฐานแล้ว {existingImageCount} รูป
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {existingImages
                .filter(
                  (image): image is TechnicianJobCompletionImage & {
                    signedUrl: string;
                  } => Boolean(image.signedUrl),
                )
                .map((image, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={image.imageId}
                    src={image.signedUrl}
                    alt={`รูปหลักฐานที่อัปโหลด ${index + 1}`}
                    className="aspect-square size-full rounded-lg border border-gray-200 object-cover sm:aspect-4/3"
                  />
                ))}
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-gray-500">
              กรุณาอัปโหลดรูปภาพหลักฐานการทำงาน 3–5 รูป
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-square overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 sm:aspect-4/3"
                >
                  {image ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.previewUrl}
                        alt={`รูปหลักฐาน ${index + 1}`}
                        className="size-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        disabled={loading}
                        aria-label={`ลบรูปหลักฐาน ${index + 1}`}
                        className="absolute right-1.5 top-1.5 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-white/90 text-red-600 shadow hover:bg-white disabled:cursor-not-allowed sm:right-2 sm:top-2 sm:size-8"
                      >
                        <Trash2 size={14} className="sm:size-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex size-full cursor-pointer flex-col items-center justify-center p-2 text-center text-xs text-gray-500 hover:bg-blue-50 hover:text-blue-600 sm:text-sm">
                      <ImagePlus size={20} className="sm:size-6" />
                      <span className="mt-1 font-medium">เพิ่มรูปที่ {index + 1}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        disabled={loading}
                        onChange={(event) => handleImageChange(index, event)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!hasUploadedEvidence && !hasRequiredImages && (
          <p className="mt-3 text-xs text-amber-700 sm:text-sm">
            ต้องเลือกรูปภาพอย่างน้อย 3 รูปก่อนดำเนินการเสร็จสิ้น
          </p>
        )}
        {(selectionError || error) && (
          <p role="alert" className="mt-3 text-xs text-red-600 sm:text-sm">
            {selectionError || error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-2.5"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasRequiredImages || loading}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-5 sm:py-2.5"
          >
            {loading && <LoaderCircle className="animate-spin" size={16} />}
            {phase === "uploading"
              ? "กำลังอัปโหลด..."
              : phase === "completing"
                ? "กำลังส่งมอบ..."
                : "ดำเนินการเสร็จสิ้น"}
          </button>
        </div>
      </div>
    </div>
  );
}
