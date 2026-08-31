import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { JobCompletionDialog } from "@/components/technician/jobs/JobCompletionDialog";

describe("JobCompletionDialog", () => {
  it("requires at least three selected images before submitting", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <JobCompletionDialog
        open
        phase="idle"
        error={null}
        existingImageCount={0}
        existingImages={[]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = screen.getByRole("button", {
      name: "ดำเนินการเสร็จสิ้น",
    });
    expect(submitButton).toBeDisabled();

    for (let index = 1; index <= 3; index += 1) {
      const file = new File([`image-${index}`], `image-${index}.png`, {
        type: "image/png",
      });
      fireEvent.change(screen.getByLabelText(`เพิ่มรูปที่ ${index}`), {
        target: { files: [file] },
      });
      await screen.findByAltText(`รูปหลักฐาน ${index}`);
    }

    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toHaveLength(3);
    });
  });

  it("rejects selecting the same image more than once", async () => {
    render(
      <JobCompletionDialog
        open
        phase="idle"
        error={null}
        existingImageCount={0}
        existingImages={[]}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );
    const duplicateFile = new File(["same"], "same.png", {
      type: "image/png",
      lastModified: 1,
    });

    fireEvent.change(screen.getByLabelText("เพิ่มรูปที่ 1"), {
      target: { files: [duplicateFile] },
    });
    await screen.findByAltText("รูปหลักฐาน 1");
    fireEvent.change(screen.getByLabelText("เพิ่มรูปที่ 2"), {
      target: { files: [duplicateFile] },
    });

    expect(
      await screen.findByText("ไม่สามารถเลือกรูปภาพซ้ำกันได้"),
    ).toBeInTheDocument();
  });

  it("allows completion without another upload when evidence exists", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <JobCompletionDialog
        open
        phase="idle"
        error={null}
        existingImageCount={3}
        existingImages={[]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = screen.getByRole("button", {
      name: "ดำเนินการเสร็จสิ้น",
    });
    expect(submitButton).toBeEnabled();
    fireEvent.click(submitButton);

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith([]));
  });

  it("submits up to five images in one action", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(
      <JobCompletionDialog
        open
        phase="idle"
        error={null}
        existingImageCount={0}
        existingImages={[]}
        onClose={vi.fn()}
        onSubmit={onSubmit}
      />,
    );

    for (let index = 1; index <= 5; index += 1) {
      const file = new File([`image-${index}`], `image-${index}.webp`, {
        type: "image/webp",
      });
      fireEvent.change(screen.getByLabelText(`เพิ่มรูปที่ ${index}`), {
        target: { files: [file] },
      });
      await screen.findByAltText(`รูปหลักฐาน ${index}`);
    }

    fireEvent.click(
      screen.getByRole("button", { name: "ดำเนินการเสร็จสิ้น" }),
    );
    await waitFor(() => {
      expect(onSubmit.mock.calls[0][0]).toHaveLength(5);
    });
  });

  it("rejects unsupported file types", async () => {
    render(
      <JobCompletionDialog
        open
        phase="idle"
        error={null}
        existingImageCount={0}
        existingImages={[]}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("เพิ่มรูปที่ 1"), {
      target: {
        files: [new File(["document"], "document.pdf", { type: "application/pdf" })],
      },
    });

    expect(
      await screen.findByText("รองรับเฉพาะไฟล์ JPG, PNG, GIF และ WEBP"),
    ).toBeInTheDocument();
  });
});
