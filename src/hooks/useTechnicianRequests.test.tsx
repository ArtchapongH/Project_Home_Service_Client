import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useTechnicianRequests } from "@/hooks/useTechnicianRequests";
import { INITIAL_REQUESTS } from "@/mocks/technicianRequestFixtures";
import type { TechnicianProfile } from "@/types/technician";

const mocks = vi.hoisted(() => ({
  acceptRequest: vi.fn(),
  declineRequest: vi.fn(),
  getRequests: vi.fn(),
  readLocation: vi.fn(),
  reverseGeocode: vi.fn(),
  updateLocation: vi.fn(),
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
  updateTechnicianLocation: mocks.updateLocation,
  getTechnicianApiError: (error: unknown) =>
    typeof error === "object" && error !== null
      ? error
      : { message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" },
}));

vi.mock("@/utils/technicianLocation", async (importOriginal) => ({
  ...await importOriginal<typeof import("@/utils/technicianLocation")>(),
  readBrowserLocation: mocks.readLocation,
  reverseGeocodeAddress: mocks.reverseGeocode,
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
    vi.resetAllMocks();
    mocks.context.profile = availableProfile;
    mocks.getRequests.mockResolvedValue({ data: [request], meta: { total: 1 } });
    mocks.acceptRequest.mockResolvedValue(request);
    mocks.declineRequest.mockResolvedValue(undefined);
    mocks.readLocation.mockRejectedValue(new Error("ไม่ได้รับอนุญาตให้เข้าถึงตำแหน่ง"));
    mocks.reverseGeocode.mockResolvedValue("ที่อยู่จาก GPS");
    mocks.updateLocation.mockImplementation(async (input) => ({ ...input, locationUpdatedAt: "2026-10-06T04:00:00Z" }));
    mocks.setProfile.mockImplementation((profile) => { mocks.context.profile = profile; });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not load requests while the technician is unavailable", async () => {
    mocks.context.profile = { ...availableProfile, isAvailable: false };

    renderHook(() => useTechnicianRequests());
    await runDebounce();

    expect(mocks.getRequests).not.toHaveBeenCalled();
    expect(mocks.readLocation).not.toHaveBeenCalled();
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

  it("reads GPS even without saved coordinates and explains a failed attempt", async () => {
    mocks.context.profile = { ...availableProfile, latitude: null, longitude: null };

    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();

    expect(mocks.readLocation).toHaveBeenCalledTimes(1);
    expect(mocks.getRequests).not.toHaveBeenCalled();
    expect(result.current.locationMessage).toContain("ยังไม่มีพิกัด กรุณากดรีเฟรช");
  });

  it("saves fresh GPS and its address together, then queries with the new coordinates", async () => {
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    mocks.readLocation.mockResolvedValue({ latitude: 13.81, longitude: 100.55 });

    await act(async () => result.current.refreshLocation());
    await runDebounce();

    expect(mocks.updateLocation).toHaveBeenCalledWith({ latitude: 13.81, longitude: 100.55, address: "ที่อยู่จาก GPS" });
    expect(result.current.profile).toMatchObject({ latitude: 13.81, longitude: 100.55, address: "ที่อยู่จาก GPS", locationUpdatedAt: "2026-10-06T04:00:00Z" });
    expect(mocks.getRequests).toHaveBeenLastCalledWith(expect.objectContaining({ latitude: 13.81, longitude: 100.55 }));
    expect(result.current.locationMessage).toBe("บันทึกพิกัดและที่อยู่ปัจจุบันแล้ว");
    expect(mocks.readLocation).toHaveBeenCalledTimes(2);
  });

  it("reads GPS once after the profile becomes ready, including Strict Mode", async () => {
    mocks.context.profile = null;
    mocks.readLocation.mockResolvedValue({ latitude: 13.81, longitude: 100.55 });
    const { result, rerender } = renderHook(() => useTechnicianRequests(), { wrapper: StrictMode });
    expect(mocks.readLocation).not.toHaveBeenCalled();
    mocks.context.profile = availableProfile;
    rerender();
    await runDebounce();
    rerender();
    await runDebounce();
    expect(mocks.readLocation).toHaveBeenCalledTimes(1);
    expect(mocks.updateLocation).toHaveBeenCalledTimes(1);
    expect(result.current.profile?.latitude).toBe(13.81);
  });

  it("reloads requests even if fresh GPS returns the same coordinates", async () => {
    mocks.readLocation.mockResolvedValue({ latitude: availableProfile.latitude, longitude: availableProfile.longitude });
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    mocks.getRequests.mockClear();
    await act(async () => result.current.refreshLocation());
    await runDebounce();
    expect(mocks.getRequests).toHaveBeenCalledTimes(1);
    expect(result.current.isLoadingRequests).toBe(false);
  });

  it("discards a response from the old location after GPS refresh", async () => {
    let resolveOld!: (value: { data: typeof request[]; meta: { total: number } }) => void;
    mocks.getRequests.mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }));
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    mocks.readLocation.mockResolvedValue({ latitude: 13.81, longitude: 100.55 });
    const newRequest = { ...request, orderId: "new-location-job" };
    mocks.getRequests.mockResolvedValue({ data: [newRequest], meta: { total: 1 } });
    await act(async () => result.current.refreshLocation());
    await runDebounce();
    await act(async () => resolveOld({ data: [request], meta: { total: 99 } }));
    expect(result.current.requests).toEqual([newRequest]);
    expect(mocks.setRequestCount).toHaveBeenLastCalledWith(1);
  });

  it("keeps the saved location and address if saving GPS fails", async () => {
    mocks.readLocation.mockResolvedValue({ latitude: 13.81, longitude: 100.55 });
    mocks.updateLocation.mockRejectedValue(new Error("บันทึกพิกัดไม่สำเร็จ"));
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    expect(mocks.setProfile).not.toHaveBeenCalled();
    expect(result.current.profile).toEqual(availableProfile);
    expect(result.current.locationMessage).toContain("กำลังใช้ตำแหน่งที่บันทึกไว้");
    expect(result.current.isUpdatingLocation).toBe(false);
  });

  it("uses the latest location when an acceptance finishes after GPS refresh", async () => {
    let resolveAccept!: (value: typeof request) => void;
    mocks.acceptRequest.mockReturnValue(new Promise((resolve) => { resolveAccept = resolve; }));
    const { result } = renderHook(() => useTechnicianRequests());
    await runDebounce();
    act(() => result.current.selectRequestToAccept(request));
    let acceptance!: Promise<void>;
    act(() => { acceptance = result.current.confirmAcceptRequest(); });
    mocks.readLocation.mockResolvedValue({ latitude: 13.81, longitude: 100.55 });
    await act(async () => result.current.refreshLocation());
    await runDebounce();
    mocks.getRequests.mockClear();
    await act(async () => { resolveAccept(request); await acceptance; });
    expect(mocks.getRequests).toHaveBeenCalledWith(expect.objectContaining({ latitude: 13.81, longitude: 100.55 }));
  });

  it("does not save GPS after the requests page unmounts", async () => {
    let resolveLocation!: (value: { latitude: number; longitude: number }) => void;
    mocks.readLocation.mockReturnValue(new Promise((resolve) => { resolveLocation = resolve; }));
    const { unmount } = renderHook(() => useTechnicianRequests());
    unmount();
    await act(async () => resolveLocation({ latitude: 13.81, longitude: 100.55 }));
    expect(mocks.updateLocation).not.toHaveBeenCalled();
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
    mocks.readLocation.mockRejectedValue(new Error("ใช้เวลาค้นหาตำแหน่งนานเกินไป"));
    const { result } = renderHook(() => useTechnicianRequests());

    await runDebounce();
    expect(result.current.errorMessage).toBe("โหลดรายการไม่สำเร็จ");
    expect(result.current.isLoadingRequests).toBe(false);

    await act(async () => result.current.refreshLocation());
    expect(result.current.locationMessage).toContain("ใช้เวลาค้นหาตำแหน่งนานเกินไป");
    expect(result.current.locationMessage).toContain("กำลังใช้ตำแหน่งที่บันทึกไว้");
    expect(result.current.isUpdatingLocation).toBe(false);
  });
});
