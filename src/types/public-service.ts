export interface PublicCategory {
  id: string;
  name: string;
}

export interface PublicService {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  imageUrl: string | null;
  minPrice: number;
  maxPrice: number;
  isFeatured: boolean;
  displayOrder: number;
  popularityScore: number;
}

export interface PublicServiceOption {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export interface PublicServiceDetail extends PublicService {
  serviceOptions: PublicServiceOption[];
}

export type PublicServiceSort = "recommended" | "popular" | "asc" | "desc";
