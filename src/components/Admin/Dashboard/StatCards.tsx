import { CalendarDays, Clock, CheckCircle2, Users, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface AdminStats {
  total_users?: number;
  total_fields?: number;
  total_bookings?: number;
  pending_bookings?: number;
}

interface StatCardsProps {
  stats: AdminStats | null;
  loading: boolean;
}

export function StatCards({ stats, loading }: StatCardsProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 w-full">
        <Loader2 className="w-8 h-8 animate-spin text-ugo-sidebar" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Link href="/admin/manajemen/user" className="block outline-none">
        <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-ugo-icon-bg rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Pengguna</h3>
            <p className="text-3xl font-bold mt-1 text-ugo-sidebar">{stats?.total_users || 0}</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/lapangan" className="block outline-none">
        <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-ugo-icon-bg rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Lapangan</h3>
            <p className="text-3xl font-bold mt-1 text-ugo-sidebar">{stats?.total_fields || 0}</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/laporan" className="block outline-none">
        <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-ugo-icon-bg rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Pemesanan</h3>
            <p className="text-3xl font-bold mt-1 text-ugo-sidebar">{stats?.total_bookings || 0}</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/manajemen/booking" className="block outline-none">
        <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-ugo-icon-bg rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <span className="bg-ugo-status-menunggu-bg text-ugo-status-menunggu-text px-2.5 py-1 rounded-full text-xs font-bold">
                Penting
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Menunggu Verifikasi</h3>
            <p className="text-3xl font-bold mt-1 text-ugo-sidebar">{stats?.pending_bookings || 0}</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
