"use client";

import { useState, useEffect } from "react";
import { CustomerServicesSideNav } from "./CustomerServicesSideNav";
import { CustomerServiceCard } from "./CustomerServiceCard";
import { CustomerServiceDetailModal } from "./CustomerServiceDetailModal";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { customerOrderApi } from "@/services/customerOrderApi";
import type { CustomerServiceOrder } from "@/types/customer-service";

interface CustomerServicesListProps {
  initialOrders?: CustomerServiceOrder[];
}

export function CustomerServicesList({
  initialOrders,
}: CustomerServicesListProps) {
  const [services, setServices] = useState<CustomerServiceOrder[]>(initialOrders || []);
  const [isLoading, setIsLoading] = useState<boolean>(!initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerServiceOrder | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const fetched = await customerOrderApi.getUserOrders();
        if (isMounted) {
          // กรองเอาเฉพาะออเดอร์ที่ยังไม่เสร็จสิ้น (pending หรือ in_progress)
          const activeOrders = (fetched || []).filter(
            (o) => o.status === "pending" || o.status === "in_progress"
          );
          setServices(activeOrders);
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
        {/* Top Blue Hero Banner */}
        <section className="flex h-24 sm:h-28 w-full items-center justify-center bg-[#3366FF] px-4 text-white shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center">
            รายการคำสั่งซ่อม
          </h1>
        </section>

        {/* Main Content Layout */}
        <main className="flex-1 py-8 sm:py-10">
          <div className="mx-auto w-[min(1140px,calc(100%-32px))] min-[801px]:w-[min(1140px,calc(100%-48px))]">
            <div className="flex flex-col gap-6 min-[801px]:flex-row min-[801px]:items-start min-[801px]:gap-8">
              {/* 1. Side Navbar (Sticky) */}
              <CustomerServicesSideNav activeMenu="services" />

              {/* 2. Customer Services List */}
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
                ) : services.length > 0 ? (
                  services.map((service) => (
                    <CustomerServiceCard
                      key={service.id}
                      order={service}
                      onViewDetail={(orderId) => {
                        const found = services.find((s) => s.id === orderId);
                        if (found) setSelectedOrder(found);
                      }}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <p className="text-base font-medium text-gray-500">
                      ยังไม่มีรายการคำสั่งซ่อมในขณะนี้
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Detail Modal Dialog */}
        <CustomerServiceDetailModal
          order={selectedOrder}
          open={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </ProtectedRoute>
  );
}

export default CustomerServicesList;
