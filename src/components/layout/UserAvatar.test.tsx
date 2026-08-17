import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserAvatar } from "./UserAvatar";

describe("UserAvatar", () => {
  it("renders the profile image when an avatar URL is available", () => {
    render(<UserAvatar fullName="Somchai Jaidee" avatarUrl="https://example.com/avatar.jpg" />);

    expect(screen.getByRole("img", { name: "รูปโปรไฟล์ของ Somchai Jaidee" })).toHaveAttribute(
      "src",
      "https://example.com/avatar.jpg",
    );
  });

  it("renders initials when the user has no profile image", () => {
    render(<UserAvatar fullName="Somchai Jaidee" />);

    expect(screen.getByLabelText("อักษรย่อของ Somchai Jaidee")).toHaveTextContent("SJ");
  });

  it("falls back to initials when the profile image cannot load", () => {
    render(<UserAvatar fullName="Somchai Jaidee" avatarUrl="https://example.com/avatar.jpg" />);
    fireEvent.error(screen.getByRole("img"));

    expect(screen.getByLabelText("อักษรย่อของ Somchai Jaidee")).toHaveTextContent("SJ");
  });
});
