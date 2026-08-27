import apiClient from "@/services/apiClient";
import {
  acceptMockTechnicianRequest,
  declineMockTechnicianRequest,
  getMockTechnicianJob,
  getMockTechnicianJobs,
  getMockTechnicianRequests,
} from "@/mocks/technicianRequests";
import type {
  ApiListMeta,
  TechnicianJob,
  TechnicianListFilters,
  TechnicianLocationInput,
  TechnicianProfile,
  TechnicianSettingsInput,
} from "@/types/technician";

interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: ApiListMeta;
}

export const isTechnicianMockEnabled =
  process.env.NEXT_PUBLIC_USE_TECHNICIAN_MOCKS === "true";

export async function getTechnicianProfile(): Promise<TechnicianProfile> {
  const response = await apiClient.get<ApiResponse<TechnicianProfile>>("/api/technicians/me");
  return response.data.data;
}

export async function updateTechnicianSettings(
  input: TechnicianSettingsInput,
): Promise<TechnicianProfile> {
  const response = await apiClient.patch<ApiResponse<TechnicianProfile>>(
    "/api/technicians/me/settings",
    input,
  );
  return response.data.data;
}

export async function updateTechnicianLocation(
  input: TechnicianLocationInput,
): Promise<Pick<TechnicianProfile, "latitude" | "longitude" | "locationUpdatedAt" | "address">> {
  if (isTechnicianMockEnabled) {
    return {
      latitude: input.latitude,
      longitude: input.longitude,
      locationUpdatedAt: new Date().toISOString(),
      address: input.address ?? null,
    };
  }


  const response = await apiClient.patch<
    ApiResponse<
      Pick<TechnicianProfile, "latitude" | "longitude" | "locationUpdatedAt" | "address">
    >
  >("/api/technicians/me/location", input);
  return response.data.data;
}

export async function getTechnicianRequests(
  filters: TechnicianListFilters = {},
): Promise<{ data: TechnicianJob[]; meta: ApiListMeta }> {
  if (isTechnicianMockEnabled) return getMockTechnicianRequests(filters);

  const response = await apiClient.get<ApiResponse<TechnicianJob[]>>(
    "/api/technicians/me/requests",
    { params: filters },
  );
  return { data: response.data.data, meta: response.data.meta ?? { total: 0 } };
}

export async function acceptTechnicianRequest(orderId: string): Promise<TechnicianJob> {
  if (isTechnicianMockEnabled) return acceptMockTechnicianRequest(orderId);

  const response = await apiClient.post<ApiResponse<TechnicianJob>>(
    `/api/technicians/me/requests/${orderId}/accept`,
  );
  return response.data.data;
}

export async function declineTechnicianRequest(orderId: string): Promise<void> {
  if (isTechnicianMockEnabled) return declineMockTechnicianRequest(orderId);

  await apiClient.post(`/api/technicians/me/requests/${orderId}/decline`);
}

export async function getTechnicianJobs(
  filters: TechnicianListFilters = {},
): Promise<{ data: TechnicianJob[]; meta: ApiListMeta }> {
  if (isTechnicianMockEnabled) return getMockTechnicianJobs(filters);

  const response = await apiClient.get<ApiResponse<TechnicianJob[]>>(
    "/api/technicians/me/jobs",
    { params: filters },
  );
  return { data: response.data.data, meta: response.data.meta ?? { total: 0 } };
}

export async function getTechnicianJob(assignmentId: string): Promise<TechnicianJob> {
  if (isTechnicianMockEnabled) return getMockTechnicianJob(assignmentId);

  const response = await apiClient.get<ApiResponse<TechnicianJob>>(
    `/api/technicians/me/jobs/${assignmentId}`,
  );
  return response.data.data;
}

export function getTechnicianApiError(error: unknown): { message: string; code?: string } {
  if (typeof error === "object" && error !== null) {
    const responseData =
      "response" in error &&
      typeof error.response === "object" &&
      error.response !== null &&
      "data" in error.response &&
      typeof error.response.data === "object" &&
      error.response.data !== null
        ? error.response.data
        : null;

    return {
      message:
        responseData && "message" in responseData
          ? String(responseData.message)
          : "message" in error
            ? String(error.message)
            : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      code:
        responseData && "code" in responseData
          ? String(responseData.code)
          : "code" in error
            ? String(error.code)
            : undefined,
    };
  }
  return { message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
}
