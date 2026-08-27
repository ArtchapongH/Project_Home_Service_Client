import apiClient from "./apiClient";

export interface CreateReviewPayload {
  orderCode: string;
  orderId?: string;
  rating: number;
  comment?: string;
  serviceId?: string | number;
  serviceName?: string;
  technicianId?: string | number;
  technicianName?: string;
  userName?: string;
}

export interface ReviewItem {
  id: string;
  reviewId: string;
  orderCode: string;
  orderId?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  userName?: string | null;
  serviceId?: string | null;
  serviceName?: string | null;
  technicianId?: string | null;
  technicianName?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  success: boolean;
  message?: string;
  data: ReviewItem;
}

export interface ReviewCheckResponse {
  success: boolean;
  data: ReviewItem | null;
  isReviewed: boolean;
}

export const reviewApi = {
  /**
   * บันทึกรีวิวและคะแนนการบริการ
   */
  createReview: async (payload: CreateReviewPayload): Promise<ReviewResponse> => {
    const response = await apiClient.post<ReviewResponse>("/api/reviews", payload);
    return response.data;
  },

  /**
   * ตรวจสอบว่าคำสั่งซ่อมนี้เคยรีวิวแล้วหรือยัง
   */
  getReviewByOrderCode: async (orderCode: string): Promise<ReviewCheckResponse> => {
    const response = await apiClient.get<ReviewCheckResponse>(`/api/reviews/order/${orderCode}`);
    return response.data;
  },

  /**
   * ลบ/ยกเลิกรีวิวของคำสั่งซ่อม
   */
  deleteReview: async (orderCode: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/api/reviews/order/${orderCode}`
    );
    return response.data;
  },

  /**
   * แก้ไขรีวิวของคำสั่งซ่อม
   */
  updateReview: async (
    orderCode: string,
    payload: { rating?: number; comment?: string }
  ): Promise<ReviewResponse> => {
    const response = await apiClient.put<ReviewResponse>(
      `/api/reviews/order/${orderCode}`,
      payload
    );
    return response.data;
  },

  /**
   * ดึงรายการรีวิวทั้งหมดของบริการที่ระบุ
   */
  getReviewsByServiceId: async (
    serviceId: string | number,
    limit = 20
  ): Promise<{ success: boolean; data: ReviewItem[] }> => {
    const response = await apiClient.get<{ success: boolean; data: ReviewItem[] }>(
      `/api/reviews?serviceId=${serviceId}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * ดึงสรุปสถิติดาวและจำนวนรีวิวของบริการ
   */
  getServiceStats: async (
    serviceId: string | number
  ): Promise<{ success: boolean; data: { reviewCount: number; averageRating: number } }> => {
    const response = await apiClient.get<{
      success: boolean;
      data: { reviewCount: number; averageRating: number };
    }>(`/api/reviews/service/${serviceId}/stats`);
    return response.data;
  },
};

export default reviewApi;

