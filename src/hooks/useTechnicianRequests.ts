"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTechnician } from "@/contexts/TechnicianContext";
import {
  acceptTechnicianRequest,
  declineTechnicianRequest,
  getTechnicianApiError,
  getTechnicianRequests,
  updateTechnicianLocation,
} from "@/services/technicianApi";
import type { TechnicianJob, TechnicianProfile } from "@/types/technician";
import { readBrowserLocation } from "@/utils/technicianLocation";

const SEARCH_DEBOUNCE_MS = 250;

export interface UseTechnicianRequestsResult {
  profile: TechnicianProfile | null;
  requests: TechnicianJob[];
  searchText: string;
  setSearchText: (value: string) => void;
  selectedServiceId: string;
  setSelectedServiceId: (value: string) => void;
  isLoadingRequests: boolean;
  activeRequestId: string | null;
  selectedRequest: TechnicianJob | null;
  errorMessage: string | null;
  successMessage: string | null;
  isUpdatingLocation: boolean;
  locationMessage: string | null;
  hasCoordinates: boolean;
  refreshLocation: () => Promise<void>;
  selectRequestToAccept: (request: TechnicianJob) => void;
  closeAcceptDialog: () => void;
  confirmAcceptRequest: () => Promise<void>;
  declineRequest: (request: TechnicianJob) => Promise<void>;
}

export function useTechnicianRequests(): UseTechnicianRequestsResult {
  const { profile, setProfile, setRequestCount } = useTechnician();
  const [requests, setRequests] = useState<TechnicianJob[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<TechnicianJob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const didAutoLocate = useRef(false);

  const technicianLatitude = profile?.latitude ?? null;
  const technicianLongitude = profile?.longitude ?? null;
  const hasCoordinates = technicianLatitude !== null && technicianLongitude !== null;

  const clearRequests = useCallback(() => {
    setRequests([]);
    setRequestCount(0);
    setIsLoadingRequests(false);
  }, [setRequestCount]);

  const loadRequests = useCallback(async () => {
    if (!profile?.isAvailable || technicianLatitude === null || technicianLongitude === null) {
      clearRequests();
      return;
    }

    setIsLoadingRequests(true);
    setErrorMessage(null);

    try {
      const result = await getTechnicianRequests({
        serviceId: selectedServiceId || undefined,
        search: searchText || undefined,
        latitude: technicianLatitude,
        longitude: technicianLongitude,
      });

      setRequests(result.data);
      setRequestCount(result.meta.total);
    } catch (requestError) {
      setErrorMessage(getTechnicianApiError(requestError).message);
    } finally {
      setIsLoadingRequests(false);
    }
  }, [
    clearRequests,
    profile?.isAvailable,
    searchText,
    selectedServiceId,
    setRequestCount,
    technicianLatitude,
    technicianLongitude,
  ]);

  // หน่วงการค้นหาเล็กน้อย เพื่อไม่ยิง API ทุกครั้งที่พิมพ์หนึ่งตัวอักษร
  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadRequests(), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [loadRequests]);

  const refreshLocation = useCallback(async () => {
    if (!profile) return;

    setIsUpdatingLocation(true);
    setLocationMessage(null);

    try {
      const coordinates = await readBrowserLocation();
      const updatedLocation = await updateTechnicianLocation(coordinates);
      setProfile({ ...profile, ...updatedLocation });
    } catch (locationError) {
      setLocationMessage(
        locationError instanceof Error
          ? locationError.message
          : "ไม่สามารถอัปเดตตำแหน่งได้",
      );
    } finally {
      setIsUpdatingLocation(false);
    }
  }, [profile, setProfile]);

  // ขอ Location อัตโนมัติเพียงครั้งแรก เมื่อช่างพร้อมรับงานแต่ยังไม่มีพิกัด
  useEffect(() => {
    if (!profile?.isAvailable || didAutoLocate.current || hasCoordinates) return;

    didAutoLocate.current = true;
    void refreshLocation();
  }, [hasCoordinates, profile?.isAvailable, refreshLocation]);

  const selectRequestToAccept = (request: TechnicianJob): void => {
    setSelectedRequest(request);
  };

  const closeAcceptDialog = (): void => {
    setSelectedRequest(null);
  };

  const confirmAcceptRequest = async (): Promise<void> => {
    if (!selectedRequest) return;

    setActiveRequestId(selectedRequest.orderId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await acceptTechnicianRequest(selectedRequest.orderId);
      setSelectedRequest(null);
      setSuccessMessage(`รับงาน ${selectedRequest.orderCode} เรียบร้อยแล้ว`);
      await loadRequests();
    } catch (requestError) {
      const apiError = getTechnicianApiError(requestError);
      const message =
        apiError.code === "ORDER_ALREADY_ASSIGNED"
          ? "มีช่างคนอื่นรับงานนี้แล้ว รายการถูกรีเฟรชแล้ว"
          : apiError.message;

      setSelectedRequest(null);
      await loadRequests();
      setErrorMessage(message);
    } finally {
      setActiveRequestId(null);
    }
  };

  const declineRequest = async (request: TechnicianJob): Promise<void> => {
    setActiveRequestId(request.orderId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await declineTechnicianRequest(request.orderId);
      setSuccessMessage(`ปฏิเสธงาน ${request.orderCode} เรียบร้อยแล้ว`);
      await loadRequests();
    } catch (requestError) {
      setErrorMessage(getTechnicianApiError(requestError).message);
    } finally {
      setActiveRequestId(null);
    }
  };

  return {
    profile,
    requests,
    searchText,
    setSearchText,
    selectedServiceId,
    setSelectedServiceId,
    isLoadingRequests,
    activeRequestId,
    selectedRequest,
    errorMessage,
    successMessage,
    isUpdatingLocation,
    locationMessage,
    hasCoordinates,
    refreshLocation,
    selectRequestToAccept,
    closeAcceptDialog,
    confirmAcceptRequest,
    declineRequest,
  };
}
