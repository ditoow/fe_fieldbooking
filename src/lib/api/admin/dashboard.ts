import api from '../../api';

export interface StatItemWithTrend {
  value: number;
  trend_percentage?: number;
  badge?: string;
  label: string;
}

export interface AdminStatsResponse {
  success: boolean;
  total_users: number;
  total_fields: number;
  total_bookings: number;
  pending_bookings: number;
  data: {
    total_users: number;
    total_fields: number;
    total_bookings: number;
    pending_bookings: number;
    today_bookings: StatItemWithTrend;
    pending_verifications: StatItemWithTrend;
    active_fields: StatItemWithTrend;
    monthly_revenue: StatItemWithTrend;
  };
}

export interface RevenueTrendItem {
  name: string; // Day name (SENIN, SELASA, etc.)
  realisasi: number; // Daily total revenue
}

export interface ActivityLogItem {
  id: number;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  user_name: string;
  created_at: string;
  updated_at: string;
}

// 1. Get dashboard statistics
export const getAdminStats = async (): Promise<AdminStatsResponse> => {
  const response = await api.get('/admin/stats');
  return response.data;
};

// 2. Get revenue trend for chart
export const getRevenueTrend = async (): Promise<RevenueTrendItem[]> => {
  const response = await api.get('/admin/stats/revenue-trend');
  return response.data.data;
};

// 3. Get system activity logs
export const getActivityLogs = async (): Promise<ActivityLogItem[]> => {
  const response = await api.get('/admin/activity-logs');
  return response.data.data;
};
