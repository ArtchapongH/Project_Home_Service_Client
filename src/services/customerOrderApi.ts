import apiClient from "./apiClient";
import type { CustomerServiceOrder } from "@/types/customer-service";

const LEGACY_LOCAL_ORDERS_STORAGE_KEY = "home_service_user_orders";

function clearLegacyLocalOrders(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(LEGACY_LOCAL_ORDERS_STORAGE_KEY);
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }
}

export const customerOrderApi = {
  /**
   * ดึงรายการคำสั่งซ่อมทั้งหมดของผู้ใช้งานปัจจุบัน
   */
  getUserOrders: async (): Promise<CustomerServiceOrder[]> => {
    clearLegacyLocalOrders();
    const response = await apiClient.get<{ success: boolean; data: CustomerServiceOrder[] }>(
      "/api/orders"
    );
    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * ดึงรายละเอียดคำสั่งซ่อมรายอัน
   */
  getOrderById: async (orderIdOrCode: string): Promise<CustomerServiceOrder | null> => {
    clearLegacyLocalOrders();
    const response = await apiClient.get<{ success: boolean; data: CustomerServiceOrder }>(
      `/api/orders/${orderIdOrCode}`
    );
    return response.data?.data ?? null;
  },
};

export default customerOrderApi;
