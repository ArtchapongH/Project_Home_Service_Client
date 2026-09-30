import apiClient from "./apiClient";

export type TotalSalesResponse = {
  success: boolean;
  data: {
    totalSales: number;
  };
};

export type TotalOrdersResponse = {
  success: boolean;
  data: {
    totalOrders: number;
  };
};

export type TopSalesByService = {
  serviceName: string;
  totalSales: number;
};

export type TopSalesByServiceResponse = {
  success: boolean;
  data: TopSalesByService[];
};

export type DailySales = {
  date: string;
  totalSales: number;
};

export type DailySalesResponse = {
  success: boolean;
  data: DailySales[];
};

export type ServiceSubcategorySales = {
  serviceName: string;
  optionName: string;
  totalSales: number;
  totalOrders: number;
};

export type ServiceSubcategorySalesResponse = {
  success: boolean;
  data: ServiceSubcategorySales[];
};

export type DateRangeResponse = {
  success: boolean;
  data: {
    minDate: string | null;
    maxDate: string | null;
  };
};

export async function fetchDashboardTotalSales(startDate: string, endDate: string): Promise<number> {
  const { data } = await apiClient.get<TotalSalesResponse>("/api/admin/dashboard/total-sales", {
    params: { startDate, endDate },
  });
  return data.data.totalSales;
}

export async function fetchDashboardTotalOrders(startDate: string, endDate: string): Promise<number> {
  const { data } = await apiClient.get<TotalOrdersResponse>("/api/admin/dashboard/total-orders", {
    params: { startDate, endDate },
  });
  return data.data.totalOrders;
}

export async function fetchDashboardTopSalesByService(
  startDate: string,
  endDate: string,
): Promise<TopSalesByService[]> {
  const { data } = await apiClient.get<TopSalesByServiceResponse>(
    "/api/admin/dashboard/top-sales-by-service",
    { params: { startDate, endDate } },
  );
  return data.data;
}

export async function fetchDashboardSalesByDay(startDate: string, endDate: string): Promise<DailySales[]> {
  const { data } = await apiClient.get<DailySalesResponse>("/api/admin/dashboard/sales-by-day", {
    params: { startDate, endDate },
  });
  return data.data;
}

export async function fetchDashboardSalesByServiceSubcategory(
  startDate: string,
  endDate: string,
): Promise<ServiceSubcategorySales[]> {
  const { data } = await apiClient.get<ServiceSubcategorySalesResponse>(
    "/api/admin/dashboard/sales-by-service-subcategory",
    { params: { startDate, endDate } },
  );
  return data.data;
}

export async function fetchDashboardDateRange(): Promise<{ minDate: string | null; maxDate: string | null }> {
  const { data } = await apiClient.get<DateRangeResponse>("/api/admin/dashboard/date-range");
  return data.data;
}
