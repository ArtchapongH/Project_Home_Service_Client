export interface TechnicianService {
  id: string;
  name: string;
}

export interface TechnicianProfile {
  technicianId: string;
  userId: string;
  email: string;
  fullName: string;
  first_name?: string;
  last_name?: string;
  phone: string | null;
  address: string | null;
  isAvailable: boolean;
  latitude: number | null;
  longitude: number | null;
  locationUpdatedAt: string | null;
  services: TechnicianService[];
}

export interface TechnicianJobItem {
  itemId: string;
  optionId: string;
  optionName: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}

export type TechnicianJobStatus =
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface TechnicianJob {
  assignmentId?: string;
  assignmentStatus?: TechnicianJobStatus;
  assignedAt?: string;
  completedAt?: string | null;
  orderId: string;
  orderCode: string;
  orderStatus: string;
  scheduledAt: string | null;
  address: string | null;
  serviceLatitude: number | null;
  serviceLongitude: number | null;
  subtotal: number | null;
  discount: number;
  totalPrice: number;
  serviceId: string;
  serviceName: string;
  categoryName: string;
  customerName: string | null;
  customerPhone: string | null;
  items: TechnicianJobItem[];
}

export interface TechnicianListFilters {
  serviceId?: string;
  search?: string;
  sort?: "newest" | "oldest" | "nearest";
  status?: TechnicianJobStatus;
  latitude?: number;
  longitude?: number;
}

export interface TechnicianSettingsInput {
  fullName?: string;
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  address?: string | null;
  isAvailable?: boolean;
  serviceIds?: string[];
}

export interface TechnicianLocationInput {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface ApiListMeta {
  total: number;
  isAvailable?: boolean;
}
