import { describe, expect, it } from "vitest";
import { getDirectionsUrl } from "@/utils/technician";

describe("getDirectionsUrl", () => {
  it("prefers coordinates when available", () => {
    expect(getDirectionsUrl({ latitude: 13.7563, longitude: 100.5018, address: "Bangkok" }))
      .toContain("destination=13.7563%2C100.5018");
  });

  it("falls back to an encoded address", () => {
    expect(getDirectionsUrl({ latitude: null, longitude: null, address: "กรุงเทพมหานคร" }))
      .toContain(encodeURIComponent("กรุงเทพมหานคร"));
  });

  it("returns null without a destination", () => {
    expect(getDirectionsUrl({ latitude: null, longitude: null, address: null })).toBeNull();
  });
});
