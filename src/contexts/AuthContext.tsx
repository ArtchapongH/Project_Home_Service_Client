"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import apiClient from "@/services/apiClient";

export interface User {
  id: string | number;
  email: string;
  fullName: string;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN" | string;
}

interface RegisterData {
  fullName: string;
  phone?: string;
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ดึงข้อมูลผู้ใช้ปัจจุบันเมื่อโหลดหน้าเว็บ
  const fetchCurrentUser = async () => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      const response = await apiClient.get("/user/me");
      if (response.data?.data) {
        setUser(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
      }
    } catch {
      // Token หมดอายุหรือไม่ถูกต้อง
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // ฟังก์ชัน Login
  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const data = response.data?.data;
      const accessToken = data?.session?.accessToken || data?.session?.access_token;
      const userProfile = data?.user;

      if (accessToken && userProfile) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userProfile));
        setToken(accessToken);
        setUser(userProfile);
        return { success: true, user: userProfile };
      }

      return { success: false, error: "ไม่พบข้อมูล Token จากเซิร์ฟเวอร์" };
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      return { success: false, error: errorMsg };
    }
  };

  // ฟังก์ชัน Register
  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      const response = await apiClient.post("/auth/register", data);
      const resData = response.data?.data;
      const accessToken = resData?.session?.access_token || resData?.session?.accessToken;
      const userProfile = resData?.user;

      if (accessToken && userProfile) {
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(userProfile));
        setToken(accessToken);
        setUser(userProfile);
      }

      return { success: true, user: userProfile };
    } catch (err: unknown) {
      const errorMsg =
        typeof err === "object" && err !== null && "message" in err
          ? (err as { message: string }).message
          : "เกิดข้อผิดพลาดในการลงทะเบียน";
      return { success: false, error: errorMsg };
    }
  };

  // ฟังก์ชัน Logout
  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Ignored
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setToken(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
