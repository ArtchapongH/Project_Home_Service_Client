import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProfileCard } from "./profile-card";
import {
  getMyProfile,
  updateMyProfile,
  uploadMyAvatar,
} from "@/services/profile.service";

vi.mock("@/services/profile.service", () => ({
  getMyProfile: vi.fn(),
  updateMyProfile: vi.fn(),
  uploadMyAvatar: vi.fn(),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ fetchCurrentUser: vi.fn().mockResolvedValue(null) }),
}));

const profile = {
  id: "1",
  fullName: "Local Admin",
  email: "admin@example.com",
  phone: "0800000000",
  address: "Bangkok",
  avatarUrl: null,
  role: "ADMIN",
};

describe("ProfileCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getMyProfile).mockResolvedValue(profile);
  });

  it("loads the current profile in the restored layout", async () => {
    render(<ProfileCard />);

    expect(await screen.findByText("Local Admin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upload profile image" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "ที่อยู่" })).toHaveValue("Bangkok");
    expect(screen.getByRole("button", { name: "ยกเลิก" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "บันทึก" })).toBeInTheDocument();
  });

  it("updates the address while preserving account fields", async () => {
    const updatedProfile = {
      ...profile,
      address: "Chiang Mai",
    };
    vi.mocked(updateMyProfile).mockResolvedValue(updatedProfile);

    render(<ProfileCard />);
    const addressField = await screen.findByRole("textbox", { name: "ที่อยู่" });
    fireEvent.change(addressField, {
      target: { value: "Chiang Mai" },
    });
    fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));

    await waitFor(() => {
      expect(updateMyProfile).toHaveBeenCalledWith({
        fullName: "Local Admin",
        phone: "0800000000",
        address: "Chiang Mai",
        avatarUrl: null,
      });
    });
    expect(await screen.findByRole("status")).toHaveTextContent(
      "บันทึกข้อมูลโปรไฟล์สำเร็จ",
    );
    expect(addressField).toHaveValue("Chiang Mai");
  });

  it("restores the saved address when cancelled", async () => {
    render(<ProfileCard />);
    const addressField = await screen.findByRole("textbox", { name: "ที่อยู่" });

    fireEvent.change(addressField, { target: { value: "Chiang Mai" } });
    fireEvent.click(screen.getByRole("button", { name: "ยกเลิก" }));

    expect(addressField).toHaveValue("Bangkok");
  });

  it("uploads an avatar before saving the profile", async () => {
    const profileWithAvatar = {
      ...profile,
      avatarUrl: "https://example.com/avatar.jpg",
    };
    vi.mocked(uploadMyAvatar).mockResolvedValue(profileWithAvatar);
    vi.mocked(updateMyProfile).mockResolvedValue(profileWithAvatar);
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:avatar-preview");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});

    render(<ProfileCard />);
    await screen.findByText("Local Admin");

    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("เลือกรูปโปรไฟล์"), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));

    await waitFor(() => expect(uploadMyAvatar).toHaveBeenCalledWith(file));
    expect(updateMyProfile).toHaveBeenCalledWith({
      fullName: "Local Admin",
      phone: "0800000000",
      address: "Bangkok",
      avatarUrl: "https://example.com/avatar.jpg",
    });
  });

  it("shows an update error under the address form", async () => {
    vi.mocked(updateMyProfile).mockRejectedValue(new Error("บันทึกไม่สำเร็จ"));

    render(<ProfileCard />);
    await screen.findByText("Local Admin");
    fireEvent.click(screen.getByRole("button", { name: "บันทึก" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("บันทึกไม่สำเร็จ");
    expect(screen.getByRole("button", { name: "บันทึก" })).toBeInTheDocument();
  });
});
