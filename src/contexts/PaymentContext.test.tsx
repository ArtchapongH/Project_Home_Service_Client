import { act, renderHook } from "@testing-library/react";
import { useContext } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PaymentContext, PaymentProvider, getServiceBreadcrumbName, hasRequiredServiceFormData } from "./PaymentContext";

vi.mock("@stripe/stripe-js", () => ({ loadStripe: () => Promise.resolve(null) }));
vi.mock("@stripe/react-stripe-js", () => ({ Elements: ({ children }: { children: React.ReactNode }) => children }));

beforeEach(() => sessionStorage.clear());

describe("payment context outside the route layout", () => {
  it("restores the saved service, address and map coordinates across checkout steps", () => {
    const serviceFormData = {
      address: "ที่อยู่ทดสอบ", province: "กรุงเทพมหานคร", district: "เขตทดสอบ", subdistrict: "แขวงทดสอบ",
      serviceDate: "2026-10-06", serviceTime: "14:30", information: "", latitude: 13.81, longitude: 100.55,
    };
    sessionStorage.setItem("home-service-payment", JSON.stringify({
      serviceId: 3, serviceTitle: "ล้างแอร์", serviceFormData, totAmount: 1000,
    }));
    const { result } = renderHook(() => useContext(PaymentContext), { wrapper: PaymentProvider });
    expect(result.current).toMatchObject({ serviceId: 3, serviceTitle: "ล้างแอร์", serviceFormData, totAmount: 1000, isSecondPageCompleted: true });
    act(() => result.current!.setServiceTitle("ซ่อมแอร์"));
    expect(JSON.parse(sessionStorage.getItem("home-service-payment")!).serviceTitle).toBe("ซ่อมแอร์");
    act(() => result.current!.resetPayment());
    expect(result.current).toMatchObject({ serviceId: 0, serviceTitle: "", totAmount: 0, isSecondPageCompleted: false });
    expect(result.current!.serviceFormData.latitude).toBeNull();
  });

  it("recovers from invalid saved checkout data", () => {
    sessionStorage.setItem("home-service-payment", "invalid-json");
    const { result } = renderHook(() => useContext(PaymentContext), { wrapper: PaymentProvider });
    expect(result.current?.serviceId).toBe(0);
    expect(result.current?.isSecondPageCompleted).toBe(false);
    expect(() => JSON.parse(sessionStorage.getItem("home-service-payment")!)).not.toThrow();
  });

  it("keeps breadcrumb naming and the requirement for a customer pin", () => {
    expect(getServiceBreadcrumbName("", [{ service_name: "ล้างแอร์", quantity: 1 }])).toBe("ล้างแอร์");
    expect(getServiceBreadcrumbName("ซ่อมแอร์", [])).toBe("ซ่อมแอร์");
    expect(hasRequiredServiceFormData({
      address: "ที่อยู่", province: "จังหวัด", district: "อำเภอ", subdistrict: "ตำบล",
      serviceDate: "2026-10-06", serviceTime: "14:30", information: "", latitude: null, longitude: null,
    })).toBe(false);
  });
});
