import { afterEach, describe, expect, it, vi } from "vitest";
import { hasValidCoordinates, readBrowserLocation, reverseGeocodeAddress } from "./technicianLocation";

afterEach(() => vi.unstubAllGlobals());

describe("technician location", () => {
  it.each([
    [13.81, 100.55, true], [0, 0, true], [-90, 180, true],
    [null, 100.55, false], [13.81, undefined, false], [NaN, 100, false],
    [Infinity, 100, false], [91, 100, false], [13, -181, false],
  ])("validates coordinates %s, %s", (latitude, longitude, expected) => {
    expect(hasValidCoordinates(latitude, longitude)).toBe(expected);
  });

  it("requests fresh high-accuracy GPS", async () => {
    const getCurrentPosition = vi.fn((success) => success({ coords: { latitude: 13.81, longitude: 100.55 } }));
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition } });
    await expect(readBrowserLocation()).resolves.toEqual({ latitude: 13.81, longitude: 100.55 });
    expect(getCurrentPosition).toHaveBeenCalledWith(expect.any(Function), expect.any(Function), {
      enableHighAccuracy: true, timeout: 10_000, maximumAge: 0,
    });
  });

  it.each([
    [1, "ไม่ได้รับอนุญาต"], [2, "ไม่สามารถระบุตำแหน่ง"], [3, "ใช้เวลาค้นหาตำแหน่งนานเกินไป"],
  ])("explains GPS error %s", async (code, message) => {
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition: (_success: unknown, failure: (error: unknown) => void) => failure({ code, PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 }) } });
    await expect(readBrowserLocation()).rejects.toThrow(message);
  });

  it("rejects an invalid GPS result", async () => {
    vi.stubGlobal("navigator", { geolocation: { getCurrentPosition: (success: (position: unknown) => void) => success({ coords: { latitude: NaN, longitude: 100 } }) } });
    await expect(readBrowserLocation()).rejects.toThrow("พิกัดที่ได้รับไม่ถูกต้อง");
  });

  it("resolves the address from the exact GPS coordinates", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ display_name: "  ที่อยู่ใหม่  " }) });
    vi.stubGlobal("fetch", fetchMock);
    await expect(reverseGeocodeAddress(13.81, 100.55)).resolves.toBe("ที่อยู่ใหม่");
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining("lat=13.81&lon=100.55"), expect.objectContaining({ signal: expect.any(AbortSignal) }));
  });

  it.each(["network", "http", "missing-address"])("uses coordinates instead of an old address on %s failure", async (failure) => {
    const fetchMock = vi.fn();
    if (failure === "network") fetchMock.mockRejectedValue(new Error("offline"));
    else fetchMock.mockResolvedValue({ ok: failure !== "http", json: async () => ({}) });
    vi.stubGlobal("fetch", fetchMock);
    await expect(reverseGeocodeAddress(13.81, 100.55)).resolves.toBe("พิกัด 13.81000, 100.55000");
  });
});
