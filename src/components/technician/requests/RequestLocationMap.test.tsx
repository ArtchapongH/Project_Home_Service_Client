import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RequestLocationMap } from "./RequestLocationMap";

const mocks = vi.hoisted(() => ({
  map: vi.fn(), marker: vi.fn(), fitBounds: vi.fn(), remove: vi.fn(), invalidateSize: vi.fn(),
  tileOn: vi.fn(), observe: vi.fn(), disconnect: vi.fn(),
}));

vi.mock("leaflet", () => ({ default: {
  map: mocks.map,
  marker: mocks.marker,
  divIcon: (options: unknown) => options,
  latLngBounds: (positions: unknown) => positions,
  tileLayer: () => ({ addTo: () => ({ on: mocks.tileOn }) }),
} }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.map.mockReturnValue({ fitBounds: mocks.fitBounds, remove: mocks.remove, invalidateSize: mocks.invalidateSize });
  mocks.marker.mockReturnValue({ addTo: () => ({ bindTooltip: vi.fn() }) });
  vi.stubGlobal("ResizeObserver", class { observe = mocks.observe; disconnect = mocks.disconnect; });
});
afterEach(() => vi.unstubAllGlobals());

const coordinates = { technicianLatitude: 13.81, technicianLongitude: 100.55, serviceLatitude: 13.82, serviceLongitude: 100.56 };

describe("request location map", () => {
  it("places distinct, read-only markers at the exact technician and job coordinates", () => {
    const { unmount } = render(<RequestLocationMap {...coordinates} />);
    expect(mocks.marker).toHaveBeenNthCalledWith(1, [13.81, 100.55], expect.objectContaining({ draggable: false, title: "ตำแหน่งช่าง", icon: expect.objectContaining({ html: expect.stringContaining("bg-blue-600") }) }));
    expect(mocks.marker).toHaveBeenNthCalledWith(2, [13.82, 100.56], expect.objectContaining({ draggable: false, title: "สถานที่ให้บริการ", icon: expect.objectContaining({ html: expect.stringContaining("bg-green-600") }) }));
    expect(mocks.fitBounds).toHaveBeenCalledWith([[13.81, 100.55], [13.82, 100.56]], expect.objectContaining({ maxZoom: 16 }));
    expect(mocks.invalidateSize).toHaveBeenCalled();
    unmount();
    expect(mocks.remove).toHaveBeenCalledTimes(1);
    expect(mocks.disconnect).toHaveBeenCalledTimes(1);
  });

  it("updates the technician marker and disposes the previous map", () => {
    const { rerender } = render(<RequestLocationMap {...coordinates} />);
    rerender(<RequestLocationMap {...coordinates} technicianLatitude={13.83} />);
    expect(mocks.remove).toHaveBeenCalledTimes(1);
    expect(mocks.marker).toHaveBeenCalledWith([13.83, 100.55], expect.any(Object));
  });

  it("shows only valid points and explains a missing customer point", () => {
    render(<RequestLocationMap {...coordinates} serviceLatitude={NaN} />);
    expect(mocks.marker).toHaveBeenCalledTimes(1);
    expect(screen.getByText("ไม่มีพิกัดสถานที่ให้บริการ")).toBeInTheDocument();
  });

  it("does not invent a location when neither point is valid", () => {
    render(<RequestLocationMap {...coordinates} technicianLatitude={null} serviceLongitude={181} />);
    expect(mocks.map).not.toHaveBeenCalled();
    expect(screen.getByText(/ไม่มีพิกัดช่าง/)).toBeInTheDocument();
    expect(screen.getByText("ไม่มีพิกัดสถานที่ให้บริการ")).toBeInTheDocument();
  });

  it("reports tile loading failures", () => {
    render(<RequestLocationMap {...coordinates} />);
    const tileErrorHandler = mocks.tileOn.mock.calls.find(([event]) => event === "tileerror")![1];
    act(() => tileErrorHandler());
    expect(screen.getByText(/โหลดแผนที่ไม่สำเร็จ/)).toBeInTheDocument();
  });
});
