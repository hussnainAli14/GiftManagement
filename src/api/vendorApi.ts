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
};

/**
 * Public list: GET /api/vendors
 * Backend returns a raw array of Vendor documents.
 */
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

export type VendorDashboardStats = {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  productCount: number;
  customerCount: number;
  walletBalance: number;
  topProducts: Array<{ name?: string; count: number }>;
};

export async function getVendorDashboardStatsApi(): Promise<VendorDashboardStats> {
  const res = await apiRequest<unknown>('/vendors/dashboard-stats', { auth: true });
  return unwrapData<VendorDashboardStats>(res);
}
