import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ServiceListContent } from "./ServiceListContent";
import {
  getPublicCategories,
  getPublicServices,
} from "@/src/services/publicServiceApi";

vi.mock("@/src/services/publicServiceApi", () => ({
  getPublicCategories: vi.fn(),
  getPublicServices: vi.fn(),
  getApiErrorMessage: () => "โหลดรายการบริการไม่สำเร็จ",
}));

vi.mock("./ServiceBanner", () => ({
  ServiceBanner: (props: {
    categories: Array<{ name: string }>;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSortByChange: (value: "popular") => void;
  }) => (
    <div>
      <button onClick={() => props.onSearchChange("ล้างแอร์")}>search</button>
      <button onClick={() => props.onCategoryChange(props.categories[0]?.name ?? "all")}>category</button>
      <button onClick={() => props.onSortByChange("popular")}>popular</button>
    </div>
  ),
}));

vi.mock("./ServiceCard", () => ({
  ServiceCard: ({ service }: { service: { name: string } }) => <div data-testid="service-card">{service.name}</div>,
}));

vi.mock("./ServiceBottomBanner", () => ({ ServiceBottomBanner: () => null }));

const services = [
  {
    id: "1",
    name: "ซ่อมก๊อกน้ำ",
    categoryId: "2",
    category: "บริการห้องน้ำ",
    imageUrl: null,
    minPrice: 400,
    maxPrice: 400,
    isFeatured: false,
    displayOrder: 2,
    popularityScore: 20,
  },
  {
    id: "2",
    name: "ล้างแอร์",
    categoryId: "1",
    category: "บริการทั่วไป",
    imageUrl: null,
    minPrice: 500,
    maxPrice: 1000,
    isFeatured: true,
    displayOrder: 1,
    popularityScore: 99,
  },
];

describe("ServiceListContent", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows loading and then an empty state", async () => {
    vi.mocked(getPublicServices).mockResolvedValue([]);
    vi.mocked(getPublicCategories).mockResolvedValue([]);
    render(<ServiceListContent />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(await screen.findByText("ไม่พบบริการที่คุณค้นหา")).toBeInTheDocument();
  });

  it("shows an API error", async () => {
    vi.mocked(getPublicServices).mockRejectedValue(new Error("offline"));
    vi.mocked(getPublicCategories).mockResolvedValue([]);
    render(<ServiceListContent />);
    expect(await screen.findByRole("alert")).toHaveTextContent("โหลดรายการบริการไม่สำเร็จ");
  });

  it("filters and sorts services with categories returned by the API", async () => {
    vi.mocked(getPublicServices).mockResolvedValue(services);
    vi.mocked(getPublicCategories).mockResolvedValue([
      { id: "2", name: "บริการห้องน้ำ" },
      { id: "1", name: "บริการทั่วไป" },
    ]);
    render(<ServiceListContent />);

    await waitFor(() => expect(screen.getAllByTestId("service-card")).toHaveLength(2));
    fireEvent.click(screen.getByRole("button", { name: "popular" }));
    expect(screen.getAllByTestId("service-card")[0]).toHaveTextContent("ล้างแอร์");

    fireEvent.click(screen.getByRole("button", { name: "category" }));
    expect(screen.getByText("ซ่อมก๊อกน้ำ")).toBeInTheDocument();
    expect(screen.queryByText("ล้างแอร์")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "search" }));
    expect(screen.getByText("ไม่พบบริการที่คุณค้นหา")).toBeInTheDocument();
  });
});
