import apiClient from "./apiClient";
import type {
  ApiResponse,
  ChangePasswordInput,
  UpdateProfileInput,
  UserProfile,
} from "@/types/user";

/**
 * Fetch current logged-in user profile
 */
export async function getMyProfile(): Promise<UserProfile> {
  const response = await apiClient.get<ApiResponse<UserProfile>>("/api/users/me");
  return response.data.data;
}

/**
 * Update editable fields for the current logged-in user.
 */
export async function updateMyProfile(
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const response = await apiClient.patch<ApiResponse<UserProfile>>(
    "/api/users/me",
    input,
  );
  return response.data.data;
}

/**
 * Upload and persist the current user's profile image.
 */
export async function uploadMyAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await apiClient.post<ApiResponse<UserProfile>>(
    "/api/users/me/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
}

/**
 * Change the current logged-in user's password.
 */
export async function changeMyPassword(
  input: ChangePasswordInput,
): Promise<void> {
  await apiClient.patch("/api/users/me/password", input);
}
