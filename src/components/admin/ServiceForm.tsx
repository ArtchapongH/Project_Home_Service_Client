"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import AlertConfirmation from "@/components/admin/AlertConfirmation";
import DragVerticalIcon from "@/components/admin/DragVerticalIcon";
import {
  ServiceItem,
  CreateServiceInput,
  UpdateServiceInput,
  DEFAULT_CATEGORIES,
} from "../../types/service";
import { getCategories } from "../../lib/categoryApi";
import { uploadServiceImage } from "../../services/serviceApi";

interface ServiceFormProps {
  initialData?: ServiceItem;
  mode: "create" | "edit";
  onSubmit: (data: CreateServiceInput | UpdateServiceInput) => Promise<void>;
  onDeleteService?: (id: string) => Promise<void>;
}

interface ServiceOptionRow {
  id?: string;
  name: string;
  price: number | string;
  unit: string;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialData,
  mode,
  onSubmit,
  onDeleteService,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoriesList, setCategoriesList] = useState<{ id: number; name: string }[]>(
    DEFAULT_CATEGORIES.map((c) => ({ id: c.category_id, name: c.name }))
  );
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [name, setName] = useState<string>(initialData?.name || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>(
    initialData?.categoryId || initialData?.category_id || DEFAULT_CATEGORIES[0].category_id
  );
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const [serviceOptions, setServiceOptions] = useState<ServiceOptionRow[]>(
    initialData?.serviceOptions?.length
      ? initialData.serviceOptions.map((sub) => ({
          id: String(sub.id || sub.option_id || ""),
          name: sub.name || sub.option_name || "",
          price: sub.price,
          unit: sub.unit,
        }))
      : [
          { name: "", price: "", unit: "เครื่อง" },
          { name: "", price: "", unit: "เครื่อง" },
        ]
  );

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadCats() {
      setLoadingCategories(true);
      try {
        const cats = await getCategories();
        if (isMounted && cats && cats.length > 0) {
          setCategoriesList(cats.map((c) => ({ id: c.id, name: c.name })));
          if (!initialData) {
            setSelectedCategoryId(cats[0].id);
          } else {
            const match = cats.find(
              (c) =>
                c.id === (initialData.categoryId || initialData.category_id) ||
                c.name === initialData.category
            );
            if (match) {
              setSelectedCategoryId(match.id);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch categories from API, using defaults:", err);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    }
    loadCats();
    return () => {
      isMounted = false;
    };
  }, [initialData]);

  const handleImageFileChange = async (file: File) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: "ขนาดไฟล์ต้องไม่เกิน 5MB" }));
      return;
    }
    setIsUploadingImage(true);
    setErrors((prev) => ({ ...prev, imageUrl: "" }));
    try {
      const uploadedUrl = await uploadServiceImage(file);
      setImageUrl(uploadedUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
      setErrors((prev) => ({ ...prev, imageUrl: "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ" }));
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddOption = () => {
    setServiceOptions((prev) => [...prev, { name: "", price: "", unit: "เครื่อง" }]);
  };

  const handleRemoveOption = (index: number) => {
    if (serviceOptions.length <= 1) return;
    setServiceOptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index: number, field: keyof ServiceOptionRow, value: string | number) => {
    setServiceOptions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "กรุณากรอกชื่อบริการ";
    if (!selectedCategoryId) newErrors.category = "กรุณาเลือกหมวดหมู่";
    if (!imageUrl) newErrors.imageUrl = "กรุณาอัปโหลดรูปภาพบริการ";
    let optionError = false;
    serviceOptions.forEach((sub) => {
      if (!sub.name.trim() || sub.price === "" || !sub.unit.trim()) optionError = true;
    });
    if (optionError) newErrors.serviceOptions = "กรุณากรอกข้อมูลรายการบริการย่อยให้ครบถ้วน";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const selectedCategoryObj = categoriesList.find(
        (c) => String(c.id) === String(selectedCategoryId)
      );
      const categoryName = selectedCategoryObj?.name || "บริการทั่วไป";
      const categoryIdNum = Number(selectedCategoryId) || undefined;

      const formattedOptions = serviceOptions.map((s) => ({
        id: s.id,
        option_id: s.id,
        name: s.name.trim(),
        price: Number(s.price) || 0,
        unit: s.unit.trim(),
      }));

      await onSubmit({
        name: name.trim(),
        category: categoryName,
        category_id: categoryIdNum,
        imageUrl,
        serviceOptions: formattedOptions,
      });
    } catch (err: unknown) {
      console.error("Form submit error:", err);
      const errMsg =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "เกิดข้อผิดพลาดในการบันทึกข้อมูล";
      setErrors((prev) => ({ ...prev, submit: errMsg }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col w-full">
      {/* ==================== 1. Header Bar ==================== */}
      <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-10">
        <div className="flex items-center gap-3">
          {mode === "edit" && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center text-gray-500 transition-colors hover:text-gray-800"
            >
              <ChevronLeftIcon className="text-3xl" />
            </button>
          )}
          <div>
            {mode === "edit" && <p className="text-xs text-gray-400">บริการ</p>}
            <h1 className="text-xl font-bold text-gray-900">
              {mode === "create" ? "เพิ่มบริการ" : initialData?.name || "แก้ไขบริการ"}
            </h1>
          </div>
        </div>

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
            form="service-form"
            disabled={isSubmitting || isUploadingImage}
            className="rounded-lg bg-[#3366FF] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? "กำลังบันทึก..." : mode === "create" ? "สร้าง" : "ยืนยัน"}
          </button>
        </div>
      </header>

      {/* ==================== 2. Main Form Content ==================== */}
      <main className="m-8 space-y-6">
        {errors.submit && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {errors.submit}
          </div>
        )}

        <form id="service-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Card 1 & 2: ข้อมูลทั่วไปและรูปภาพ */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-6">
            {/* ชื่อบริการ */}
            <div className="flex items-center">
              <label htmlFor="serviceName" className="w-36 text-sm font-medium text-gray-700">
                ชื่อบริการ<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="flex-1 max-w-lg">
                <input
                  id="serviceName"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="เช่น ล้างแอร์, ทำความสะอาดทั่วไป"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* หมวดหมู่ */}
            <div className="flex items-center">
              <label htmlFor="categorySelect" className="w-36 text-sm font-medium text-gray-700">
                หมวดหมู่<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="flex-1 max-w-lg">
                <select
                  id="categorySelect"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(Number(e.target.value) || e.target.value)}
                  disabled={loadingCategories}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category}</p>}
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* รูปภาพ */}
            <div className="flex items-start">
              <label className="w-36 pt-2 text-sm font-medium text-gray-700">
                รูปภาพ<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="flex-1 max-w-lg">
                {isUploadingImage ? (
                  <div className="flex h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed border-blue-500 bg-blue-50/50">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-2" />
                    <p className="text-xs text-gray-500">กำลังอัปโหลดรูปภาพ...</p>
                  </div>
                ) : imageUrl ? (
                  <div>
                    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-gray-200 mb-2">
                      <Image src={imageUrl} alt="preview" fill sizes="440px" unoptimized className="object-cover" />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">ขนาดภาพที่แนะนำ: 1440 x 225 PX</p>
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="text-xs font-medium text-blue-600 underline hover:text-blue-700"
                      >
                        ลบรูปภาพ
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingImage(true);
                      }}
                      onDragLeave={() => setIsDraggingImage(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingImage(false);
                        if (e.dataTransfer.files?.[0]) handleImageFileChange(e.dataTransfer.files[0]);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                        isDraggingImage
                          ? "border-blue-500 bg-blue-50/50"
                          : errors.imageUrl
                          ? "border-red-400 bg-red-50/30"
                          : "border-gray-300 bg-gray-50/50 hover:bg-gray-100/50"
                      }`}
                    >
                      <CloudUploadOutlinedIcon className="text-4xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-blue-600">อัปโหลดรูปภาพ</span> หรือ ลากและวางที่นี่
                      </p>
                      <p className="mt-1 text-xs text-gray-400">PNG, JPG ขนาดไม่เกิน 5MB</p>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">ขนาดภาพที่แนะนำ: 1440 x 225 PX</p>
                    {errors.imageUrl && <p className="mt-1 text-xs text-red-500">{errors.imageUrl}</p>}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleImageFileChange(e.target.files[0]);
                  }}
                />
              </div>
            </div>

            {/* Timestamps in Edit Mode */}
            {mode === "edit" && initialData && (
              <>
                <hr className="border-gray-100" />
                <div className="flex items-center">
                  <span className="w-36 text-sm font-medium text-gray-700">สร้างเมื่อ</span>
                  <span className="text-sm text-gray-900">{initialData.createdAt}</span>
                </div>
                <hr className="border-gray-100" />
                <div className="flex items-center">
                  <span className="w-36 text-sm font-medium text-gray-700">แก้ไขล่าสุด</span>
                  <span className="text-sm text-gray-900">{initialData.updatedAt}</span>
                </div>
              </>
            )}
          </div>

          {/* Card 3: รายการบริการย่อย */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-800">รายการบริการย่อย</h2>
            {errors.serviceOptions && (
              <p className="text-xs text-red-500">{errors.serviceOptions}</p>
            )}

            {/* Column Headers */}
            <div className="flex items-center gap-3 text-xs font-semibold text-gray-500">
              <span className="w-5" />
              <span className="flex-1">ชื่อรายการ<span className="text-red-500">*</span></span>
              <span className="w-44">หน่วยบริการ<span className="text-red-500">*</span></span>
              <span className="w-48">ค่าบริการ / 1 หน่วย<span className="text-red-500">*</span></span>
              <span className="w-20 text-center">Action</span>
            </div>

            <div className="space-y-3">
              {serviceOptions.map((sub, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex w-5 items-center justify-center text-[#C8CCDB]">
                    <DragVerticalIcon className="text-[#C8CCDB]" />
                  </div>
                  <input
                    type="text"
                    placeholder="เช่น 9,000 - 18,000 BTU, แบบติดผนัง"
                    value={sub.name}
                    onChange={(e) => handleOptionChange(index, "name", e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="เช่น เครื่อง, จุด"
                    value={sub.unit}
                    onChange={(e) => handleOptionChange(index, "unit", e.target.value)}
                    className="w-44 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="relative w-48">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={sub.price}
                      onChange={(e) => handleOptionChange(index, "price", e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white py-2 pr-8 pl-3.5 text-sm text-gray-800 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
                      ฿
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    disabled={serviceOptions.length <= 1}
                    className="w-20 text-center text-sm font-medium text-blue-600 underline transition-colors hover:text-blue-700 disabled:opacity-40 disabled:no-underline"
                  >
                    ลบรายการ
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center gap-1.5 rounded-lg border border-[#3366FF] px-5 py-2 text-sm font-medium text-[#3366FF] transition-colors hover:bg-blue-50"
              >
                <span>เพิ่มรายการ</span>
                <AddIcon fontSize="small" />
              </button>
            </div>
          </div>

          {/* Delete service button in Edit mode */}
          {mode === "edit" && initialData && onDeleteService && (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-1.5 text-sm text-gray-500 underline transition-colors hover:text-red-600"
              >
                <Image src="/delete.svg" alt="ลบ" width={18} height={18} />
                <span>ลบบริการ</span>
              </button>
            </div>
          )}
        </form>
      </main>

      <AlertConfirmation
        isOpen={showDeleteModal}
        itemName={initialData?.name || "บริการนี้"}
        loading={isDeleting}
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          if (initialData && onDeleteService) {
            setIsDeleting(true);
            try {
              await onDeleteService(String(initialData.id));
            } finally {
              setIsDeleting(false);
              setShowDeleteModal(false);
            }
          }
        }}
      />
    </div>
  );
};
