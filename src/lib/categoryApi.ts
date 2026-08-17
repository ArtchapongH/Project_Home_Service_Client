import axios from 'axios';

import { Category } from '@/types/category';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const CATEGORY_ENDPOINT = `${API_BASE_URL}/admin/categories`;

type CategoryDto = {
  category_id: number | string;
  name: string;
  created_at: string;
  updated_at: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

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
  const response = await axios.get<ApiResponse<CategoryDto[]>>(
    CATEGORY_ENDPOINT,
    { signal },
  );

  return response.data.data.map(toCategory);
}

export async function getCategory(id: string, signal?: AbortSignal) {
  const response = await axios.get<ApiResponse<CategoryDto>>(
    `${CATEGORY_ENDPOINT}/${id}`,
    { signal },
  );

  return toCategory(response.data.data);
}

export async function createCategory(name: string) {
  await axios.post(CATEGORY_ENDPOINT, { name });
}

export async function updateCategory(id: string, name: string) {
  await axios.patch(`${CATEGORY_ENDPOINT}/${id}`, { name });
}

export async function deleteCategory(id: number | string) {
  await axios.delete(`${CATEGORY_ENDPOINT}/${id}`);
}
