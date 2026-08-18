import apiClient from "@/services/apiClient";
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
): Promise<Pick<TechnicianProfile, "latitude" | "longitude" | "locationUpdatedAt">> {
  const response = await apiClient.patch<
    ApiResponse<Pick<TechnicianProfile, "latitude" | "longitude" | "locationUpdatedAt">>
  >("/api/technicians/me/location", input);
  return response.data.data;
}

export async function getTechnicianRequests(
  filters: TechnicianListFilters = {},
): Promise<{ data: TechnicianJob[]; meta: ApiListMeta }> {
  const response = await apiClient.get<ApiResponse<TechnicianJob[]>>(
    "/api/technicians/me/requests",
    { params: filters },
  );
  return { data: response.data.data, meta: response.data.meta ?? { total: 0 } };
}

export async function acceptTechnicianRequest(orderId: string): Promise<TechnicianJob> {
  const response = await apiClient.post<ApiResponse<TechnicianJob>>(
    `/api/technicians/me/requests/${orderId}/accept`,
  );
  return response.data.data;
}

export async function declineTechnicianRequest(orderId: string): Promise<void> {
  await apiClient.post(`/api/technicians/me/requests/${orderId}/decline`);
}

export async function getTechnicianJobs(
  filters: TechnicianListFilters = {},
): Promise<{ data: TechnicianJob[]; meta: ApiListMeta }> {
  const response = await apiClient.get<ApiResponse<TechnicianJob[]>>(
    "/api/technicians/me/jobs",
    { params: filters },
  );
  return { data: response.data.data, meta: response.data.meta ?? { total: 0 } };
}

export async function getTechnicianJob(assignmentId: string): Promise<TechnicianJob> {
  const response = await apiClient.get<ApiResponse<TechnicianJob>>(
    `/api/technicians/me/jobs/${assignmentId}`,
  );
  return response.data.data;
}

export function getTechnicianApiError(error: unknown): { message: string; code?: string } {
  if (typeof error === "object" && error !== null) {
    return {
      message: "message" in error ? String(error.message) : "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      code: "code" in error ? String(error.code) : undefined,
    };
  }
  return { message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" };
}
