import {describe, test, expect, beforeEach, afterEach} from "vitest";


// integration >> น่าจะต้องย้ายไปไว้ frontend
test("successfully add order to the database", async ()=>{
    const response = await fetch(`${API_BASE_URL}/api/orders/checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: 1,
                serviceId: 2,
                totalAmount: 1000,
                discount: 50,
                serviceDate: '2026-08-31',
                serviceTime: '14:00:00',
                address: "อาคารเดอะ ธารา เลขที่ 58/28 หมู่ 2 ถนนแจ้งวัฒนะ",
                province: "นนทบุรี",
                district: "ปากเกร็ด",
                subdistrict: "บางตลาด",
                information: "",
                promotionCode: "HOME2012",
                paymentMethod: "card",
                paymentStatus: "succeeded",
                items: [{
                    optionId: 3,
                    quantity: 1,
                    unitPrice: 1000
                }],
            }),
    });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
        message: "Order created successfully",
        data: {
            order: {
                user_id: 1,
                service_id: 2,
                status: "pending",
                total_price: 1000,
                scheduled_date: '2026-08-31',
                scheduled_time:  '14:00:00',
                address: "อาคารเดอะ ธารา เลขที่ 58/28 หมู่ 2 ถนนแจ้งวัฒนะ",
                province: "นนทบุรี",
                district: "ปากเกร็ด",
                subdistrict: "บางตลาด",
                additional_info:  "",
                promotion_id: 5,
                discount:  50
            },
            payment: {
                order_id: 1,
                payment_method: "card",
                payment_status: "succeeded",
                amount: 950
            }
        }
    });
});