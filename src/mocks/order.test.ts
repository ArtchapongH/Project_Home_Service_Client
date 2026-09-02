import { describe, expect, it } from "vitest";

describe("checkout integration", () => {
  it("records a successful order when the client sends a valid checkout payload", async () => {
    const checkoutPayload = {
      userId: 1,
      serviceId: 2,
      totalAmount: 1000,
      discount: 50,
      serviceDate: "2026-09-10",
      serviceTime: "14:00:00",
      address: "อาคารเดอะ ธารา เลขที่ 58/28 หมู่ 2 ถนนแจ้งวัฒนะ",
      province: "นนทบุรี",
      district: "ปากเกร็ด",
      subdistrict: "บางตลาด",
      latitude: 13.901594444863845,
      longitude: 100.53133999511452,
      information: "",
      promotionCode: "HOME2012",
      paymentMethod: "card",
      paymentStatus: "succeeded",
      items: [
        {
          optionId: 3,
          quantity: 1,
          unitPrice: 1000,
        },
      ],
    };

    const response = await fetch("http://localhost:3001/api/orders/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(checkoutPayload),
    });

    const result = await response.json();

    expect(response.status).toBe(201);
    expect(result.message).toBe("Checkout recorded successfully");
    expect(result.data).toHaveProperty("order");
    expect(result.data).toHaveProperty("payment");

    const order = result.data.order;
    const payment = result.data.payment;

    expect(order).toEqual(
      expect.objectContaining({
        user_id: expect.any(String),
        service_id: expect.any(String),
        status: "pending",
        scheduled_time: checkoutPayload.serviceTime,
        address: checkoutPayload.address,
        province: checkoutPayload.province,
        district: checkoutPayload.district,
        subdistrict: checkoutPayload.subdistrict,
        additional_info: null,
      }),
    );

    expect(Number(order.user_id)).toBe(checkoutPayload.userId);
    expect(Number(order.service_id)).toBe(checkoutPayload.serviceId);
    expect(Number(order.total_price)).toBe(checkoutPayload.totalAmount);
    expect(Number(order.discount)).toBe(checkoutPayload.discount);
    expect(new Date(order.scheduled_date).toISOString()).toBeTruthy();

    expect(payment).toEqual(
      expect.objectContaining({
        payment_method: checkoutPayload.paymentMethod,
        payment_status: checkoutPayload.paymentStatus,
      }),
    );
    expect(Number(payment.amount)).toBe(checkoutPayload.totalAmount);
  });
});