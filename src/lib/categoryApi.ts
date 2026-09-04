import axios from 'axios';

import apiClient from '@/services/apiClient';
import { Category } from '@/types/category';

const CATEGORY_ENDPOINT = '/api/admin/categories';

type CategoryDto = {
  category_id: number | string;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type CategoryApiError = {
  code?: string;
  message?: string;
};

export function isInactiveCategoryError(
  error: unknown,
): boolean {
  if (axios.isAxiosError<CategoryApiError>(error)) {
    return error.response?.data?.code === 'CATEGORY_INACTIVE';
  }

  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'CATEGORY_INACTIVE'
  );
}

function formatDate(value: string) {
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

function toCategory(category: CategoryDto): Category {
  return {
    id: Number(category.category_id),
    name: category.name,
    createdAt: formatDate(category.created_at),
    updatedAt: formatDate(category.updated_at),
  };
}

export async function getCategories(signal?: AbortSignal) {
  const response = await apiClient.get<ApiResponse<CategoryDto[]>>(
    CATEGORY_ENDPOINT,
    { signal },
  );

  return response.data.data
    .filter((category) => category.is_active)
    .map(toCategory);
}

export async function getCategory(id: string, signal?: AbortSignal) {
  const response = await apiClient.get<ApiResponse<CategoryDto>>(
    `${CATEGORY_ENDPOINT}/${id}`,
    { signal },
  );

  return toCategory(response.data.data);
}

export async function createCategory(name: string) {
  await apiClient.post(CATEGORY_ENDPOINT, { name });
}

export async function updateCategory(id: string, name: string) {
  await apiClient.patch(`${CATEGORY_ENDPOINT}/${id}`, { name });
}

export async function deleteCategory(id: number | string) {
  await apiClient.delete(`${CATEGORY_ENDPOINT}/${id}`);
}

function unwrapTranslationName(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const record = payload as { data?: { name?: string }; name?: string };
  return (record.data?.name ?? record.name ?? '').trim();
}

export async function getCategoryTranslation(
  id: string,
  locale: 'en' = 'en',
  signal?: AbortSignal,
): Promise<string> {
  try {
    const response = await apiClient.get<unknown>(
      `${CATEGORY_ENDPOINT}/${id}/translations/${locale}`,
      { signal },
    );
    return unwrapTranslationName(response.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return '';
    }
    throw error;
  }
}

export async function upsertCategoryTranslation(
  id: string,
  name: string,
  locale: 'en' = 'en',
): Promise<void> {
  const trimmed = name.trim();
  if (!trimmed) return;
  await apiClient.put(`${CATEGORY_ENDPOINT}/${id}/translations/${locale}`, {
    name: trimmed,
  });
}
