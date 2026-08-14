import apiClient from "./apiClient";
import { UserProfile, UpdateUserProfileInput, ApiResponse } from "../types/user";

/**
 * Fetch current logged-in user profile
 */
export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiClient.get<ApiResponse<UserProfile>>("/api/users/me");
  return response.data.data;
}

/**
 * Update current logged-in user profile
 */
export async function updateMyProfile(
  profile: UpdateUserProfileInput
): Promise<ApiResponse<UserProfile>> {
  const response = await apiClient.patch<ApiResponse<UserProfile>>("/api/users/me", profile);
  return response.data;
}
