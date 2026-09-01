import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTechnicianRequests } from "@/hooks/useTechnicianRequests";
import { INITIAL_REQUESTS } from "@/mocks/technicianRequestFixtures";
import type { TechnicianProfile } from "@/types/technician";

const mocks = vi.hoisted(() => ({
  acceptRequest: vi.fn(),
  declineRequest: vi.fn(),
  getRequests: vi.fn(),
  getProfile: vi.fn(),
  setProfile: vi.fn(),
  setRequestCount: vi.fn(),
  context: {
    profile: null as TechnicianProfile | null,
  },
}));

vi.mock("@/contexts/TechnicianContext", () => ({
  useTechnician: () => ({
    profile: mocks.context.profile,
    setProfile: mocks.setProfile,
    setRequestCount: mocks.setRequestCount,
  }),
}));

vi.mock("@/services/technicianApi", () => ({
  acceptTechnicianRequest: mocks.acceptRequest,
  declineTechnicianRequest: mocks.declineRequest,
  getTechnicianRequests: mocks.getRequests,
  getTechnicianProfile: mocks.getProfile,
  getTechnicianApiError: (error: unknown) =>
    typeof error === "object" && error !== null
      ? error
      : { message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
}));

const availableProfile: TechnicianProfile = {
  technicianId: "tech-1",
  userId: "user-1",
  email: "technician@example.com",
  fullName: "ช่างทดสอบ",
  phone: "0812345678",
  address: "กรุงเทพมหานคร",
  isAvailable: true,
  latitude: 13.8285,
  longitude: 100.5596,
  locationUpdatedAt: null,
  services: [
    { id: "1", name: "ทำความสะอาดทั่วไป" },
    { id: "2", name: "ล้างแอร์" },
  ],
};

const request = INITIAL_REQUESTS[0];

async function runDebounce(): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(250);
  });
}

describe("useTechnicianRequests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    mocks.context.profile = availableProfile;
    mocks.getRequests.mockResolvedValue({ data: [request], meta: { total: 1 } });
    mocks.acceptRequest.mockResolvedValue(request);
    mocks.declineRequest.mockResolvedValue(undefined);
    mocks.getProfile.mockResolvedValue(availableProfile);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not load requests while the technician is unavailable", async () => {
    mocks.context.profile = { ...availableProfile, isAvailable: false };

    renderHook(() => useTechnicianRequests());
    await runDebounce();

    expect(mocks.getRequests).not.toHaveBeenCalled();
    expect(mocks.setRequestCount).toHaveBeenCalledWith(0);
  });

  it("does not load requests without coordinates", async () => {
    mocks.context.profile = { ...availableProfile, latitude: null, longitude: null };

    renderHook(() => useTechnicianRequests());
    await runDebounce();

    expect(mocks.getRequests).not.toHaveBeenCalled();
    expect(mocks.setRequestCount).toHaveBeenCalledWith(0);
  });

  it("loads requests and updates the shared request count", async () => {
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();

    expect(mocks.getRequests).toHaveBeenCalledWith({
      serviceId: undefined,
      search: undefined,
      latitude: availableProfile.latitude,
      longitude: availableProfile.longitude,
    });
    expect(result.current.requests).toEqual([request]);
    expect(mocks.setRequestCount).toHaveBeenCalledWith(1);
  });

  it("debounces search and service filters before loading", async () => {
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    mocks.getRequests.mockClear();

    act(() => {
      result.current.setSearchText("HS-2026");
      result.current.setSelectedServiceId("2");
    });

    expect(mocks.getRequests).not.toHaveBeenCalled();
    await runDebounce();

    expect(mocks.getRequests).toHaveBeenCalledWith({
      serviceId: "2",
      search: "HS-2026",
      latitude: availableProfile.latitude,
      longitude: availableProfile.longitude,
    });
  });

  it("does not read browser location when coordinates are missing", async () => {
    mocks.context.profile = { ...availableProfile, latitude: null, longitude: null };

    renderHook(() => useTechnicianRequests());
    await runDebounce();

    expect(mocks.getProfile).not.toHaveBeenCalled();
    expect(mocks.getRequests).not.toHaveBeenCalled();
  });

  it("reloads the saved profile from the API when refresh is pressed", async () => {
    const refreshedProfile = {
      ...availableProfile,
      address: "เชียงใหม่",
      latitude: 18.7964,
      longitude: 98.9673,
    };
    mocks.getProfile.mockResolvedValue(refreshedProfile);
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();

    await act(async () => result.current.refreshLocation());

    expect(mocks.getProfile).toHaveBeenCalledTimes(1);
    expect(mocks.setProfile).toHaveBeenCalledWith(refreshedProfile);
    expect(result.current.locationMessage).toBe("อัปเดตตำแหน่งจากบัญชีแล้ว");
  });

  it("accepts the selected request, closes the dialog, and refreshes the list", async () => {
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    mocks.getRequests.mockClear();

    act(() => result.current.selectRequestToAccept(request));
    await act(async () => result.current.confirmAcceptRequest());

    expect(mocks.acceptRequest).toHaveBeenCalledWith(request.orderId);
    expect(result.current.selectedRequest).toBeNull();
    expect(result.current.successMessage).toContain(request.orderCode);
    expect(mocks.getRequests).toHaveBeenCalledTimes(1);
  });

  it("shows the concurrent acceptance message and refreshes the list", async () => {
    mocks.acceptRequest.mockRejectedValue({
      code: "ORDER_ALREADY_ASSIGNED",
      message: "คำขอนี้ถูกรับแล้ว",
    });
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    mocks.getRequests.mockClear();

    act(() => result.current.selectRequestToAccept(request));
    await act(async () => result.current.confirmAcceptRequest());

    expect(result.current.errorMessage).toBe(
      "มีช่างคนอื่นรับงานนี้แล้ว รายการถูกรีเฟรชแล้ว",
    );
    expect(result.current.selectedRequest).toBeNull();
    expect(mocks.getRequests).toHaveBeenCalledTimes(1);
  });

  it("declines a request and refreshes the list", async () => {
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    mocks.getRequests.mockClear();

    await act(async () => result.current.declineRequest(request));

    expect(mocks.declineRequest).toHaveBeenCalledWith(request.orderId);
    expect(result.current.successMessage).toContain(request.orderCode);
    expect(mocks.getRequests).toHaveBeenCalledTimes(1);
  });

  it("shows API and location errors and restores loading states", async () => {
    mocks.getRequests.mockRejectedValue({ message: "โหลดรายการไม่สำเร็จ" });
    mocks.getProfile.mockRejectedValue({ message: "โหลดโปรไฟล์ไม่สำเร็จ" });
    const { result } = renderHook(() => useTechnicianRequests());

    await runDebounce();
    expect(result.current.errorMessage).toBe("โหลดรายการไม่สำเร็จ");
    expect(result.current.isLoadingRequests).toBe(false);

    await act(async () => result.current.refreshLocation());
    expect(result.current.locationMessage).toBe("โหลดโปรไฟล์ไม่สำเร็จ");
    expect(result.current.isUpdatingLocation).toBe(false);
  });
});
