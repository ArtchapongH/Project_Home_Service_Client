import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TechnicianJobDetail } from "@/components/technician/jobs/TechnicianJobDetail";
import type { TechnicianJob } from "@/types/technician";

const apiMocks = vi.hoisted(() => ({
  getTechnicianJob: vi.fn(),
  uploadTechnicianJobCompletionImages: vi.fn(),
  completeTechnicianJob: vi.fn(),
}));

vi.mock("@/services/technicianApi", () => ({
  ...apiMocks,
  getTechnicianApiError: (error: unknown) => ({
    message: error instanceof Error ? error.message : "เกิดข้อผิดพลาด",
  }),
}));

const acceptedJob: TechnicianJob = {
  assignmentId: "10",
  assignmentStatus: "ACCEPTED",
  assignedAt: "2026-08-31T01:00:00.000Z",
  completedAt: null,
  orderId: "20",
  orderCode: "ORDER-20",
  orderStatus: "accepted",
  scheduledAt: "2026-08-31T02:00:00.000Z",
  address: "Bangkok",
  serviceLatitude: null,
  serviceLongitude: null,
  subtotal: 500,
  discount: 0,
  totalPrice: 500,
  serviceId: "1",
  serviceName: "ล้างแอร์",
  categoryName: "บริการทั่วไป",
  customerName: "Customer",
  customerPhone: "0800000000",
  items: [],
  completionImages: [],
};

describe("TechnicianJobDetail completion flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMocks.getTechnicianJob.mockResolvedValue(acceptedJob);
    apiMocks.uploadTechnicianJobCompletionImages.mockResolvedValue({
      assignmentId: "10",
      imageCount: 3,
      images: [],
    });
    apiMocks.completeTechnicianJob
      .mockRejectedValueOnce(new Error("ส่งมอบงานไม่สำเร็จ"))
      .mockResolvedValue({
        ...acceptedJob,
        assignmentStatus: "COMPLETED",
        orderStatus: "completed",
      });
  });

  it("retries completion without uploading the evidence twice", async () => {
    render(<TechnicianJobDetail assignmentId="10" />);

    fireEvent.click(await screen.findByRole("button", { name: "ส่งมอบงาน" }));
    for (let index = 1; index <= 3; index += 1) {
      const file = new File([`image-${index}`], `image-${index}.png`, {
        type: "image/png",
      });
      fireEvent.change(screen.getByLabelText(`เพิ่มรูปที่ ${index}`), {
        target: { files: [file] },
      });
      await screen.findByAltText(`รูปหลักฐาน ${index}`);
    }

    fireEvent.click(
      screen.getByRole("button", { name: "ดำเนินการเสร็จสิ้น" }),
    );
    expect(await screen.findByText("ส่งมอบงานไม่สำเร็จ")).toBeInTheDocument();
    expect(apiMocks.uploadTechnicianJobCompletionImages).toHaveBeenCalledTimes(1);
    expect(apiMocks.completeTechnicianJob).toHaveBeenCalledTimes(1);

    fireEvent.click(
      screen.getByRole("button", { name: "ดำเนินการเสร็จสิ้น" }),
    );

    await waitFor(() => {
      expect(apiMocks.completeTechnicianJob).toHaveBeenCalledTimes(2);
      expect(apiMocks.uploadTechnicianJobCompletionImages).toHaveBeenCalledTimes(
        1,
      );
    });
    expect(
      await screen.findByText("ดำเนินการเสร็จสิ้นและส่งมอบงานสำเร็จ"),
    ).toBeInTheDocument();
  });
});
