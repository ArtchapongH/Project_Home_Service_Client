import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingChatBubble } from "@/components/chat/FloatingChatBubble";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  pathname: vi.fn(() => "/"),
}));

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: mocks.auth,
}));

vi.mock("next/navigation", () => ({
  usePathname: mocks.pathname,
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/components/chat/ChatbotPanel", () => ({
  ChatbotPanel: () => <div data-testid="ai-panel" />,
}));

vi.mock("@/components/chat/HumanChatPanel", () => ({
  HumanChatPanel: ({ onBack }: { onBack: () => void }) => (
    <button type="button" onClick={onBack}>back</button>
  ),
}));

const user = { id: 1, email: "staff@example.com", fullName: "Staff", role: "ADMIN" };

function renderBubble(role: "ADMIN" | "TECHNICIAN" | "USER") {
  mocks.auth.mockReturnValue({
    user: { ...user, role },
    token: "token",
    isAuthenticated: true,
    isLoading: false,
    isAdmin: role === "ADMIN",
    isTechnician: role === "TECHNICIAN",
  });
  return render(<FloatingChatBubble />);
}

describe("FloatingChatBubble", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.pathname.mockReturnValue("/");
  });

  it.each(["ADMIN", "TECHNICIAN"] as const)("opens Human Chat directly for %s", (role) => {
    renderBubble(role);

    fireEvent.click(screen.getByRole("button", { name: "open" }));

    expect(screen.getByRole("button", { name: "back" })).toBeInTheDocument();
    expect(screen.queryByTestId("ai-panel")).not.toBeInTheDocument();
  });

  it("keeps the AI and Human menu for customers", () => {
    renderBubble("USER");

    fireEvent.click(screen.getByRole("button", { name: "open" }));

    expect(screen.getByText("aiMode")).toBeInTheDocument();
    expect(screen.getByText("humanMode")).toBeInTheDocument();
  });

  it("uses the staff back button to close the bubble", () => {
    renderBubble("TECHNICIAN");

    fireEvent.click(screen.getByRole("button", { name: "open" }));
    fireEvent.click(screen.getByRole("button", { name: "back" }));

    expect(screen.getByRole("button", { name: "open" })).toBeInTheDocument();
  });
});
