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
  message?: string;
};

/**
 * Vendors near a gift recipient (by user id), sorted closest first.
 */
export async function getVendorsNearUserApi(userId: string): Promise<{
  vendors: VendorModel[];
  hasRecipientLocation: boolean;
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
  };
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
