"use client";

import { CalendarDays, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-ugo-icon-bg rounded-xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <span className="bg-ugo-status-disetujui-bg text-ugo-status-disetujui-text px-2.5 py-1 rounded-full text-xs font-bold">
              +12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Booking Hari Ini</h3>
          <p className="text-3xl font-bold mt-1 text-ugo-sidebar">48</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
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
          <p className="text-3xl font-bold mt-1 text-ugo-sidebar">12</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-ugo-icon-bg rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <span className="bg-ugo-status-aktif-bg text-ugo-status-aktif-text px-2.5 py-1 rounded-full text-xs font-bold">
              Aktif
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Lapangan Aktif</h3>
          <p className="text-3xl font-bold mt-1 text-ugo-sidebar">08</p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm border-gray-100 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-ugo-icon-bg rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="bg-ugo-status-disetujui-bg text-ugo-status-disetujui-text px-2.5 py-1 rounded-full text-xs font-bold">
              +5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pendapatan Bulan Ini</h3>
          <p className="text-3xl font-bold mt-1 text-ugo-sidebar">Rp 14.5M</p>
        </CardContent>
      </Card>
    </div>
  );
}
