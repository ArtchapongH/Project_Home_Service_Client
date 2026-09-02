import axios from "axios";
import apiClient from "./apiClient";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import type {
  PublicCategory,
  PublicService,
  PublicServiceDetail,
  PublicServiceOptionRow,
} from "../types/public-service";

interface ApiResponse<T> {
  data: T;
  message: string;
}

type PublicServiceOptionDto = {
  service_id?: string | number;
  service_name?: string;
  option_id?: string | number;
  id?: string | number;
  option_name?: string;
  name?: string;
  price?: number | string;
  unit?: string;
};

function resolveLocale(locale?: string): Locale {
  return isLocale(locale) ? locale : defaultLocale;
}

function localeParams(locale?: string): { locale: Locale } {
  return { locale: resolveLocale(locale) };
}

function toPublicCategory(item: PublicCategory): PublicCategory {
  return {
    id: String(item.id),
    name: item.name,
  };
}

function toPublicService<T extends PublicService>(item: T): T {
  return {
    ...item,
    id: String(item.id),
    categoryId: String(item.categoryId ?? ""),
  };
}

export function isCanceledRequest(error: unknown): boolean {
  return axios.isAxiosError(error) && error.code === "ERR_CANCELED";
}

export async function getPublicCategories(
  locale?: string,
  signal?: AbortSignal,
): Promise<PublicCategory[]> {
  const response = await apiClient.get<ApiResponse<PublicCategory[]>>(
    "/api/categories",
    {
      params: localeParams(locale),
      signal,
    },
  );
  return (response.data.data ?? []).map(toPublicCategory);
}

export async function getPublicServices(options?: {
  featured?: boolean;
  limit?: number;
  locale?: string;
  signal?: AbortSignal;
}): Promise<PublicService[]> {
  const response = await apiClient.get<ApiResponse<PublicService[]>>(
    "/api/services",
    {
      params: {
        ...localeParams(options?.locale),
        featured: options?.featured ? "true" : undefined,
        limit: options?.limit,
      },
      signal: options?.signal,
    },
  );
  return (response.data.data ?? []).map(toPublicService);
}

export async function getPublicService(
  serviceId: string,
  locale?: string,
  signal?: AbortSignal,
): Promise<PublicServiceDetail> {
  const response = await apiClient.get<ApiResponse<PublicServiceDetail>>(
    `/api/services/${serviceId}`,
    {
      params: localeParams(locale),
      signal,
    },
  );
  const data = response.data.data;
  if (!data) {
    throw new Error("ไม่พบข้อมูลบริการ");
  }
  return toPublicService(data);
}

function unwrapOptionList(payload: unknown): PublicServiceOptionDto[] {
  if (Array.isArray(payload)) return payload as PublicServiceOptionDto[];
  if (payload && typeof payload === "object") {
    const record = payload as { data?: unknown; options?: unknown };
    if (Array.isArray(record.data)) return record.data as PublicServiceOptionDto[];
    if (Array.isArray(record.options)) return record.options as PublicServiceOptionDto[];
  }
  return [];
}

function toPublicServiceOptionRow(item: PublicServiceOptionDto): PublicServiceOptionRow {
  return {
    service_id: String(item.service_id ?? "0"),
    service_name: item.service_name ?? "",
    option_id: String(item.option_id ?? item.id ?? "0"),
    option_name: item.option_name || item.name || "",
    price: Number(item.price) || 0,
    unit: item.unit ?? "",
  };
}

export async function getPublicServiceOptions(
  serviceId: string,
  locale?: string,
  signal?: AbortSignal,
): Promise<PublicServiceOptionRow[]> {
  const response = await apiClient.get<unknown>(`/api/services/options/${serviceId}`, {
    params: localeParams(locale),
    signal,
  });
  return unwrapOptionList(response.data).map(toPublicServiceOptionRow);
}

export function getApiErrorMessage(error: unknown): string {
  if (isCanceledRequest(error)) {
    return "";
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}
