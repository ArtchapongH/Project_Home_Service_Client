import { describe, expect, it } from "vitest";
import {
  formatJobItemSummary,
  getDirectionsUrl,
  getDistanceKm,
  isJobWithinRadius,
} from "@/utils/technician";

describe("formatJobItemSummary", () => {
  it("combines the service name with the options the customer selected", () => {
    expect(
      formatJobItemSummary({
        serviceName: "ล้างแอร์",
        items: [
          {
            optionName: "9,000 - 18,000 BTU, ติดผนัง",
            quantity: 2,
            unit: "เครื่อง",
          },
        ],
      }),
    ).toBe("ล้างแอร์ 9,000 - 18,000 BTU, ติดผนัง 2 เครื่อง");
  });

  it("falls back to the service name when there are no items", () => {
    expect(formatJobItemSummary({ serviceName: "ล้างแอร์", items: [] })).toBe("ล้างแอร์");
  });
});

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

describe("job radius", () => {
  it("returns 0 when the technician stands on the job", () => {
    expect(getDistanceKm(13.8285, 100.5596, 13.8285, 100.5596)).toBe(0);
  });

  it("hides jobs farther than 4km and jobs without coordinates", () => {
    expect(isJobWithinRadius(13.8285, 100.5596, 13.8285, 100.5596)).toBe(true);
    expect(isJobWithinRadius(13.8285, 100.5596, 18.7964, 98.9673)).toBe(false);
    expect(isJobWithinRadius(13.8285, 100.5596, null, 100.5596)).toBe(false);
  });
});
