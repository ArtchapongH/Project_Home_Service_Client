import { describe, expect, it } from "vitest";
import { getChatbotError } from "@/services/chatbotApi";

describe("getChatbotError", () => {
  it("returns the rate-limited message when the backend reports CHAT_RATE_LIMITED", () => {
    const error = { response: { data: { code: "CHAT_RATE_LIMITED", message: "throttled" } } };
    expect(getChatbotError(error, "fallback", "wait a moment")).toBe("wait a moment");
  });

  it("falls back to the generic message for other errors", () => {
    expect(getChatbotError(new Error("boom"), "fallback")).toBe("fallback");
  });
});
