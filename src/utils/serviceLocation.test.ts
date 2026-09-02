import { describe, expect, it } from "vitest";
import {
  extractGeoList,
  matchPlaceName,
  normalizeAdminPlaces,
  normalizeThaiPlaceName,
  resolvedLocationFromNominatim,
} from "@/utils/serviceLocation";

describe("normalizeThaiPlaceName", () => {
  it("strips Thai administrative prefixes", () => {
    expect(normalizeThaiPlaceName("เขตจอมทอง")).toBe(normalizeThaiPlaceName("จอมทอง"));
    expect(normalizeThaiPlaceName("แขวงบางขุนเทียน")).toBe(normalizeThaiPlaceName("บางขุนเทียน"));
  });
});

describe("matchPlaceName", () => {
  const provinces = [
    { nameTh: "กรุงเทพมหานคร", nameEn: "Bangkok" },
    { nameTh: "นนทบุรี", nameEn: "Nonthaburi" },
  ];

  it("matches Thai and English names", () => {
    expect(matchPlaceName(provinces, ["Bangkok"])).toBe("กรุงเทพมหานคร");
    expect(matchPlaceName(provinces, ["กรุงเทพมหานคร"])).toBe("กรุงเทพมหานคร");
  });

  it("matches district names with prefixes", () => {
    expect(
      matchPlaceName(
        [
          { nameTh: "เขตจอมทอง" },
          { nameTh: "เขตบางแค" },
        ],
        ["จอมทอง"],
      ),
    ).toBe("เขตจอมทอง");
  });
});

describe("resolvedLocationFromNominatim", () => {
  it("maps OSM address parts into form hints", () => {
    const resolved = resolvedLocationFromNominatim(13.7, 100.46, {
      display_name: "46, ถนนพระรามที่ 2, แขวงบางขุนเทียน, เขตจอมทอง, กรุงเทพมหานคร",
      address: {
        house_number: "46",
        road: "ถนนพระรามที่ 2",
        suburb: "แขวงบางขุนเทียน",
        city_district: "เขตจอมทอง",
        state: "กรุงเทพมหานคร",
      },
    });

    expect(resolved.streetAddress).toBe("46 ถนนพระรามที่ 2");
    expect(resolved.provinceHints).toContain("กรุงเทพมหานคร");
    expect(resolved.districtHints).toContain("เขตจอมทอง");
    expect(resolved.subdistrictHints).toContain("แขวงบางขุนเทียน");
  });

  it("falls back to display_name parts when OSM omits district fields", () => {
    const resolved = resolvedLocationFromNominatim(13.68762, 100.44787, {
      display_name: "ซอยเอกชัย 34, แขวงคลองบางบอน, เขตบางบอน, กรุงเทพมหานคร, 10150, ประเทศไทย",
      address: {
        road: "ซอยเอกชัย 34",
        state: "กรุงเทพมหานคร",
      },
    });

    expect(resolved.streetAddress).toBe("ซอยเอกชัย 34");
    expect(resolved.districtHints).toContain("เขตบางบอน");
    expect(resolved.subdistrictHints).toContain("แขวงคลองบางบอน");
  });
});

describe("normalizeAdminPlaces", () => {
  it("reads nested GeoTH district payloads and name_th fields", () => {
    const places = normalizeAdminPlaces({
      success: true,
      data: {
        provinceId: 10,
        name_th: "กรุงเทพมหานคร",
        districts: [
          { districtId: 101, name_th: "เขตบางบอน" },
          { id: 102, nameTh: "เขตจอมทอง" },
        ],
      },
    });

    expect(extractGeoList({ data: { districts: [{ districtId: 1 }] } })).toHaveLength(1);
    expect(places).toEqual([
      { id: 101, nameTh: "เขตบางบอน", nameEn: "" },
      { id: 102, nameTh: "เขตจอมทอง", nameEn: "" },
    ]);
  });
});
