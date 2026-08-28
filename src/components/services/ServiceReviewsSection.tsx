"use client";

import React, { useEffect, useState } from "react";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { reviewApi, ReviewItem } from "@/services/reviewApi";
import { CircularProgress } from "@mui/material";

interface ServiceReviewsSectionProps {
  serviceId: string | number;
  serviceName?: string;
}

export function ServiceReviewsSection({
  serviceId,
  serviceName,
}: ServiceReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<{ reviewCount: number; averageRating: number }>({
    reviewCount: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function loadReviewsAndStats() {
      if (!serviceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [reviewsRes, statsRes] = await Promise.allSettled([
          reviewApi.getReviewsByServiceId(serviceId, 10),
          reviewApi.getServiceStats(serviceId),
        ]);

        if (isMounted) {
          if (reviewsRes.status === "fulfilled" && reviewsRes.value?.data) {
            setReviews(reviewsRes.value.data);
          }
          if (statsRes.status === "fulfilled" && statsRes.value?.data) {
            setStats(statsRes.value.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch service reviews:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReviewsAndStats();

    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  const effectiveAvg = stats.reviewCount > 0 ? stats.averageRating : 5.0;
  const effectiveCount = stats.reviewCount > 0 ? stats.reviewCount : reviews.length;

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      {/* Section Header */}
      <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            รีวิวและความคิดเห็นจากลูกค้า
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            {serviceName ? `คะแนนรีวิวจากผู้ใช้บริการจริงสำหรับ ${serviceName}` : "คะแนนรีวิวจากผู้ใช้บริการจริง"}
          </p>
        </div>

        {/* Overall Rating Pill */}
        <div className="flex items-center gap-3 self-start rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-2.5 sm:self-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#1E293B]">
              {effectiveAvg.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400 font-medium">/ 5.0</span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center text-[#F59E0B]">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarRoundedIcon
                  key={star}
                  sx={{
                    fontSize: 18,
                    color: star <= Math.round(effectiveAvg) ? "#F59E0B" : "#CBD5E1",
                  }}
                />
              ))}
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              {effectiveCount > 0 ? `${effectiveCount} รีวิวทั้งหมด` : "ยังไม่มีรีวิว"}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-5 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <CircularProgress size={28} sx={{ color: "#3366FF" }} />
            <p className="mt-2 text-xs font-medium">กำลังโหลดรีวิว...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => {
            const formattedDate = rev.createdAt
              ? new Date(rev.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "เร็วๆ นี้";

            const displayName = rev.userName || "ผู้ใช้บริการ";
            const initial = displayName.trim().charAt(0).toUpperCase() || "U";

            return (
              <div
                key={rev.id || rev.reviewId}
                className="rounded-xl border border-gray-100 bg-[#FAFAFA] p-4 transition-all duration-200 hover:border-blue-100 hover:bg-blue-50/20"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* User Avatar Initial */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3366FF]/10 text-[#3366FF] font-bold text-sm">
                      {initial}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">
                          {displayName}
                        </span>
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
                          <VerifiedRoundedIcon sx={{ fontSize: 12, color: "#10B981" }} />
                          ผู้ใช้บริการจริง
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formattedDate}</p>
                    </div>
                  </div>

                  {/* Stars for this review */}
                  <div className="flex items-center text-[#F59E0B]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarRoundedIcon
                        key={star}
                        sx={{
                          fontSize: 16,
                          color: star <= rev.rating ? "#F59E0B" : "#E2E8F0",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                {rev.comment ? (
                  <p className="mt-3 text-xs leading-relaxed text-gray-700 sm:text-sm">
                    {rev.comment}
                  </p>
                ) : (
                  <p className="mt-2 text-xs italic text-gray-400">
                    (ไม่ได้ระบุความคิดเห็นเพิ่มเติม)
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center bg-[#FAFAFA]">
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 36, color: "#94A3B8" }} />
            <p className="mt-2 text-sm font-medium text-gray-600">
              ยังไม่มีรีวิวสำหรับบริการนี้ในขณะนี้
            </p>
            <p className="mt-1 text-xs text-gray-400">
              เมื่อคุณใช้บริการเสร็จสิ้น สามารถเขียนรีวิวเพื่อให้คะแนนได้ในหน้าประวัติคำสั่งซ่อม
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ServiceReviewsSection;
