import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileCard } from "./profile-card";
import { getMyProfile } from "@/src/services/profile.service";

vi.mock("@/src/services/profile.service", () => ({ getMyProfile: vi.fn() }));

describe("ProfileCard", () => {
  it("renders profile fields without edit controls", async () => {
    vi.mocked(getMyProfile).mockResolvedValue({
      id: "1",
      fullName: "Local Admin",
      email: "admin@example.com",
      phone: "0800000000",
      role: "admin",
    });
    render(<ProfileCard />);
    expect(await screen.findByText("Local Admin")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /บันทึก/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
