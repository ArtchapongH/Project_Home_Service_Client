import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ServicesSection } from "./services-section";
import { getPublicServices } from "@/src/services/publicServiceApi";

vi.mock("@/src/services/publicServiceApi", () => ({
  getPublicServices: vi.fn(),
  getApiErrorMessage: () => "โหลดข้อมูลไม่สำเร็จ",
}));

vi.mock("next/image", () => ({ default: () => <span data-testid="service-image" /> }));

const service = (id: string) => ({
  id,
  name: `บริการ ${id}`,
  categoryId: "1",
  category: "บริการทั่วไป",
  imageUrl: null,
  minPrice: 500,
  maxPrice: 1000,
  isFeatured: true,
  displayOrder: Number(id),
  popularityScore: 10,
});

describe("ServicesSection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders at most three featured services", async () => {
    vi.mocked(getPublicServices).mockResolvedValue([service("1"), service("2"), service("3"), service("4")]);
    render(<ServicesSection />);
    await waitFor(() => expect(screen.getByText("บริการ 1")).toBeInTheDocument());
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(3);
    expect(getPublicServices).toHaveBeenCalledWith({ featured: true, limit: 3 });
  });

  it("shows an API error", async () => {
    vi.mocked(getPublicServices).mockRejectedValue(new Error("offline"));
    render(<ServicesSection />);
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดข้อมูลไม่สำเร็จ");
  });
});
