import { StatCards } from '@/components/Admin/Dashboard/StatCards';
import { RevenueChart } from '@/components/Admin/Dashboard/RevenueChart';
import { ActivityLog } from '@/components/Admin/Dashboard/ActivityLog';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 fade-in animate-in pb-10">
      <div>
        <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Ringkasan performa dan aktivitas fasilitas olahraga secara keseluruhan.
        </p>
      </div>
      <StatCards />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
}
