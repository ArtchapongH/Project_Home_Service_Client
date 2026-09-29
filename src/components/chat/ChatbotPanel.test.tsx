import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatbotPanel } from "@/components/chat/ChatbotPanel";
import { getChatbotHistory, sendChatbotMessage } from "@/services/chatbotApi";

vi.mock("@/services/chatbotApi", () => ({
  clearChatbotHistory: vi.fn(),
  getChatbotError: (_error: unknown, fallback: string) => fallback,
  getChatbotHistory: vi.fn(),
  sendChatbotMessage: vi.fn(),
}));

const messages = {
  Chatbot: {
    back: "Back",
    title: "HomeService Assistant",
    subtitle: "Service guide",
    clear: "Clear",
    close: "Close",
    welcomeTitle: "Welcome",
    welcomeBody: "Ask about services",
    privacyAuthenticated: "Stored for 90 days",
    privacyGuest: "Cleared on refresh",
    messageLabel: "AI message",
    placeholder: "Ask a question",
    send: "Send",
    thinking: "Thinking",
    recommendedServices: "Recommended services",
    serviceUnavailable: "No longer available",
    retry: "Retry",
    clearConfirm: "Clear history?",
    historyError: "History failed",
    sendError: "Send failed",
    clearError: "Clear failed",
  },
};

function renderPanel(authenticated = false) {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <ChatbotPanel authenticated={authenticated} visible onBack={vi.fn()} onClose={vi.fn()} />
    </NextIntlClientProvider>,
  );
}

describe("ChatbotPanel", () => {
  beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("prevents empty sends and renders a successful guest exchange", async () => {
    vi.mocked(sendChatbotMessage).mockResolvedValue({
      message: "Air-con cleaning starts from the listed service options.",
      conversationId: null,
      serviceLinks: [],
    });
    renderPanel();

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("AI message"), {
      target: { value: "How much is air-con cleaning?" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(screen.getByText("How much is air-con cleaning?")).toBeInTheDocument();
    expect(await screen.findByText("Air-con cleaning starts from the listed service options.")).toBeInTheDocument();
    expect(sendChatbotMessage).toHaveBeenCalledWith(
      expect.objectContaining({ message: "How much is air-con cleaning?", history: [] }),
      expect.any(AbortSignal),
    );
  });

  it("keeps a failed user message and offers retry", async () => {
    vi.mocked(sendChatbotMessage).mockRejectedValue(new Error("offline"));
    renderPanel();
    fireEvent.change(screen.getByLabelText("AI message"), { target: { value: "Find cleaning" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Send failed");
    const firstRequestId = vi.mocked(sendChatbotMessage).mock.calls[0][0].requestId;
    fireEvent.click(screen.getByRole("button", { name: /Retry/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Send failed");
    expect(vi.mocked(sendChatbotMessage).mock.calls[1][0].requestId).toBe(firstRequestId);
    expect(screen.getByText("Find cleaning")).toBeInTheDocument();
  });

  it("shows clickable service links from a reply", async () => {
    vi.mocked(sendChatbotMessage).mockResolvedValue({
      message: "I recommend Air-con cleaning.",
      conversationId: null,
      serviceLinks: [{ id: "12", name: "Air-con cleaning", href: "/service-details/12", available: true }],
    });
    renderPanel();
    fireEvent.change(screen.getByLabelText("AI message"), { target: { value: "Clean my air con" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByRole("link", { name: "Air-con cleaning" })).toHaveAttribute("href", "/service-details/12");
  });

  it("shows unavailable services without a link", async () => {
    vi.mocked(sendChatbotMessage).mockResolvedValue({
      message: "This service was recommended earlier.",
      conversationId: null,
      serviceLinks: [{ id: "12", name: "Air-con cleaning", href: "/service-details/12", available: false }],
    });
    renderPanel();
    fireEvent.change(screen.getByLabelText("AI message"), { target: { value: "Old recommendation" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(await screen.findByText("Air-con cleaning — No longer available")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Air-con cleaning" })).not.toBeInTheDocument();
  });

  it("restores service links from authenticated chat history", async () => {
    vi.mocked(getChatbotHistory).mockResolvedValue({
      conversationId: "4",
      messages: [{
        id: "9",
        role: "assistant",
        content: "I recommend two services.",
        createdAt: "2026-09-29T00:00:00Z",
        serviceLinks: [
          { id: "12", name: "Air-con cleaning", href: "/service-details/12", available: true },
          { id: "13", name: "Air-con repair", href: "/service-details/13", available: false },
        ],
      }],
    });
    renderPanel(true);

    expect(await screen.findByRole("link", { name: "Air-con cleaning" })).toHaveAttribute("href", "/service-details/12");
    expect(screen.getByText("Air-con repair — No longer available")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Air-con repair" })).not.toBeInTheDocument();
  });
});
