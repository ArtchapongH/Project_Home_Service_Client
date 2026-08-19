import apiClient from '@/services/apiClient';
import {
  CreatePromotionDto,
  Promotion,
  PromotionType,
  UpdatePromotionDto,
} from '@/types/promotion';

const PROMOTION_ENDPOINT = '/api/admin/promotions';

export type PromotionDto = {
  promotion_id: number | string;
  promotion_code: string;
  type: PromotionType;
  discount: number | string;
  quota: number;
  quota_used: number;
  status: string;
  expire: string;
  create_at: string;
  update_at: string;
};

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export function formatDateDisplay(value: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const datePart = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(' ', '');

  return `${datePart} ${timePart}`;
}

export function toPromotion(dto: PromotionDto): Promotion {
  return {
    id: Number(dto.promotion_id),
    code: dto.promotion_code,
    type: dto.type,
    discount: Number(dto.discount),
    quota: Number(dto.quota) || 0,
    quotaUsed: Number(dto.quota_used) || 0,
    status: dto.status,
    expire: formatDateDisplay(dto.expire),
    rawExpire: dto.expire,
    createdAt: formatDateDisplay(dto.create_at),
    updatedAt: formatDateDisplay(dto.update_at),
  };
}

export async function getPromotions(search?: string, signal?: AbortSignal): Promise<Promotion[]> {
  const params: Record<string, string> = {};
  if (search && search.trim()) {
    params.search = search.trim();
  }

  const response = await apiClient.get<ApiResponse<PromotionDto[]>>(
    PROMOTION_ENDPOINT,
    { params, signal }
  );

  return (response.data.data || []).map(toPromotion);
}

export async function getPromotion(id: string | number, signal?: AbortSignal): Promise<Promotion> {
  const response = await apiClient.get<ApiResponse<PromotionDto>>(
    `${PROMOTION_ENDPOINT}/${id}`,
    { signal }
  );

  return toPromotion(response.data.data);
}

export async function createPromotion(data: CreatePromotionDto): Promise<Promotion> {
  const response = await apiClient.post<ApiResponse<PromotionDto>>(
    PROMOTION_ENDPOINT,
    data
  );

  return toPromotion(response.data.data);
}

export async function updatePromotion(
  id: string | number,
  data: UpdatePromotionDto
): Promise<Promotion> {
  const response = await apiClient.patch<ApiResponse<PromotionDto>>(
    `${PROMOTION_ENDPOINT}/${id}`,
    data
  );

  return toPromotion(response.data.data);
}

export async function deletePromotion(id: string | number): Promise<void> {
  await apiClient.delete(`${PROMOTION_ENDPOINT}/${id}`);
}
