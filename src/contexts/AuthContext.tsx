"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import apiClient from "@/services/apiClient";
import { getAuthErrorMessage } from "@/utils/getAuthErrorMessage";


export interface User {
  id: string | number;
  email: string;
  fullName: string;
  phone?: string | null;
  address?: string | null;
  avatarUrl?: string | null;
  role: "USER" | "ADMIN" | "TECHNICIAN" | string;
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
  requiresEmailConfirmation?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isTechnician: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


function getAccessToken(data: unknown): string | null {
  if (typeof data !== "object" || data === null || !("session" in data)) {
    return null;
  }

  const session = data.session;
  if (typeof session !== "object" || session === null) {
    return null;
  }

  const accessToken = "accessToken" in session ? session.accessToken : null;
  return typeof accessToken === "string" && accessToken ? accessToken : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const registerRequestRef = useRef<Promise<AuthResult> | null>(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  }, []);

  const fetchCurrentUser = useCallback(async (): Promise<User | null> => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return null;
    }

    try {
      setToken(savedToken);
      const response = await apiClient.get<{ data: User }>("/api/users/me");
      const profile = response.data.data;
      setUser(profile);
      localStorage.setItem("user", JSON.stringify(profile));
      return profile;
    } catch {
      clearSession();
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCurrentUser();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchCurrentUser]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await apiClient.post("/auth/login", { email, password });
      const accessToken = getAccessToken(response.data?.data);
      if (!accessToken) {
        return {
          success: false,
          error: "ไม่สามารถเข้าสู่ระบบได้ กรุณาลองใหม่อีกครั้ง",
        };
      }

      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      const profile = await fetchCurrentUser();

      if (!profile) {
        return {
          success: false,
          error: "เข้าสู่ระบบแล้ว แต่ยังโหลดข้อมูลผู้ใช้ไม่ได้ กรุณาลองใหม่อีกครั้ง",
        };
      }

      return { success: true, user: profile };
    } catch (error: unknown) {
      return { success: false, error: getAuthErrorMessage(error, "login") };
    }
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    if (registerRequestRef.current) {
      return registerRequestRef.current;
    }

    const request = (async (): Promise<AuthResult> => {
      try {
        const response = await apiClient.post("/auth/register", data);
        const responseData = response.data?.data;
        const accessToken = getAccessToken(responseData);
        const registeredUser = responseData?.user as User | undefined;
        const requiresEmailConfirmation = Boolean(
          responseData?.requiresEmailConfirmation,
        );

        if (!accessToken) {
          return {
            success: true,
            user: registeredUser,
            requiresEmailConfirmation,
          };
        }

        localStorage.setItem("token", accessToken);
        setToken(accessToken);
        const profile = await fetchCurrentUser();
        return profile
          ? { success: true, user: profile }
          : {
              success: false,
              error:
                "ลงทะเบียนแล้ว แต่ยังเข้าสู่ระบบไม่ได้ กรุณาลองเข้าสู่ระบบอีกครั้ง",
            };
      } catch (error: unknown) {
        return { success: false, error: getAuthErrorMessage(error, "register") };
      }
    })();

    registerRequestRef.current = request;

    try {
      return await request;
    } finally {
      registerRequestRef.current = null;
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // The browser session is still cleared even when the server is unavailable.
    } finally {
      clearSession();
    }
  };

  const isAuthenticated = !!user;
  const userRole = user?.role?.toUpperCase() ?? "";
  const isAdmin = userRole === "ADMIN";
  const isTechnician = userRole === "TECHNICIAN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        isAdmin,
        isTechnician,
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
