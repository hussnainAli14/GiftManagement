import { apiRequest, unwrapData } from './http';

/** Vendor document shape from backend (Vendor model) */
export type VendorModel = {
  _id: string;
  name?: string;
  businessName?: string;
  businessAddress?: string;
  category?: string;
  isApproved?: boolean;
  description?: string;
  area?: string;
  city?: string;
  country?: string;
  location?: { lat?: number; lng?: number };
  averageRating?: number;
  reviewCount?: number;
  distanceKm?: number;
};

/**
 * Public list: GET /api/vendors
 * Backend returns a raw array of Vendor documents.
 */
export type VendorNearEntry = {
  vendor: VendorModel;
  distance: number;
};

type VendorsNearUserResponse = {
  success?: boolean;
  data?: VendorNearEntry[];
  hasRecipientLocation?: boolean;
  hasRecipientCity?: boolean;
  recipientCity?: string | null;
  message?: string;
};

/**
 * Approved vendors in the gift recipient's city, sorted closest first when distance is known.
 */
export async function getVendorsNearUserApi(userId: string): Promise<{
  vendors: VendorModel[];
  hasRecipientLocation: boolean;
  hasRecipientCity: boolean;
  recipientCity?: string;
}> {
  const response = await apiRequest<VendorsNearUserResponse>(
    `/vendors/near-user/${encodeURIComponent(userId)}`,
    { auth: false },
  );

  const entries = Array.isArray(response?.data) ? response.data : [];
  const vendors = entries
    .map((entry) => {
      const vendor = entry?.vendor;
      if (!vendor?._id) return null;
      return {
        ...vendor,
        distanceKm: entry.distance,
      } as VendorModel & { distanceKm?: number };
    })
    .filter((v): v is VendorModel & { distanceKm?: number } => v != null);

  return {
    vendors,
    hasRecipientLocation: response?.hasRecipientLocation === true,
    hasRecipientCity: response?.hasRecipientCity === true,
    recipientCity: response?.recipientCity ?? undefined,
  };
}

export async function getVendorByIdApi(id: string): Promise<VendorModel> {
  return apiRequest<VendorModel>(`/vendors/${encodeURIComponent(id)}`, { auth: false });
}

export async function getVendorsApi(): Promise<VendorModel[]> {
  const data = await apiRequest<VendorModel[] | { data?: VendorModel[] }>('/vendors', {
    auth: false,
  });
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as { data: VendorModel[] }).data)) {
    return (data as { data: VendorModel[] }).data;
  }
  return [];
}

export async function getMyVendorProfileApi(): Promise<VendorModel> {
  const res = await apiRequest<unknown>('/vendors/me', { auth: true });
  return unwrapData<VendorModel>(res);
}

export async function updateVendorProfileApi(
  vendorId: string,
  payload: { businessName?: string; name?: string; description?: string },
): Promise<VendorModel> {
  const res = await apiRequest<unknown>(`/vendors/${encodeURIComponent(vendorId)}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  });
  return unwrapData<VendorModel>(res);
}

export type VendorDashboardStats = {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  productCount: number;
  customerCount: number;
  walletBalance: number;
  topProducts: Array<{ name?: string; count: number }>;
  lowStockProducts?: Array<{ productId: string; name: string; remaining: number }>;
  lowStockThreshold?: number;
};

export async function getVendorDashboardStatsApi(): Promise<VendorDashboardStats> {
  const res = await apiRequest<unknown>('/vendors/dashboard-stats', { auth: true });
  return unwrapData<VendorDashboardStats>(res);
}

export type VendorAnalyticsProduct = {
  productId?: string | null;
  name?: string;
  image?: string | null;
  unitsSold: number;
  revenue: number;
};

export type VendorExpense = {
  _id: string;
  vendorId: string;
  amount: number;
  category: string;
  note?: string;
  incurredAt: string;
  createdAt?: string;
};

export type VendorAnalytics = {
  range: { months: number; start: string; end: string };
  summaries: {
    totalRevenue: number;
    totalSales?: number;
    totalExpenses: number;
    profit: number;
    totalUnits: number;
    orderCount: number;
    productCount: number;
  };
  mostSoldProduct: VendorAnalyticsProduct | null;
  highestRevenueProduct: VendorAnalyticsProduct | null;
  monthlySales: {
    months: string[];
    values: number[];
  };
  monthlyExpenses?: {
    months: string[];
    values: number[];
  };
  monthlyProfit?: {
    months: string[];
    values: number[];
  };
  recentExpenses?: VendorExpense[];
};

export async function getVendorAnalyticsApi(months = 6): Promise<VendorAnalytics> {
  const res = await apiRequest<unknown>(
    `/vendors/analytics?months=${encodeURIComponent(String(months))}`,
    { auth: true },
  );
  return unwrapData<VendorAnalytics>(res);
}

export async function listVendorExpensesApi(limit = 50): Promise<VendorExpense[]> {
  const res = await apiRequest<unknown>(
    `/vendors/expenses?limit=${encodeURIComponent(String(limit))}`,
    { auth: true },
  );
  return unwrapData<VendorExpense[]>(res);
}

export async function createVendorExpenseApi(payload: {
  amount: number;
  category: string;
  note?: string;
  incurredAt?: string;
}): Promise<VendorExpense> {
  const res = await apiRequest<unknown>('/vendors/expenses', {
    method: 'POST',
    auth: true,
    body: payload,
  });
  return unwrapData<VendorExpense>(res);
}

export async function deleteVendorExpenseApi(expenseId: string): Promise<void> {
  await apiRequest<unknown>(`/vendors/expenses/${encodeURIComponent(expenseId)}`, {
    method: 'DELETE',
    auth: true,
  });
}
