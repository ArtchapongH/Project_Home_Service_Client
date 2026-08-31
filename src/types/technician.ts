export interface TechnicianService {
  id: string;
  name: string;
}

export interface TechnicianProfile {
  technicianId: string;
  userId: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
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

export interface TechnicianJobCompletionImage {
  imageId: string;
  objectPath: string;
  sortOrder: number;
  createdAt: string;
  signedUrl: string | null;
  expiresIn: number | null;
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
  completionImages?: TechnicianJobCompletionImage[];
}

export interface TechnicianCompletionImageUploadResult {
  assignmentId: string;
  imageCount: number;
  images: TechnicianJobCompletionImage[];
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
  firstName?: string;
  lastName?: string;
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
