export type PromotionType = 'Fixed' | 'Percent';

export type Promotion = {
  id: number;
  code: string;
  type: PromotionType;
  discount: number;
  quota: number;
  quotaUsed: number;
  status: string;
  expire: string;
  rawExpire: string;
  createdAt: string;
  updatedAt: string;
};

export type CreatePromotionDto = {
  promotion_code: string;
  type: PromotionType;
  discount: number;
  quota: number;
  expire: string;
};

export type UpdatePromotionDto = {
  promotion_code?: string;
  type?: PromotionType;
  discount?: number;
  quota?: number;
  expire?: string;
};
