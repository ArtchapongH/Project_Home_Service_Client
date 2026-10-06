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
import { hasValidCoordinates, readBrowserLocation, reverseGeocodeAddress } from "@/utils/technicianLocation";

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
  const [locationRevision, setLocationRevision] = useState(0);
  const requestGeneration = useRef(0);
  const locationInFlight = useRef(false);
  const attemptedInitialLocation = useRef(false);
  const profileRef = useRef(profile);
  const mounted = useRef(false);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestGeneration.current += 1;
    };
  }, []);

  const technicianLatitude = profile?.latitude ?? null;
  const technicianLongitude = profile?.longitude ?? null;
  const hasCoordinates = hasValidCoordinates(technicianLatitude, technicianLongitude);

  const clearRequests = useCallback(() => {
    setRequests([]);
    setRequestCount(0);
    setIsLoadingRequests(false);
  }, [setRequestCount]);

  const loadRequests = useCallback(async () => {
    const generation = ++requestGeneration.current;
    if (!profile?.isAvailable || !hasCoordinates || technicianLatitude === null || technicianLongitude === null) {
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

      if (!mounted.current || generation !== requestGeneration.current) return;
      setRequests(result.data);
      setRequestCount(result.meta.total);
    } catch (requestError) {
      if (!mounted.current || generation !== requestGeneration.current) return;
      setErrorMessage(getTechnicianApiError(requestError).message);
    } finally {
      if (mounted.current && generation === requestGeneration.current) setIsLoadingRequests(false);
    }
  }, [
    clearRequests,
    hasCoordinates,
    profile?.isAvailable,
    searchText,
    selectedServiceId,
    setRequestCount,
    technicianLatitude,
    technicianLongitude,
  ]);
  const loadRequestsRef = useRef(loadRequests);
  useEffect(() => {
    loadRequestsRef.current = loadRequests;
  }, [loadRequests]);

  // หน่วงการค้นหาเล็กน้อย เพื่อไม่ยิง API ทุกครั้งที่พิมพ์หนึ่งตัวอักษร
  useEffect(() => {
    const timeoutId = window.setTimeout(() => void loadRequests(), SEARCH_DEBOUNCE_MS);
    return () => {
      window.clearTimeout(timeoutId);
      requestGeneration.current += 1;
    };
  }, [loadRequests, locationRevision]);

  const refreshLocation = useCallback(async () => {
    const currentProfile = profileRef.current;
    if (!currentProfile || locationInFlight.current) return;
    locationInFlight.current = true;
    setIsUpdatingLocation(true);
    setLocationMessage(null);

    try {
      const coordinates = await readBrowserLocation();
      const address = await reverseGeocodeAddress(coordinates.latitude, coordinates.longitude);
      if (!mounted.current || profileRef.current?.technicianId !== currentProfile.technicianId) return;
      const location = await updateTechnicianLocation({ ...coordinates, address });
      const latestProfile = profileRef.current;
      if (!mounted.current || latestProfile?.technicianId !== currentProfile.technicianId) return;
      if (!hasValidCoordinates(location.latitude, location.longitude)) {
        throw new Error("ข้อมูลพิกัดที่บันทึกไม่ถูกต้อง กรุณาลองใหม่");
      }
      requestGeneration.current += 1;
      setRequests([]);
      setRequestCount(0);
      setIsLoadingRequests(true);
      setProfile({ ...latestProfile, ...location, address: location.address ?? address });
      setLocationRevision((revision) => revision + 1);
      setLocationMessage("บันทึกพิกัดและที่อยู่ปัจจุบันแล้ว");
    } catch (locationError) {
      if (!mounted.current) return;
      const saved = profileRef.current;
      const fallback = hasValidCoordinates(saved?.latitude, saved?.longitude)
        ? "กำลังใช้ตำแหน่งที่บันทึกไว้"
        : "ยังไม่มีพิกัด กรุณากดรีเฟรชเพื่อลองใหม่";
      setLocationMessage(`${getTechnicianApiError(locationError).message} — ${fallback}`);
    } finally {
      locationInFlight.current = false;
      if (mounted.current) setIsUpdatingLocation(false);
    }
  }, [setProfile, setRequestCount]);

  useEffect(() => {
    if (!profile?.isAvailable || attemptedInitialLocation.current) return;
    attemptedInitialLocation.current = true;
    void refreshLocation();
  }, [profile?.isAvailable, refreshLocation]);

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
      await loadRequestsRef.current();
    } catch (requestError) {
      const apiError = getTechnicianApiError(requestError);
      const message =
        apiError.code === "ORDER_ALREADY_ASSIGNED"
          ? "มีช่างคนอื่นรับงานนี้แล้ว รายการถูกรีเฟรชแล้ว"
          : apiError.message;

      setSelectedRequest(null);
      await loadRequestsRef.current();
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
      await loadRequestsRef.current();
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
