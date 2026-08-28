import { describe, expect, it } from "vitest";
import { formatThaiServiceDate, formatThaiServiceTime, normalizeClockTime } from "@/utils/serviceSchedule";

describe("normalizeClockTime", () => {
  it("keeps hours and minutes from a time input", () => {
    expect(normalizeClockTime("10:52")).toBe("10:52");
    expect(normalizeClockTime("10:52:00")).toBe("10:52");
  });
});

describe("formatThaiServiceTime", () => {
  it("shows the selected clock time without timezone shift", () => {
    expect(formatThaiServiceTime("10:52")).toBe("10.52 น.");
    expect(formatThaiServiceTime("17:52:00")).toBe("17.52 น.");
  });

  it("shows Bangkok time when the value is UTC ISO", () => {
    expect(formatThaiServiceTime("2026-08-28T03:52:00.000Z")).toBe("10.52 น.");
  });
});

describe("formatThaiServiceDate", () => {
  it("formats a date-only value in Buddhist calendar", () => {
    expect(formatThaiServiceDate("2026-08-28")).toBe("28 ส.ค. 2569");
  });
});
