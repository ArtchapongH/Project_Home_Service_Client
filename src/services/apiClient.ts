import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach dev user header or auth tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const devUserId = process.env.NEXT_PUBLIC_DEV_USER_ID;
    if (devUserId && config.headers) {
      config.headers["x-user-id"] = devUserId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors consistently
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      // Backend responded with non-2xx status code
      return Promise.reject(error.response.data || error.response.statusText);
    } else if (error.request) {
      // Request was sent but no response received (Network Error / Backend Down)
      return Promise.reject({
        message: "ไม่สามารถเชื่อมต่อกับ Backend Server ได้ (Network Error)",
        code: "NETWORK_ERROR",
      });
    }
    return Promise.reject({
      message: error.message || "เกิดข้อผิดพลาดไม่ทราบสาเหตุ",
      code: "UNKNOWN_ERROR",
    });
  }
);

export default apiClient;
