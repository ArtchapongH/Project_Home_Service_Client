import apiClient from "./apiClient";
import { UserProfile, ApiResponse } from "../types/user";

/**
 * Fetch current logged-in user profile
 */
export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiClient.get<ApiResponse<UserProfile>>("/api/users/me");
  return response.data.data;
}
