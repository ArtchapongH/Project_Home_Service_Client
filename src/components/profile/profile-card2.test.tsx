import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileCard2 } from "./profile-card2";
import type { UserProfile } from "@/types/user";

const getMyProfile = vi.fn();
const updateMyProfile = vi.fn();
const uploadMyAvatar = vi.fn();
const fetchCurrentUser = vi.fn();

vi.mock("@/services/profile.service", () => ({
  getMyProfile: (...args: unknown[]) => getMyProfile(...args),
  updateMyProfile: (...args: unknown[]) => updateMyProfile(...args),
  uploadMyAvatar: (...args: unknown[]) => uploadMyAvatar(...args),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ fetchCurrentUser }),
}));

const profile: UserProfile = {
  id: "1",
  fullName: "สมชาย ใจดี",
  displayName: "ช่างสมชาย",
  firstName: "สมชาย",
  lastName: "ใจดี",
  email: "somchai@example.com",
  phone: "0812345678",
  address: null,
  avatarUrl: null,
  role: "USER",
};

describe("ProfileCard2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getMyProfile.mockResolvedValue(profile);
    updateMyProfile.mockResolvedValue(profile);
    uploadMyAvatar.mockResolvedValue(profile);
    fetchCurrentUser.mockResolvedValue(profile);
  });

  it("loads separate profile name fields", async () => {
    render(<ProfileCard2 />);

    expect(await screen.findByDisplayValue("ช่างสมชาย")).toBeInTheDocument();
    expect(screen.getByDisplayValue("สมชาย")).toBeInTheDocument();
    expect(screen.getByDisplayValue("ใจดี")).toBeInTheDocument();
  });

  it("submits normalized profile fields and syncs the server response", async () => {
    const updated = { ...profile, displayName: "สมชาย คนใหม่", fullName: "สมชาย คนใหม่" };
    updateMyProfile.mockResolvedValue(updated);
    render(<ProfileCard2 />);

    const displayName = await screen.findByLabelText("ชื่อที่แสดง");
    fireEvent.change(displayName, { target: { value: "  สมชาย คนใหม่  " } });
    fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));

    await waitFor(() => expect(updateMyProfile).toHaveBeenCalledWith(expect.objectContaining({
      displayName: "สมชาย คนใหม่",
      firstName: "สมชาย",
      lastName: "ใจดี",
      email: "somchai@example.com",
      phone: "0812345678",
    })));
    expect(await screen.findByText("บันทึกข้อมูลโปรไฟล์สำเร็จ")).toBeInTheDocument();
  });

  it("rejects unsupported image types before upload", async () => {
    render(<ProfileCard2 />);
    const fileInput = await screen.findByLabelText("เลือกรูปโปรไฟล์");
    const svg = new File(["<svg />"], "avatar.svg", { type: "image/svg+xml" });

    fireEvent.change(fileInput, { target: { files: [svg] } });

    expect(await screen.findByText("กรุณาเลือกรูป JPEG, PNG, GIF หรือ WebP")).toBeInTheDocument();
    expect(uploadMyAvatar).not.toHaveBeenCalled();
  });

  it("rejects an invalid email before saving", async () => {
    render(<ProfileCard2 />);
    const email = await screen.findByLabelText("อีเมล");
    fireEvent.change(email, { target: { value: "user@example" } });
    fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));

    expect(await screen.findByText("กรอกอีเมลให้ถูกต้อง")).toBeInTheDocument();
    expect(updateMyProfile).not.toHaveBeenCalled();
  });
});
