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

// Request Interceptor: แนบ Bearer Token จาก localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // หากไม่มี token และมี devUserId ให้ใส่ dev header (ถ้าเปิดใช้งาน)
    const devUserId = process.env.NEXT_PUBLIC_DEV_USER_ID;
    if (devUserId && config.headers && !config.headers.Authorization) {
      config.headers["x-user-id"] = devUserId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: จัดการ Error และล้าง Token เมื่อได้ 401 Unauthorized
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && typeof window !== "undefined") {
        // ล้าง token หากเซสชันหมดอายุ
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("user");
      }
      return Promise.reject(error.response.data || error.response.statusText);
    } else if (error.request) {
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
