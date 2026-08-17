export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: string;
}

export interface UpdateProfileInput {
  fullName: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}
