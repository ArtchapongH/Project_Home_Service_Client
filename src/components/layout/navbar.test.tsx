import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Navbar } from "./navbar";

const push = vi.fn();
const logout = vi.fn();
let authState = {
  user: null as {
    fullName: string;
    email: string;
    avatarUrl: string | null;
    role: string;
  } | null,
  isAuthenticated: false,
  isAdmin: false,
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/",
}));
vi.mock("next/image", () => ({ default: (props: { alt: string }) => <span aria-label={props.alt} /> }));
vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({ ...authState, logout }),
}));

describe("Navbar", () => {
  it("shows login and registration links for guests", () => {
    authState = { user: null, isAuthenticated: false, isAdmin: false };

    render(<Navbar />);

    expect(screen.getByRole("link", { name: "เข้าสู่ระบบ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "ลงทะเบียน" })).toBeInTheDocument();
    expect(screen.queryByLabelText("เปิดหน้าโปรไฟล์")).not.toBeInTheDocument();
  });

  it("shows the authenticated user's name and avatar", () => {
    authState = {
      user: {
        fullName: "Somchai Jaidee",
        email: "somchai@example.com",
        avatarUrl: "https://example.com/avatar.jpg",
        role: "USER",
      },
      isAuthenticated: true,
      isAdmin: false,
    };

    render(<Navbar />);

    expect(screen.getByLabelText("เปิดหน้าโปรไฟล์")).toHaveTextContent("Somchai Jaidee");
    expect(screen.getByRole("img", { name: "รูปโปรไฟล์ของ Somchai Jaidee" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ออกจากระบบ" })).toBeInTheDocument();
  });
});
