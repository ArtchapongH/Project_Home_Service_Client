import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RequestListContent } from "@/components/technician/requests/RequestListContent";
import { INITIAL_REQUESTS } from "@/mocks/technicianRequestFixtures";

const request = INITIAL_REQUESTS[0];

function renderContent(
  overrides: Partial<React.ComponentProps<typeof RequestListContent>> = {},
) {
  const props: React.ComponentProps<typeof RequestListContent> = {
    isAvailable: true,
    hasCoordinates: true,
    isLoading: false,
    requests: [request],
    activeRequestId: null,
    onAccept: vi.fn(),
    onDecline: vi.fn(),
    ...overrides,
  };

  render(<RequestListContent {...props} />);
  return props;
}

describe("RequestListContent", () => {
  it("shows the unavailable state", () => {
    renderContent({ isAvailable: false });
    expect(screen.getByText("ต้องการรับแจ้งเตือนคำขอบริการหรือไม่?")).toBeInTheDocument();
  });

  it("asks for location when coordinates are missing", () => {
    renderContent({ hasCoordinates: false });
    expect(screen.getByText(/กดรับพิกัดที่หน้าตั้งค่าบัญชีผู้ใช้/)).toBeInTheDocument();
  });

  it("shows loading and empty states", () => {
    const { rerender } = render(
      <RequestListContent
        isAvailable
        hasCoordinates
        isLoading
        requests={[]}
        activeRequestId={null}
        onAccept={vi.fn()}
        onDecline={vi.fn()}
      />,
    );
    expect(screen.getByText("กำลังโหลดคำขอบริการ...")).toBeInTheDocument();

    rerender(
      <RequestListContent
        isAvailable
        hasCoordinates
        isLoading={false}
        requests={[]}
        activeRequestId={null}
        onAccept={vi.fn()}
        onDecline={vi.fn()}
      />,
    );
    expect(screen.getByText("ยังไม่มีคำขอบริการในรัศมี 4 กิโลเมตร")).toBeInTheDocument();
  });

  it("renders requests and forwards accept and decline actions", () => {
    const props = renderContent({ activeRequestId: request.orderId });
    const acceptButton = screen.getByRole("button", { name: "รับงาน" });
    const declineButton = screen.getByRole("button", { name: "ปฏิเสธ" });

    expect(acceptButton).toBeDisabled();
    expect(declineButton).toBeDisabled();

    renderContent({ activeRequestId: null, onAccept: props.onAccept, onDecline: props.onDecline });
    const enabledAcceptButtons = screen.getAllByRole("button", { name: "รับงาน" });
    const enabledDeclineButtons = screen.getAllByRole("button", { name: "ปฏิเสธ" });
    fireEvent.click(enabledAcceptButtons[1]);
    fireEvent.click(enabledDeclineButtons[1]);

    expect(props.onAccept).toHaveBeenCalledWith(request);
    expect(props.onDecline).toHaveBeenCalledWith(request);
  });
});
