"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { JobCompletionDialog } from "@/components/technician/jobs/JobCompletionDialog";
import { DirectionsLink } from "@/components/technician/shared/DirectionsLink";
import {
  completeTechnicianJob,
  getTechnicianApiError,
  getTechnicianJob,
  uploadTechnicianJobCompletionImages,
} from "@/services/technicianApi";
import type {
  TechnicianJob,
  TechnicianJobCompletionImage,
} from "@/types/technician";
import { formatBaht, formatJobItemSummary, formatThaiDateTime, getCustomerNotes } from "@/utils/technician";

export function TechnicianJobDetail({ assignmentId, history = false }: { assignmentId: string; history?: boolean }) {
  const [job, setJob] = useState<TechnicianJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionPhase, setCompletionPhase] = useState<
    "idle" | "uploading" | "completing"
  >("idle");
  const [completionError, setCompletionError] = useState<string | null>(null);
  const [completionSuccess, setCompletionSuccess] = useState<string | null>(null);
  const [completionImageCount, setCompletionImageCount] = useState(0);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    let active = true;
    void getTechnicianJob(assignmentId)
      .then((loadedJob) => {
        if (!active) return;
        setJob(loadedJob);
        setCompletionImageCount(loadedJob.completionImages?.length ?? 0);
      })
      .catch((requestError) => {
        if (active) {
          setError(getTechnicianApiError(requestError).message);
        }
      });

    return () => {
      active = false;
    };
  }, [assignmentId]);

  const backHref = history ? "/technician/history" : "/technician/jobs";
  const canComplete =
    !history &&
    (job?.assignmentStatus === "ACCEPTED" ||
      job?.assignmentStatus === "IN_PROGRESS");

  const handleCompleteJob = async (images: File[]) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setCompletionError(null);

    try {
      if (completionImageCount < 3) {
        setCompletionPhase("uploading");
        const uploadResult = await uploadTechnicianJobCompletionImages(
          assignmentId,
          images,
        );
        setCompletionImageCount(uploadResult.imageCount);
        setJob((currentJob) =>
          currentJob
            ? {
                ...currentJob,
                completionImages: [
                  ...(currentJob.completionImages ?? []),
                  ...uploadResult.images,
                ],
              }
            : currentJob,
        );
      }

      setCompletionPhase("completing");
      const completedJob = await completeTechnicianJob(assignmentId);
      setJob(completedJob);
      setCompletionImageCount(completedJob.completionImages?.length ?? 0);
      setCompletionOpen(false);
      setCompletionSuccess("ดำเนินการเสร็จสิ้นและส่งมอบงานสำเร็จ");
    } catch (requestError) {
      setCompletionError(getTechnicianApiError(requestError).message);
    } finally {
      setCompletionPhase("idle");
      isSubmittingRef.current = false;
    }
  };

  if (error) return <div className="p-4 text-sm text-red-600 md:p-8">{error}</div>;
  if (!job) return <div className="p-4 text-sm text-gray-500 md:p-8">กำลังโหลดรายละเอียด...</div>;
  const itemText = formatJobItemSummary(job);
  const customerNotes = getCustomerNotes(job.notes);
  const completionImages =
    job.completionImages?.filter(
      (
        image,
      ): image is TechnicianJobCompletionImage & { signedUrl: string } =>
        Boolean(image.signedUrl),
    ) ?? [];

  return (
    <>
      <header className="flex min-h-20 items-center gap-3 border-b border-gray-200 bg-white px-4 py-3 md:h-20 md:gap-4 md:px-8 md:py-0">
       <Link href={backHref} aria-label="กลับ" className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:size-auto">
        <ArrowLeft />
       </Link>
       <div className="min-w-0">
        <p className="text-xs text-gray-500">{history ? "ประวัติการซ่อม" : "บริการที่รับ"}</p>
        <h1 className="wrap-break-word font-semibold">{job.serviceName}</h1>
       </div>
      </header>
      <section className="p-4 md:p-8">
        {completionSuccess && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {completionSuccess}
          </div>
        )}
        <div className="min-w-0 rounded-lg bg-white p-4 shadow-sm md:p-8">
          <h2 className="text-lg font-semibold">{job.serviceName}</h2>
          <dl className="mt-6 grid gap-x-8 gap-y-2 text-sm md:grid-cols-[180px_minmax(0,1fr)] md:gap-y-5">
            <dt className="text-gray-500">หมวดหมู่</dt><dd><span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">{job.categoryName}</span></dd>
            <dt className="mt-2 text-gray-500 first:mt-0 md:mt-0">รายการ</dt>
            <dd className="wrap-break-word">
              <p>{itemText}</p>
              {customerNotes ? <p className="mt-1 text-gray-700">{customerNotes}</p> : null}
            </dd>
            <dt className="text-gray-500">วันเวลานัดหมาย</dt><dd>{formatThaiDateTime(job.scheduledAt)}</dd>
            <dt className="text-gray-500">สถานที่</dt><dd className="wrap-break-word">{job.address || "ยังไม่ระบุ"}<div className="mt-1"><DirectionsLink latitude={job.serviceLatitude} longitude={job.serviceLongitude} address={job.address} /></div></dd>
            <dt className="text-gray-500">รหัสคำสั่งซื้อ</dt><dd className="break-all">{job.orderCode}</dd>
            <dt className="text-gray-500">ราคารวม</dt><dd>{formatBaht(job.totalPrice)}</dd>
            <dt className="text-gray-500">ผู้รับบริการ</dt><dd>{job.customerName || "ไม่ระบุ"}</dd>
            <dt className="text-gray-500">เบอร์ติดต่อ</dt>
            <dd className="flex flex-wrap items-start justify-between gap-3">
              <span>{job.customerPhone || "ไม่ระบุ"}</span>
              {canComplete && (
              <button
                type="button"
                onClick={() => {
                  setCompletionError(null);
                  setCompletionOpen(true);
                }}
                className="shrink-0 cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                ส่งมอบงาน
              </button>
            )}
          </dd>
          </dl>
          {history && (
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="font-semibold">หลักฐานการส่งมอบงาน</h3>
              {completionImages.length > 0 ? (
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {completionImages.map((image, index) => (
                    <a
                      key={image.imageId}
                      href={image.signedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-4/3 overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <Image
                        src={image.signedUrl}
                        alt={`รูปงานที่ส่ง ${index + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-gray-500">
                  ไม่พบรูปงานที่ส่ง
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      <JobCompletionDialog
        key={assignmentId}
        open={completionOpen}
        phase={completionPhase}
        error={completionError}
        existingImageCount={completionImageCount}
        existingImages={job.completionImages ?? []}
        onClose={() => setCompletionOpen(false)}
        onSubmit={handleCompleteJob}
      />
    </>
  );
}
