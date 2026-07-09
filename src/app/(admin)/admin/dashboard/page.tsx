"use client";

import { useEffect, useState } from 'react';
import { StatCards } from '@/components/Admin/Dashboard/StatCards';
import { ActivityLog } from '@/components/Admin/Dashboard/ActivityLog';
import dynamic from 'next/dynamic';
import { 
  getAdminStats, 
  getRevenueTrend, 
  getActivityLogs,
  AdminStatsResponse,
  RevenueTrendItem,
  ActivityLogItem
} from '@/lib/api/admin/dashboard';

const RevenueChart = dynamic(
  () => import('@/components/Admin/Dashboard/RevenueChart').then((mod) => mod.RevenueChart),
  { ssr: false }
);

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStatsResponse['data'] | null>(null);
  const [trendData, setTrendData] = useState<RevenueTrendItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  
  const [statsLoading, setStatsLoading] = useState(true);
  const [trendLoading, setTrendLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Stats
    getAdminStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => console.error("Error fetching stats:", err))
      .finally(() => setStatsLoading(false));

    // 2. Fetch Revenue Trend
    getRevenueTrend()
      .then((res) => {
        setTrendData(res);
      })
      .catch((err) => console.error("Error fetching revenue trend:", err))
      .finally(() => setTrendLoading(false));

    // 3. Fetch Activity Logs
    getActivityLogs()
      .then((res) => {
        setActivityLogs(res);
      })
      .catch((err) => console.error("Error fetching activity logs:", err))
      .finally(() => setLogsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8 fade-in animate-in pb-10">
      <div>
        <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Dasbor</h1>
        <p className="text-gray-500 text-sm">
          Ringkasan performa dan aktivitas fasilitas olahraga secara keseluruhan.
        </p>
      </div>
      <StatCards stats={stats} loading={statsLoading} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <RevenueChart data={trendData} loading={trendLoading} />
        </div>
        <div className="lg:col-span-1 relative min-h-[400px]">
          <div className="absolute inset-0">
            <ActivityLog data={activityLogs} loading={logsLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
