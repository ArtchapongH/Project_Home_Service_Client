"use client";

import { useState, useEffect } from "react";
import { CustomerServicesSideNav } from "./CustomerServicesSideNav";
import { CustomerServiceCard } from "./CustomerServiceCard";
import { ReviewServiceModal } from "./ReviewServiceModal";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { reviewApi } from "@/services/reviewApi";
import type { CustomerServiceOrder } from "@/types/customer-service";

const DEFAULT_MOCK_HISTORY: CustomerServiceOrder[] = [
  {
    id: "h1",
    orderCode: "AD04071205",
    status: "completed",
    statusText: "ดำเนินการสำเร็จ",
    scheduledDate: "25/04/2563",
    scheduledTime: "16.00 น.",
    technicianName: "สมาน เยี่ยมยอด",
    totalPrice: 1550.0,
    items: [
      {
        id: "item-h1",
        name: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง",
        quantity: 2,
        unit: "เครื่อง",
      },
    ],
  },
  {
    id: "h2",
    orderCode: "AD04071206",
    status: "completed",
    statusText: "ดำเนินการสำเร็จ",
    scheduledDate: "25/04/2563",
    scheduledTime: "16.00 น.",
    technicianName: "สมาน เยี่ยมยอด",
    totalPrice: 1550.0,
    items: [
      {
        id: "item-h2",
        name: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง",
        quantity: 2,
        unit: "เครื่อง",
      },
    ],
  },
  {
    id: "h3",
    orderCode: "AD04071207",
    status: "completed",
    statusText: "ดำเนินการสำเร็จ",
    scheduledDate: "25/04/2563",
    scheduledTime: "16.00 น.",
    technicianName: "สมาน เยี่ยมยอด",
    totalPrice: 1550.0,
    items: [
      {
        id: "item-h3",
        name: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง",
        quantity: 2,
        unit: "เครื่อง",
      },
    ],
  },
];

interface CustomerServicesHistoryProps {
  initialHistory?: CustomerServiceOrder[];
}

export function CustomerServicesHistory({
  initialHistory = DEFAULT_MOCK_HISTORY,
}: CustomerServicesHistoryProps) {
  const [historyOrders, setHistoryOrders] = useState<CustomerServiceOrder[]>(initialHistory);
  const [reviewingOrder, setReviewingOrder] = useState<CustomerServiceOrder | null>(null);

  // ตรวจสอบสถานะการรีวิวจากฐานข้อมูลหลังบ้านสำหรับแต่ละรายการ
  useEffect(() => {
    let isMounted = true;

    async function checkExistingReviews() {
      try {
        const checkPromises = historyOrders.map(async (order) => {
          const code = order.orderCode || order.id;
          try {
            const res = await reviewApi.getReviewByOrderCode(code);
            if (res.isReviewed && res.data) {
              return {
                id: order.id,
                isReviewed: true,
                reviewRating: res.data.rating,
                reviewComment: res.data.comment,
              };
            }
          } catch {
            // Ignore fetch error for mock orders
          }
          return null;
        });

        const results = await Promise.all(checkPromises);
        if (!isMounted) return;

        setHistoryOrders((prev) =>
          prev.map((order) => {
            const match = results.find((r) => r?.id === order.id);
            if (match) {
              return {
                ...order,
                isReviewed: true,
                reviewRating: match.reviewRating,
                reviewComment: match.reviewComment,
              };
            }
            return order;
          })
        );
      } catch (err) {
        console.error("Failed to check reviews:", err);
      }
    }

    checkExistingReviews();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                {historyOrders.length > 0 ? (
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
