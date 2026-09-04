export type PlaceOption = {
  id?: number;
  nameTh?: string;
  nameEn?: string;
  name_th?: string;
  name_en?: string;
};

export type ResolvedServiceLocation = {
  latitude: number;
  longitude: number;
  streetAddress: string;
  provinceHints: string[];
  districtHints: string[];
  subdistrictHints: string[];
};

export type AdminPlace = {
  id: number;
  nameTh: string;
  nameEn: string;
};

type NominatimAddress = {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  neighbourhood?: string;
  suburb?: string;
  quarter?: string;
  village?: string;
  hamlet?: string;
  city_district?: string;
  district?: string;
  county?: string;
  city?: string;
  town?: string;
  municipality?: string;
  state?: string;
  province?: string;
};

type NominatimReverseResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

export function normalizeThaiPlaceName(value: string): string {
  return value
    .normalize("NFC")
    .trim()
    .replace(/^(จังหวัด|เขต|อำเภอ|แขวง|ตำบล)\s*/u, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

function optionLabel(option: PlaceOption): string {
  return option.nameTh || option.name_th || "";
}

function optionSearchNames(option: PlaceOption): string[] {
  return [option.nameTh, option.name_th, option.nameEn, option.name_en].filter(
    (name): name is string => Boolean(name),
  );
}

export function matchPlaceName(options: PlaceOption[], hints: string[]): string | null {
  const normalizedHints = hints.map(normalizeThaiPlaceName).filter(Boolean);
  if (normalizedHints.length === 0 || options.length === 0) return null;

  for (const option of options) {
    const optionNames = optionSearchNames(option).map(normalizeThaiPlaceName);
    if (optionNames.some((name) => normalizedHints.includes(name))) {
      return optionLabel(option);
    }
  }

  for (const option of options) {
    const optionNames = optionSearchNames(option).map(normalizeThaiPlaceName);
    if (
      optionNames.some((name) =>
        normalizedHints.some((hint) => name.length >= 3 && hint.length >= 3 && (name.includes(hint) || hint.includes(name))),
      )
    ) {
      return optionLabel(option);
    }
  }

  return null;
}

function uniqueHints(values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const hints: string[] = [];

  for (const value of values) {
    const trimmed = value?.trim();
    if (!trimmed) continue;
    if (/^\d{4,}$/.test(trimmed) || trimmed === "ประเทศไทย" || /^thailand$/i.test(trimmed)) continue;
    const key = normalizeThaiPlaceName(trimmed);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    hints.push(trimmed);
  }

  return hints;
}

function displayNameParts(displayName: string): string[] {
  return displayName
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function streetAddressFromNominatim(address: NominatimAddress | undefined, displayName: string): string {
  const street = [address?.house_number, address?.road || address?.pedestrian]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (street) return street;

  const firstPart = displayName.split(",")[0]?.trim();
  if (firstPart) return firstPart;

  const local = address?.neighbourhood || address?.suburb || address?.quarter;
  if (local) return local;

  return displayName.trim();
}

export function resolvedLocationFromNominatim(
  latitude: number,
  longitude: number,
  payload: NominatimReverseResponse,
): ResolvedServiceLocation {
  const address = payload.address;
  const displayName = typeof payload.display_name === "string" ? payload.display_name : "";
  const parts = displayNameParts(displayName);

  return {
    latitude,
    longitude,
    streetAddress: streetAddressFromNominatim(address, displayName),
    provinceHints: uniqueHints([address?.state, address?.province, address?.city, ...parts]),
    districtHints: uniqueHints([
      address?.city_district,
      address?.district,
      address?.county,
      address?.city,
      address?.town,
      address?.municipality,
      ...parts,
    ]),
    subdistrictHints: uniqueHints([
      address?.suburb,
      address?.quarter,
      address?.neighbourhood,
      address?.village,
      address?.hamlet,
      ...parts,
    ]),
  };
}

export function extractGeoList(payload: unknown): unknown[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  if (typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (obj.data && typeof obj.data === "object") {
      const nested = extractGeoList(obj.data);
      if (nested.length > 0) return nested;
    }
    if (Array.isArray(obj.value)) return obj.value;
    if (obj.value && typeof obj.value === "object") {
      const nested = extractGeoList(obj.value);
      if (nested.length > 0) return nested;
    }
    for (const key of ["districts", "subdistricts", "provinces"]) {
      if (Array.isArray(obj[key])) return obj[key] as unknown[];
    }
  }

  return [];
}

export function normalizeAdminPlace(item: unknown): AdminPlace | null {
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  const id = Number(record.id ?? record.provinceId ?? record.districtId ?? record.subdistrictId ?? record.subDistrictId);
  const nameTh = String(record.nameTh ?? record.name_th ?? record.name ?? "").trim();
  if (!Number.isFinite(id) || id <= 0 || !nameTh) return null;

  return {
    id,
    nameTh,
    nameEn: String(record.nameEn ?? record.name_en ?? ""),
  };
}

export function normalizeAdminPlaces(payload: unknown): AdminPlace[] {
  return extractGeoList(payload)
    .map(normalizeAdminPlace)
    .filter((place): place is AdminPlace => place !== null);
}

export async function reverseGeocodeServiceLocation(
  latitude: number,
  longitude: number,
): Promise<ResolvedServiceLocation> {
  const params = new URLSearchParams({
    format: "jsonv2",
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: "1",
    "accept-language": "th",
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("ค้นหาที่อยู่จากแผนที่ไม่สำเร็จ");
  }

  const payload = (await response.json()) as NominatimReverseResponse;
  return resolvedLocationFromNominatim(latitude, longitude, payload);
}
