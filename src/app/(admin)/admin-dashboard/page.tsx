"use client";

import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Search,
  Filter,
  MoreVertical
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useState, useMemo } from 'react';

const chartData = [
  { name: 'SENIN', realisasi: 20, target: 40 },
  { name: 'SELASA', realisasi: 35, target: 50 },
  { name: 'RABU', realisasi: 65, target: 55 },
  { name: 'KAMIS', realisasi: 45, target: 52 },
  { name: 'JUMAT', realisasi: 55, target: 58 },
  { name: 'SABTU', realisasi: 80, target: 62 },
];

const recentBookings = [
  {
    id: '#UGO-2940',
    initials: 'BS',
    name: 'Bagus Setiawan',
    colorClass: 'bg-blue-100 text-blue-700',
    lapangan: 'Lapangan Futsal A',
    tanggal: '24 Okt 2023',
    jam: '16:00-18:00',
    status: 'Menunggu',
  },
  {
    id: '#UGO-2938',
    initials: 'SA',
    name: 'Siti Aminah',
    colorClass: 'bg-pink-100 text-pink-700',
    lapangan: 'Gedung Badminton',
    tanggal: '24 Okt 2023',
    jam: '19:00-21:00',
    status: 'Disetujui',
  },
  {
    id: '#UGO-2937',
    initials: 'RA',
    name: 'Rudi Akbar',
    colorClass: 'bg-green-100 text-green-700',
    lapangan: 'Lapangan Basket Pro',
    tanggal: '23 Okt 2023',
    jam: '10:00-12:00',
    status: 'Ditolak',
  },
  {
    id: '#UGO-2936',
    initials: 'DW',
    name: 'Dinda Wulandari',
    colorClass: 'bg-purple-100 text-purple-700',
    lapangan: 'Lapangan Futsal A',
    tanggal: '23 Okt 2023',
    jam: '14:00-16:00',
    status: 'Menunggu',
  },
  {
    id: '#UGO-2935',
    initials: 'AB',
    name: 'Andi Budiman',
    colorClass: 'bg-yellow-100 text-yellow-700',
    lapangan: 'Lapangan Tenis 1',
    tanggal: '22 Okt 2023',
    jam: '08:00-10:00',
    status: 'Disetujui',
  }
];

export default function DashboardPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    menunggu: true,
    disetujui: true,
    ditolak: true
  });
  const [pendingFilters, setPendingFilters] = useState({
    menunggu: true,
    disetujui: true,
    ditolak: true
  });

  const filteredBookings = useMemo(() => {
    return recentBookings.filter(booking => {
      // Filter by search
      const matchesSearch = booking.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            booking.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const noFilterSelected = !activeFilters.menunggu && !activeFilters.disetujui && !activeFilters.ditolak;
      let matchesStatus = noFilterSelected;
      
      if (!noFilterSelected) {
        if (activeFilters.menunggu && booking.status === 'Menunggu') matchesStatus = true;
        if (activeFilters.disetujui && booking.status === 'Disetujui') matchesStatus = true;
        if (activeFilters.ditolak && booking.status === 'Ditolak') matchesStatus = true;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeFilters]);

  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const currentBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
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
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
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
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
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
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
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
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-lg text-ugo-sidebar">Tren Pendapatan & Utilisasi</h2>
            <p className="text-sm text-gray-500">Statistik performa lapangan bulan ini</p>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dx={-10} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
              <Line 
                name="Realisasi"
                type="monotone" 
                dataKey="realisasi" 
                stroke="#1C2B1E" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                name="Target"
                type="monotone" 
                dataKey="target" 
                stroke="#D4A574" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl relative">
          <h2 className="font-bold text-lg text-ugo-sidebar">Ringkasan Pemesanan Terbaru</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari ID atau nama..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/20"
              />
            </div>
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 bg-ugo-primary text-white rounded-lg text-sm font-medium hover:bg-ugo-primary/90 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Filter Dialog Popup Simple Simulation */}
            {showFilter && (
              <div className="absolute right-6 top-20 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Filter</h3>
                  <button onClick={() => {
                    setShowFilter(false);
                    setPendingFilters(activeFilters);
                  }} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                
                <div className="mb-5">
                  <p className="text-[10px] uppercase font-bold text-ugo-sidebar mb-3 tracking-wider">Status</p>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pendingFilters.menunggu}
                        onChange={(e) => {
                          setPendingFilters({...pendingFilters, menunggu: e.target.checked});
                        }}
                        className="w-4 h-4 accent-ugo-primary rounded" 
                      />
                      <span className="text-sm font-medium">Menunggu</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pendingFilters.disetujui}
                        onChange={(e) => {
                          setPendingFilters({...pendingFilters, disetujui: e.target.checked});
                        }}
                        className="w-4 h-4 accent-ugo-primary rounded" 
                      />
                      <span className="text-sm font-medium">Disetujui</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pendingFilters.ditolak}
                        onChange={(e) => {
                          setPendingFilters({...pendingFilters, ditolak: e.target.checked});
                        }}
                        className="w-4 h-4 accent-ugo-primary rounded" 
                      />
                      <span className="text-sm font-medium">Ditolak</span>
                    </label>
                  </div>
                </div>

                <hr className="my-4 border-gray-100" />
                
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => {
                      const reset = {menunggu: true, disetujui: true, ditolak: true};
                      setPendingFilters(reset);
                      setActiveFilters(reset);
                      setCurrentPage(1);
                    }}
                    className="text-sm text-ugo-sidebar font-medium hover:text-ugo-primary hover:underline transition-colors"
                  >
                    Atur Ulang
                  </button>
                  <button 
                    onClick={() => {
                      setActiveFilters(pendingFilters);
                      setCurrentPage(1);
                      setShowFilter(false);
                    }}
                    className="px-5 py-2 bg-ugo-primary hover:bg-ugo-primary/90 text-white rounded-full text-sm font-bold transition-colors"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Booking ID</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Nama User</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Lapangan</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Tanggal</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Jam</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Status</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-ugo-sidebar">{booking.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full ${booking.colorClass} font-bold flex items-center justify-center text-xs`}>{booking.initials}</div>
                        <span className="font-medium text-sm">{booking.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{booking.lapangan}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{booking.tanggal}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{booking.jam}</td>
                    <td className="py-4 px-6">
                      {booking.status === 'Menunggu' && <span className="bg-ugo-status-menunggu-bg text-ugo-status-menunggu-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Menunggu</span>}
                      {booking.status === 'Disetujui' && <span className="bg-ugo-status-disetujui-bg text-ugo-status-disetujui-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Disetujui</span>}
                      {booking.status === 'Ditolak' && <span className="bg-ugo-status-ditolak-bg text-ugo-status-ditolak-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Ditolak</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5 inline-block" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 font-medium">Tidak ada data yang sesuai filter</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <p>Menampilkan {currentBookings.length} dari {filteredBookings.length} entri</p>
          <div className="flex gap-1 items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                  currentPage === page 
                    ? 'bg-ugo-sidebar text-white font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >{page}</button>
            ))}
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
