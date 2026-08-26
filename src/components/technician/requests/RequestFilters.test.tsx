import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RequestFilters } from "@/components/technician/requests/RequestFilters";

describe("RequestFilters", () => {
  it("reports service and search changes", () => {
    const onServiceChange = vi.fn();
    const onSearchChange = vi.fn();

    render(
      <RequestFilters
        services={[
          { id: "1", name: "ทำความสะอาดทั่วไป" },
          { id: "2", name: "ล้างแอร์" },
        ]}
        selectedServiceId=""
        searchText=""
        onServiceChange={onServiceChange}
        onSearchChange={onSearchChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("กรองตามบริการ"), {
      target: { value: "2" },
    });
    fireEvent.change(screen.getByLabelText("ค้นหาคำขอบริการ"), {
      target: { value: "HS-2026" },
    });

    expect(onServiceChange).toHaveBeenCalledWith("2");
    expect(onSearchChange).toHaveBeenCalledWith("HS-2026");
  });
});
