import apiClient from "./apiClient";
import type { CustomerServiceOrder } from "@/types/customer-service";

const LOCAL_ORDERS_STORAGE_KEY = "home_service_user_orders";

/**
 * ดึงคำสั่งซื้อที่ถูกจำลองเก็บไว้ใน Local/Session Storage (สำหรับการทดสอบหรือระหว่างรอ Backend)
 */
export function getLocalStoredOrders(): CustomerServiceOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CustomerServiceOrder[];
  } catch {
    return [];
  }
}

/**
 * บันทึกคำสั่งซื้อใหม่ลงใน Local Storage เพื่อให้ขึ้นในการ์ดรายการคำสั่งซ่อมทันที
 */
export function saveLocalStoredOrder(newOrder: CustomerServiceOrder): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getLocalStoredOrders();
    const updated = [newOrder, ...existing.filter((o) => o.id !== newOrder.id && o.orderCode !== newOrder.orderCode)];
    window.localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save local order:", err);
  }
}

export const customerOrderApi = {
  /**
   * ดึงรายการคำสั่งซ่อมทั้งหมดของผู้ใช้งานปัจจุบัน
   */
  getUserOrders: async (): Promise<CustomerServiceOrder[]> => {
    try {
      // 1. ลองเรียก API หลังบ้าน
      const response = await apiClient.get<{ success: boolean; data: CustomerServiceOrder[] }>(
        "/api/orders"
      );
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch {
      // หาก API หลังบ้านยังไม่มี ให้ fallback ไปใช้ข้อมูลที่ลูกค้าเพิ่งกดสั่งซื้อ
    }

    const localOrders = getLocalStoredOrders();
    return localOrders;
  },

  /**
   * ดึงรายละเอียดคำสั่งซ่อมรายอัน
   */
  getOrderById: async (orderIdOrCode: string): Promise<CustomerServiceOrder | null> => {
    try {
      const response = await apiClient.get<{ success: boolean; data: CustomerServiceOrder }>(
        `/api/orders/${orderIdOrCode}`
      );
      if (response.data?.data) {
        return response.data.data;
      }
    } catch {
      // Fallback
    }

    const localOrders = getLocalStoredOrders();
    return (
      localOrders.find(
        (o) => o.id === orderIdOrCode || o.orderCode === orderIdOrCode
      ) ?? null
    );
  },
};

export default customerOrderApi;
