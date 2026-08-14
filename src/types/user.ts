export interface UserProfile {
  id?: string;
  user_id?: string;
  name?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: "admin" | "customer";
  avatarUrl?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserProfileInput {
  name?: string;
  fullName?: string;
  full_name?: string;
  phone?: string;
  email?: string;
  address?: string;
  avatarUrl?: string;
  avatar_url?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}
