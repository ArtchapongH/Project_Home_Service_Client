export type CustomerServiceStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface CustomerServiceItem {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
  price?: number;
}

export interface CustomerServiceOrder {
  id: string;
  orderCode: string;
  status: CustomerServiceStatus;
  statusText?: string;
  scheduledDate: string;
  scheduledTime: string;
  serviceId?: string | number;
  serviceName?: string;
  technicianId?: string | number;
  technicianName?: string;
  technicianPhone?: string;
  totalPrice: number;
  subtotal?: number;
  discount?: number;
  address?: string;
  notes?: string;
  paymentMethod?: string;
  items: CustomerServiceItem[];
  isReviewed?: boolean;
  reviewRating?: number;
  reviewComment?: string;
  createdAt?: string;
}
