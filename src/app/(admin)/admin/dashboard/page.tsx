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
        const dayMap: Record<string, string> = {
          'MONDAY': 'SENIN',
          'TUESDAY': 'SELASA',
          'WEDNESDAY': 'RABU',
          'THURSDAY': 'KAMIS',
          'FRIDAY': 'JUMAT',
          'SATURDAY': 'SABTU',
          'SUNDAY': 'MINGGU'
        };
        const mappedData = res.map(item => ({
          ...item,
          name: dayMap[item.name.toUpperCase()] || item.name
        }));
        setTrendData(mappedData);
      })
      .catch((err) => console.error("Error fetching revenue trend:", err))
      .finally(() => setTrendLoading(false));

    // 3. Fetch Activity Logs
    getActivityLogs()
      .then((res) => {
        const translateLog = (text: string) => {
          if (!text) return text;
          let t = text;
          t = t.replace(/Booking Expired/ig, 'Pemesanan Kedaluwarsa');
          t = t.replace(/New Booking/ig, 'Pemesanan Baru');
          t = t.replace(/Payment Success/ig, 'Pembayaran Berhasil');
          t = t.replace(/Booking Verified/ig, 'Pemesanan Diverifikasi');
          t = t.replace(/Booking Rejected/ig, 'Pemesanan Ditolak');
          t = t.replace(/has expired/ig, 'telah kedaluwarsa');
          t = t.replace(/was created by/ig, 'dibuat oleh');
          t = t.replace(/ for /ig, ' untuk ');
          t = t.replace(/has been verified/ig, 'telah diverifikasi');
          t = t.replace(/has been rejected/ig, 'telah ditolak');
          t = t.replace(/Booking/g, 'Pemesanan');
          t = t.replace(/booking/g, 'pemesanan');
          return t;
        };

        const mappedLogs = res.map(log => ({
          ...log,
          title: translateLog(log.title),
          description: translateLog(log.description)
        }));
        setActivityLogs(mappedLogs);
      })
      .catch((err) => console.error("Error fetching activity logs:", err))
      .finally(() => setLogsLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-8 fade-in animate-in pb-10">
      <div>
        <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Beranda</h1>
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
