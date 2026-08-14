import apiClient from "./apiClient";
import type {
  PublicCategory,
  PublicService,
  PublicServiceDetail,
} from "../types/public-service";

interface ApiResponse<T> {
  data: T;
  message: string;
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  const response = await apiClient.get<ApiResponse<PublicCategory[]>>(
    "/api/categories",
  );
  return response.data.data;
}

export async function getPublicServices(options?: {
  featured?: boolean;
  limit?: number;
}): Promise<PublicService[]> {
  const response = await apiClient.get<ApiResponse<PublicService[]>>(
    "/api/services",
    {
      params: {
        featured: options?.featured ? "true" : undefined,
        limit: options?.limit,
      },
    },
  );
  return response.data.data;
}

export async function getPublicService(
  serviceId: string,
): Promise<PublicServiceDetail> {
  const response = await apiClient.get<ApiResponse<PublicServiceDetail>>(
    `/api/services/${serviceId}`,
  );
  return response.data.data;
}

export function getApiErrorMessage(error: unknown): string {
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
