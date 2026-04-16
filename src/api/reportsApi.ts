import { apiRequest, unwrapData } from './http';

export type ReportsOverview = {
  range: { months: number; start: string; end: string };
  summaries: {
    totalSales: number;
    newUsers: number;
    vendorApprovals: number;
    pendingOrders: number;
  };
  charts: {
    months: string[];
    monthlySales: number[];
    monthlyExpenses: number[];
    userGrowth: number[];
    topVendors: Array<{ vendorId?: string; name?: string; value: number }>;
  };
};

export async function getReportsOverviewApi(months = 6): Promise<ReportsOverview> {
  const res = await apiRequest<unknown>(`/reports/overview?months=${encodeURIComponent(String(months))}`, { auth: true });
  return unwrapData<ReportsOverview>(res);
}

