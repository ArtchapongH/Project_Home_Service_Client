"use client";

import { useState, useEffect } from "react";
import { CustomerServicesSideNav } from "./CustomerServicesSideNav";
import { CustomerServiceCard } from "./CustomerServiceCard";
import { ReviewServiceModal } from "./ReviewServiceModal";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { customerOrderApi } from "@/services/customerOrderApi";
import { reviewApi } from "@/services/reviewApi";
import type { CustomerServiceOrder } from "@/types/customer-service";

interface CustomerServicesHistoryProps {
  initialHistory?: CustomerServiceOrder[];
}

export function CustomerServicesHistory({
  initialHistory,
}: CustomerServicesHistoryProps) {
  const [historyOrders, setHistoryOrders] = useState<CustomerServiceOrder[]>(initialHistory || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialHistory);
  const [reviewingOrder, setReviewingOrder] = useState<CustomerServiceOrder | null>(null);

  // ดึงประวัติรายการซ่อมที่เสร็จสิ้น และตรวจสอบสถานะรีวิว
  useEffect(() => {
    let isMounted = true;

    async function loadHistoryOrders() {
      try {
        const allOrders = await customerOrderApi.getUserOrders();
        if (!isMounted) return;

        // กรองเฉพาะสถานะ completed
        const completed = (allOrders || []).filter((o) => o.status === "completed");

        // ตรวจสอบสถานะการรีวิวจากฐานข้อมูลหลังบ้านสำหรับแต่ละรายการ
        const checkPromises = completed.map(async (order) => {
          const code = order.orderCode || order.id;
          try {
            const res = await reviewApi.getReviewByOrderCode(code);
            if (res.isReviewed && res.data) {
              return {
                ...order,
                isReviewed: true,
                reviewRating: res.data.rating,
                reviewComment: res.data.comment,
              };
            }
          } catch {
            // Ignore review fetch error
          }
          return order;
        });

        const withReviews = await Promise.all(checkPromises);
        if (isMounted) {
          setHistoryOrders(withReviews);
        }
      } catch (err) {
        console.error("Failed to load customer history:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHistoryOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitReview = (orderId: string, rating: number, comment: string) => {
    setHistoryOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              isReviewed: true,
              reviewRating: rating,
              reviewComment: comment,
            }
          : order
      )
    );
  };


  const handleDeleteReview = (orderId: string) => {
    setHistoryOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              isReviewed: false,
              reviewRating: undefined,
              reviewComment: undefined,
            }
          : order
      )
    );
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
        {/* Top Blue Hero Banner */}
        <section className="flex h-24 sm:h-28 w-full items-center justify-center bg-[#3366FF] px-4 text-white shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            ประวัติการซ่อม
          </h1>
        </section>

        {/* Main Content Layout */}
        <main className="flex-1 py-8 sm:py-10">
          <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
            <div className="flex flex-col gap-6 min-[801px]:flex-row min-[801px]:items-start min-[801px]:gap-8">
              {/* 1. Side Navbar (Sticky) */}
              <CustomerServicesSideNav activeMenu="history" />

              {/* 2. Customer Service History List */}
              <div className="flex-1 space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((n) => (
                      <div
                        key={n}
                        className="h-44 w-full animate-pulse rounded-xl border border-gray-200 bg-white p-6"
                      >
                        <div className="h-4 w-1/3 rounded bg-gray-200" />
                        <div className="mt-4 h-3 w-1/2 rounded bg-gray-100" />
                        <div className="mt-2 h-3 w-1/4 rounded bg-gray-100" />
                        <div className="mt-6 h-8 w-24 rounded bg-gray-200" />
                      </div>
                    ))}
                  </div>
                ) : historyOrders.length > 0 ? (
                  historyOrders.map((order) => (
                    <CustomerServiceCard
                      key={order.id}
                      order={order}
                      isHistory={true}
                      dateLabel="วันเวลาดำเนินการสำเร็จ:"
                      onReview={(targetOrder) => setReviewingOrder(targetOrder)}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-base font-medium text-gray-500">
                      ยังไม่มีประวัติการซ่อมในขณะนี้
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Review Modal */}
        <ReviewServiceModal
          order={reviewingOrder}
          open={Boolean(reviewingOrder)}
          onClose={() => setReviewingOrder(null)}
          onSubmitReview={handleSubmitReview}
          onDeleteReview={handleDeleteReview}
        />
      </div>
    </ProtectedRoute>
  );
}


export default CustomerServicesHistory;
