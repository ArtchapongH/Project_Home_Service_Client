import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AcceptRequestDialog } from "@/components/technician/requests/AcceptRequestDialog";

describe("AcceptRequestDialog", () => {
  it("does not render while closed", () => {
    render(
      <AcceptRequestDialog
        open={false}
        serviceName="ล้างแอร์"
        scheduledAt="26 ส.ค. 2569"
        loading={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows loading and disables actions while accepting", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <AcceptRequestDialog
        open
        serviceName="ล้างแอร์"
        scheduledAt="26 ส.ค. 2569"
        loading
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "กำลังรับงาน..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "ยกเลิก" })).toBeDisabled();
  });

  it("forwards close and confirm actions", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(
      <AcceptRequestDialog
        open
        serviceName="ล้างแอร์"
        scheduledAt="26 ส.ค. 2569"
        loading={false}
        onClose={onClose}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "ยืนยัน" }));
    fireEvent.click(screen.getByRole("button", { name: "ยกเลิก" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
