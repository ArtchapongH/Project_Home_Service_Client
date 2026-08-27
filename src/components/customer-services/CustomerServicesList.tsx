"use client";

import { useState, useEffect } from "react";
import { CustomerServicesSideNav } from "./CustomerServicesSideNav";
import { CustomerServiceCard } from "./CustomerServiceCard";
import { CustomerServiceDetailModal } from "./CustomerServiceDetailModal";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { customerOrderApi } from "@/services/customerOrderApi";
import type { CustomerServiceOrder } from "@/types/customer-service";

const DEFAULT_MOCK_SERVICES: CustomerServiceOrder[] = [
  {
    id: "1",
    orderCode: "AD04071205",
    status: "pending",
    statusText: "รอดำเนินการ",
    scheduledDate: "25/04/2563",
    scheduledTime: "13.00 น.",
    technicianName: "สมาน เยี่ยมยอด",
    totalPrice: 1550.0,
    items: [
      {
        id: "item-1",
        name: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง",
        quantity: 2,
        unit: "เครื่อง",
      },
    ],
  },
  {
    id: "2",
    orderCode: "AD04071205",
    status: "pending",
    statusText: "รอดำเนินการ",
    scheduledDate: "25/04/2563",
    scheduledTime: "13.00 น.",
    technicianName: "สมาน เยี่ยมยอด",
    totalPrice: 1550.0,
    items: [
      {
        id: "item-2",
        name: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง",
        quantity: 2,
        unit: "เครื่อง",
      },
    ],
  },
  {
    id: "3",
    orderCode: "AD04071205",
    status: "in_progress",
    statusText: "กำลังดำเนินการ",
    scheduledDate: "25/04/2563",
    scheduledTime: "13.00 น.",
    technicianName: "สมาน เยี่ยมยอด",
    totalPrice: 1550.0,
    items: [
      {
        id: "item-3",
        name: "ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง",
        quantity: 2,
        unit: "เครื่อง",
      },
    ],
  },
];

interface CustomerServicesListProps {
  initialOrders?: CustomerServiceOrder[];
}

export function CustomerServicesList({
  initialOrders = DEFAULT_MOCK_SERVICES,
}: CustomerServicesListProps) {
  const [services, setServices] = useState<CustomerServiceOrder[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<CustomerServiceOrder | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const fetched = await customerOrderApi.getUserOrders();
        if (isMounted && fetched && fetched.length > 0) {
          // กรองเอาเฉพาะออเดอร์ที่ยังไม่เสร็จสิ้น (pending หรือ in_progress)
          const activeOrders = fetched.filter(
            (o) => o.status === "pending" || o.status === "in_progress"
          );
          if (activeOrders.length > 0) {
            setServices(activeOrders);
          }
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
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
                {services.length > 0 ? (
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
