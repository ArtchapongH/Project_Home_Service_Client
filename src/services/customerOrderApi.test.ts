import { beforeEach, describe, expect, it, vi } from "vitest";

import apiClient from "./apiClient";
import { customerOrderApi } from "./customerOrderApi";
import type { CustomerServiceOrder } from "@/types/customer-service";

vi.mock("./apiClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

const serverOrder: CustomerServiceOrder = {
  id: "101",
  orderCode: "AD00000101",
  status: "pending",
  scheduledDate: "23/09/2569",
  scheduledTime: "10:00 น.",
  totalPrice: 500,
  items: [],
};

describe("customerOrderApi", () => {
  const storage = new Map<string, string>();
  const localStorageMock = {
    clear: () => storage.clear(),
    getItem: (key: string) => storage.get(key) ?? null,
    removeItem: (key: string) => storage.delete(key),
    setItem: (key: string, value: string) => storage.set(key, value),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: localStorageMock,
    });
  });

  it("uses the server as the only order source and removes legacy local orders", async () => {
    localStorageMock.setItem(
      "home_service_user_orders",
      JSON.stringify([{ ...serverOrder, id: "local-1", orderCode: "LOCAL-1" }]),
    );
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { success: true, data: [serverOrder] },
    });

    await expect(customerOrderApi.getUserOrders()).resolves.toEqual([serverOrder]);
    expect(localStorageMock.getItem("home_service_user_orders")).toBeNull();
  });
});
