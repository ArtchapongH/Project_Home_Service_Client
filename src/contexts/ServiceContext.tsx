"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  ServiceItem,
  CreateServiceInput,
  UpdateServiceInput,
} from "../types/service";
import { serviceApi } from "../services/serviceApi";

interface ServiceContextType {
  services: ServiceItem[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchServices: (query?: string) => Promise<void>;
  getService: (id: string) => Promise<ServiceItem | null>;
  addService: (input: CreateServiceInput) => Promise<ServiceItem>;
  editService: (id: string, input: UpdateServiceInput) => Promise<ServiceItem | null>;
  removeService: (id: string) => Promise<boolean>;
  reorderServicesList: (newServices: ServiceItem[]) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchServices = useCallback(async (query: string = searchQuery) => {
    setIsLoading(true);
    try {
      const data = await serviceApi.getServices(query);
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchServices(searchQuery);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [searchQuery, fetchServices]);

  const getService = async (id: string): Promise<ServiceItem | null> => {
    return await serviceApi.getServiceById(id);
  };

  const addService = async (input: CreateServiceInput): Promise<ServiceItem> => {
    const created = await serviceApi.createService(input);
    await fetchServices();
    return created;
  };

  const editService = async (
    id: string,
    input: UpdateServiceInput
  ): Promise<ServiceItem | null> => {
    const updated = await serviceApi.updateService(id, input);
    await fetchServices();
    return updated;
  };

  const removeService = async (id: string): Promise<boolean> => {
    const success = await serviceApi.deleteService(id);
    if (success) {
      await fetchServices();
    }
    return success;
  };

  const reorderServicesList = async (newServices: ServiceItem[]) => {
    setServices(newServices);
    await serviceApi.reorderServices(newServices);
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        isLoading,
        searchQuery,
        setSearchQuery,
        fetchServices,
        getService,
        addService,
        editService,
        removeService,
        reorderServicesList,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServiceContext = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error("useServiceContext must be used within a ServiceProvider");
  }
  return context;
};
