import apiClient from "./apiClient";
import { supabase } from "../lib/supabaseClient";
import {
  ServiceItem,
  CreateServiceInput,
  UpdateServiceInput,
  ServiceOption,
} from "../types/service";

const ADMIN_SERVICE_ENDPOINT = "/api/admin/services";

interface ApiServiceOptionDto {
  id?: string;
  option_id?: string | number;
  service_id?: string | number;
  name?: string;
  option_name?: string;
  price: number | string;
  unit: string;
}

interface ApiServiceDto {
  id: string | number;
  service_id?: string | number;
  name?: string;
  service_name?: string;
  categoryId?: string | number;
  category_id?: string | number;
  category?: string;
  category_name?: string;
  imageUrl?: string;
  image_url?: string;
  isFeatured?: boolean;
  is_featured?: boolean;
  displayOrder?: number;
  display_order?: number;
  popularityScore?: number;
  popularity_score?: number;
  isActive?: boolean;
  is_active?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
  minPrice?: number;
  maxPrice?: number;
  serviceOptions?: ApiServiceOptionDto[];
  service_options?: ApiServiceOptionDto[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

function formatDate(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" ", "");

  return `${datePart} ${timePart}`;
}

function toServiceOption(dto: ApiServiceOptionDto): ServiceOption {
  return {
    id: String(dto.id || dto.option_id || ""),
    option_id: dto.option_id || dto.id,
    service_id: dto.service_id,
    name: dto.name || dto.option_name || "",
    option_name: dto.option_name || dto.name || "",
    price: Number(dto.price) || 0,
    unit: dto.unit || "",
  };
}

function toServiceItem(dto: ApiServiceDto): ServiceItem {
  const options = (dto.serviceOptions || dto.service_options || []).map(toServiceOption);
  return {
    id: String(dto.id || dto.service_id),
    service_id: dto.service_id || dto.id,
    name: dto.name || dto.service_name || "",
    service_name: dto.service_name || dto.name || "",
    categoryId: Number(dto.categoryId || dto.category_id) || undefined,
    category_id: Number(dto.category_id || dto.categoryId) || undefined,
    category: dto.category || dto.category_name || "บริการทั่วไป",
    imageUrl: dto.imageUrl || dto.image_url || "",
    image_url: dto.image_url || dto.imageUrl || "",
    minPrice: dto.minPrice !== undefined ? Number(dto.minPrice) : undefined,
    maxPrice: dto.maxPrice !== undefined ? Number(dto.maxPrice) : undefined,
    isRecommended: dto.isFeatured ?? dto.is_featured,
    popularityScore: dto.popularityScore ?? dto.popularity_score,
    serviceOptions: options,
    service_options: options,
    createdAt: formatDate(dto.createdAt || dto.created_at),
    created_at: dto.created_at || dto.createdAt,
    updatedAt: formatDate(dto.updatedAt || dto.updated_at),
    updated_at: dto.updated_at || dto.updatedAt,
  };
}

export async function uploadServiceImage(file: File): Promise<string> {
  if (supabase) {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `service-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("services")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("services")
          .getPublicUrl(filePath);
        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      }
    } catch (e) {
      console.warn("Supabase storage upload error, falling back to data URL:", e);
    }
  }

  // Fallback to Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

export const serviceApi = {
  async getServices(searchQuery: string = "", signal?: AbortSignal): Promise<ServiceItem[]> {
    const params: { search?: string } = {};
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }
    const response = await apiClient.get<ApiResponse<ApiServiceDto[]>>(ADMIN_SERVICE_ENDPOINT, {
      params,
      signal,
    });
    return (response.data.data || []).map(toServiceItem);
  },

  async getServiceById(id: string, signal?: AbortSignal): Promise<ServiceItem | null> {
    try {
      const response = await apiClient.get<ApiResponse<ApiServiceDto>>(
        `${ADMIN_SERVICE_ENDPOINT}/${id}`,
        { signal }
      );
      if (!response.data.data) return null;
      return toServiceItem(response.data.data);
    } catch (error) {
      console.error(`Error fetching service with id ${id}:`, error);
      return null;
    }
  },

  async createService(input: CreateServiceInput): Promise<ServiceItem> {
    const payload = {
      name: input.name,
      category: input.category,
      categoryId: input.category_id,
      imageUrl: input.imageUrl,
      serviceOptions: input.serviceOptions.map((opt) => ({
        name: opt.name,
        price: Number(opt.price) || 0,
        unit: opt.unit,
      })),
    };

    const response = await apiClient.post<ApiResponse<ApiServiceDto>>(ADMIN_SERVICE_ENDPOINT, payload);
    return toServiceItem(response.data.data);
  },

  async updateService(id: string, input: UpdateServiceInput): Promise<ServiceItem | null> {
    const payload = {
      name: input.name,
      category: input.category,
      categoryId: input.category_id,
      imageUrl: input.imageUrl,
      serviceOptions: input.serviceOptions.map((opt) => ({
        id: opt.id,
        option_id: opt.option_id,
        name: opt.name,
        price: Number(opt.price) || 0,
        unit: opt.unit,
      })),
    };

    const response = await apiClient.put<ApiResponse<ApiServiceDto>>(
      `${ADMIN_SERVICE_ENDPOINT}/${id}`,
      payload
    );
    return toServiceItem(response.data.data);
  },

  async deleteService(id: string): Promise<boolean> {
    await apiClient.delete(`${ADMIN_SERVICE_ENDPOINT}/${id}`);
    return true;
  },

  async reorderServices(newOrderServices: ServiceItem[]): Promise<void> {
    const payload = {
      items: newOrderServices.map((service, index) => ({
        id: service.id,
        displayOrder: index + 1,
      })),
    };
    await apiClient.patch(`${ADMIN_SERVICE_ENDPOINT}/reorder`, payload);
  },
};
