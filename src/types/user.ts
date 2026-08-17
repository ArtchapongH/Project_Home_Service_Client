export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code?: string;
}
