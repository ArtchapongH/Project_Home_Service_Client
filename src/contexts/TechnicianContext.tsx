"use client";

import { createContext, type ReactNode, useCallback, useContext, useState } from "react";
import { getTechnicianProfile } from "@/services/technicianApi";
import type { TechnicianProfile } from "@/types/technician";

interface TechnicianContextValue {
  profile: TechnicianProfile | null;
  isLoading: boolean;
  error: string | null;
  requestCount: number;
  setProfile: (profile: TechnicianProfile) => void;
  setRequestCount: (count: number) => void;
  loadProfile: () => Promise<TechnicianProfile | null>;
}

const TechnicianContext = createContext<TechnicianContextValue | null>(null);

export function TechnicianProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<TechnicianProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestCount, setRequestCount] = useState(0);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextProfile = await getTechnicianProfile();
      setProfile(nextProfile);
      return nextProfile;
    } catch {
      setProfile(null);
      setError("บัญชีนี้ยังไม่ได้ลงทะเบียนเป็นช่าง");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <TechnicianContext.Provider
      value={{
        profile,
        isLoading,
        error,
        requestCount,
        setProfile,
        setRequestCount,
        loadProfile,
      }}
    >
      {children}
    </TechnicianContext.Provider>
  );
}

export function useTechnician(): TechnicianContextValue {
  const context = useContext(TechnicianContext);
  if (!context) throw new Error("useTechnician must be used within TechnicianProvider");
  return context;
}
