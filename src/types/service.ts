// ERD-aligned Data Interfaces (categories, services, service_options)

export interface Category {
  category_id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

// ServiceOption maps to ERD table `service_options`
export interface ServiceOption {
  id?: string;
  option_id?: number | string;
  service_id?: number | string;
  name: string;
  option_name?: string;
  price: number;
  unit: string;
}

export interface ServiceItem {
  id: string;
  service_id?: number | string;
  name: string;
  service_name?: string;
  categoryId?: number;
  category_id?: number;
  category: string; // Category Name
  imageUrl: string;
  image_url?: string;
  serviceOptions: ServiceOption[];
  service_options?: ServiceOption[];
  createdAt: string;
  created_at?: string;
  updatedAt: string;
  updated_at?: string;
}

export interface CreateServiceInput {
  name: string;
  category: string;
  category_id?: number;
  imageUrl: string;
  serviceOptions: {
    name: string;
    price: number;
    unit: string;
  }[];
}

export interface UpdateServiceInput {
  name: string;
  category: string;
  category_id?: number;
  imageUrl: string;
  serviceOptions: {
    id?: string;
    option_id?: string | number;
    name: string;
    price: number;
    unit: string;
  }[];
}

export const DEFAULT_CATEGORIES: Category[] = [
  { category_id: 1, name: "บริการทั่วไป" },
  { category_id: 2, name: "บริการห้องครัว" },
  { category_id: 3, name: "บริการห้องนอน" },
  { category_id: 4, name: "บริการห้องน้ำ" },
];
