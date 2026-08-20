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
  technicianName?: string;
  totalPrice: number;
  items: CustomerServiceItem[];
}
