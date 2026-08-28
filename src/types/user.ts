export interface UserProfile {
  id: string;
  fullName: string;
  displayName?: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  displayName?: string;
  firstName?: string | null;
  lastName?: string | null;
  email: string;
  phone: string | null;
  address?: string | null;
  avatarUrl: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}
