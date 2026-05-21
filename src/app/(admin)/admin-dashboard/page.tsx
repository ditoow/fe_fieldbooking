import { StatCards } from '@/components/Admin/Dashboard/StatCards';
import { RevenueChart } from '@/components/Admin/Dashboard/RevenueChart';
import { RecentBookingsTable } from '@/components/Admin/Dashboard/RecentBookingsTable';

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
      <RevenueChart />
      <RecentBookingsTable />
    </div>
  );
}
