"use client";

import { useState, useMemo } from 'react';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Search, 
  Filter, 
  CircleDashed,
  Activity
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const recentTransactions = [
  {
    id: '#MYU-2938',
    icon: '⚽',
    fasilitas: 'Lapangan Futsal A',
    pengguna: 'Ahmad Fauzi',
    kategori: 'PUBLIC',
    tanggal: '24 Okt, 2023',
    nominal: 'Rp 150.000',
    status: 'BERHASIL'
  },
  {
    id: '#MYU-2940',
    icon: '🏸',
    fasilitas: 'Lapangan Badminton 3',
    pengguna: 'Riana Putri',
    kategori: 'STUDENT',
    tanggal: '24 Okt, 2023',
    nominal: 'Rp 45.000',
    status: 'BERHASIL'
  },
  {
    id: '#MYU-2941',
    icon: '🏀',
    fasilitas: 'Basket Indoor Main',
    pengguna: 'Budi Santoso',
    kategori: 'PUBLIC',
    tanggal: '23 Okt, 2023',
    nominal: 'Rp 200.000',
    status: 'MENUNGGU'
  }
];

const lineData = [
  { name: 'SENIN', realisasi: 20, target: 40 },
  { name: 'SELASA', realisasi: 35, target: 50 },
  { name: 'RABU', realisasi: 65, target: 55 },
  { name: 'KAMIS', realisasi: 45, target: 52 },
  { name: 'JUMAT', realisasi: 55, target: 58 },
  { name: 'SABTU', realisasi: 80, target: 62 },
];

const pieData = [
  { name: 'Public', value: 65, color: '#D4A574' },
  { name: 'Student', value: 35, color: '#2D6A4F' },
];

export default function LaporanPage() {
  const [showPDF, setShowPDF] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    menunggu: true,
    berhasil: true,
    gagal: true
  });
  const [pendingFilters, setPendingFilters] = useState({
    menunggu: true,
    berhasil: true,
    gagal: true
  });

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(trx => {
      // Filter by search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = trx.pengguna.toLowerCase().includes(searchLower) || 
                            trx.id.toLowerCase().includes(searchLower) ||
                            trx.fasilitas.toLowerCase().includes(searchLower);
      
      // Filter by status
      const noFilterSelected = !activeFilters.menunggu && !activeFilters.berhasil && !activeFilters.gagal;
      let matchesStatus = noFilterSelected;
      
      if (!noFilterSelected) {
        if (activeFilters.menunggu && trx.status === 'MENUNGGU') matchesStatus = true;
        if (activeFilters.berhasil && trx.status === 'BERHASIL') matchesStatus = true;
        if (activeFilters.gagal && trx.status === 'GAGAL') matchesStatus = true;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeFilters]);

  return (
    <div className="flex flex-col min-h-screen">
      {!showPDF ? (
        // ==========================================
        // LAYER 1: LAPORAN & STATISTIK
        // ==========================================
        <div className="flex flex-col gap-8 fade-in animate-in">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-[30px] font-bold text-[#1C2B1E] leading-tight">Laporan & Statistik</h1>
              <p className="text-[#6B7280] text-sm mt-1 max-w-md">
                Monitoring performa operasional dan distribusi pengguna secara real-time.
              </p>
            </div>
            <button 
              onClick={() => setShowPDF(true)}
              className="flex items-center gap-2 bg-[#F5E6D8] text-[#1C2B1E] px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-[#ebd5c1] transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ekspor PDF
            </button>
          </div>

          {/* SECTION 1: Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* KOLOM KIRI: Tren Pendapatan & Utilisasi (60% approx -> col-span-3) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-bold text-lg text-[#1C2B1E]">Tren Pendapatan & Utilisasi</h2>
                  <p className="text-sm text-[#6B7280]">Perbandingan mingguan antara target dan realisasi.</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider">
                  <div className="flex items-center gap-1.5 text-[#1C2B1E]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1C2B1E]"></span>
                    REALISASI
                  </div>
                  <div className="flex items-center gap-1.5 text-[#D4A574]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4A574]"></span>
                    TARGET
                  </div>
                </div>
              </div>
              <div className="h-[220px] w-full mt-auto">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#6B7280', fontWeight: 500 }} 
                      dy={10} 
                    />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="realisasi" 
                      stroke="#1C2B1E" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 0, fill: '#1C2B1E' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#D4A574" 
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 0, fill: '#D4A574' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KOLOM KANAN: User Demographics (40% approx -> col-span-2) */}
            <div className="lg:col-span-2 bg-[#1C2B1E] p-6 rounded-2xl shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-white/45 tracking-widest mb-1">USER DEMOGRAPHICS</p>
                <h2 className="text-[18px] font-bold text-white">User Types</h2>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="relative w-[150px] h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={70}
                        stroke="none"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Custom Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[22px] font-bold text-white leading-none">1.2k</span>
                    <span className="text-[10px] text-white/55 font-bold mt-1">TOTAL USERS</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4A574]"></span>
                    <span className="text-white text-sm font-medium">Public</span>
                    <span className="text-white/60 text-sm ml-2">65%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F]"></span>
                    <span className="text-white text-sm font-medium">Student</span>
                    <span className="text-white/60 text-sm ml-2">35%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* SECTION 2: Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-end bg-white rounded-t-2xl relative">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#6B7280] tracking-widest mb-1">DATA LOGS</p>
                <h2 className="text-[20px] font-bold text-[#1C2B1E]">Recent Transactions</h2>
              </div>
              
              <div className="flex gap-3 relative">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Cari data..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px] pl-9 pr-4 py-2 bg-[#F5F0EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4A574]/50"
                  />
                </div>
                <button 
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F5E6D8] text-[#1C2B1E] rounded-lg text-sm font-bold hover:bg-[#ebd5c1] transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                {/* Filter Popup Simulation */}
                {showFilter && (
                  <div className="absolute right-0 top-12 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-lg">Filter</h3>
                      <button onClick={() => {
                        setShowFilter(false);
                        setPendingFilters(activeFilters);
                      }} className="text-gray-400 hover:text-gray-600">×</button>
                    </div>
                    
                    <div className="mb-5">
                      <p className="text-[10px] uppercase font-bold text-[#1C2B1E] mb-3 tracking-wider">Status</p>
                      <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={pendingFilters.menunggu}
                            onChange={(e) => setPendingFilters({...pendingFilters, menunggu: e.target.checked})}
                            className="w-4 h-4 accent-[#D4A574] rounded" 
                          />
                          <span className="text-sm font-medium">Menunggu</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={pendingFilters.berhasil}
                            onChange={(e) => setPendingFilters({...pendingFilters, berhasil: e.target.checked})}
                            className="w-4 h-4 accent-[#D4A574] rounded" 
                          />
                          <span className="text-sm font-medium">Berhasil</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={pendingFilters.gagal}
                            onChange={(e) => setPendingFilters({...pendingFilters, gagal: e.target.checked})}
                            className="w-4 h-4 accent-[#D4A574] rounded" 
                          />
                          <span className="text-sm font-medium">Gagal</span>
                        </label>
                      </div>
                    </div>

                    <hr className="my-4 border-gray-100" />
                    
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => {
                          const reset = {menunggu: true, berhasil: true, gagal: true};
                          setPendingFilters(reset);
                          setActiveFilters(reset);
                        }}
                        className="text-sm text-[#1C2B1E] font-medium hover:text-[#D4A574] hover:underline transition-colors"
                      >
                        Atur Ulang
                      </button>
                      <button 
                        onClick={() => {
                          setActiveFilters(pendingFilters);
                          setShowFilter(false);
                        }}
                        className="px-5 py-2 bg-[#D4A574] hover:bg-[#c39564] text-white rounded-full text-sm font-bold transition-colors"
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
                  <tr className="border-b border-[#F5F0EB]">
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Order ID</th>
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Fasilitas</th>
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Pengguna</th>
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Tanggal</th>
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Nominal</th>
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(trx => (
                      <tr key={trx.id} className="border-b border-[#F5F0EB] hover:bg-gray-50/50 transition-colors">
                        <td className="py-[18px] px-6 text-[16px] font-bold text-[#1C2B1E]">{trx.id}</td>
                        <td className="py-[18px] px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F0EDE8] flex items-center justify-center text-[14px]">{trx.icon}</div>
                            <span className="font-medium text-sm text-[#1C2B1E]">{trx.fasilitas}</span>
                          </div>
                        </td>
                        <td className="py-[18px] px-6">
                          <p className="font-bold text-sm text-[#1C2B1E]">{trx.pengguna}</p>
                          <p className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider mt-0.5">{trx.kategori}</p>
                        </td>
                        <td className="py-[18px] px-6 text-sm text-[#6B7280] font-medium">{trx.tanggal}</td>
                        <td className="py-[18px] px-6 text-sm font-bold text-[#1C2B1E]">{trx.nominal}</td>
                        <td className="py-[18px] px-6">
                          {trx.status === 'BERHASIL' && <span className="bg-[#D4EDDA] text-[#2D6A4F] px-3 py-1.5 rounded-full text-xs font-bold inline-flex">BERHASIL</span>}
                          {trx.status === 'MENUNGGU' && <span className="bg-[#FDE8D8] text-[#C4622D] px-3 py-1.5 rounded-full text-xs font-bold inline-flex">MENUNGGU</span>}
                          {trx.status === 'GAGAL' && <span className="bg-[#FFEEEE] text-[#C0392B] px-3 py-1.5 rounded-full text-xs font-bold inline-flex">GAGAL</span>}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">Tidak ada data transaksi yang sesuai.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        // ==========================================
        // LAYER 2: EXPORT PDF PAGE
        // ==========================================
        <div className="flex flex-col fade-in animate-in pb-12">
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setShowPDF(false)}
              className="flex items-center gap-2 border border-[#1C2B1E] text-[#1C2B1E] hover:bg-[#1C2B1E]/5 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Laporan
            </button>
            <button className="flex items-center gap-2 bg-[#F5E6D8] text-[#1C2B1E] px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#ebd5c1] transition-colors">
              <Download className="w-4 h-4" />
              Unduh PDF
            </button>
          </div>

          {/* PDF Document Container */}
          <div className="w-full max-w-[850px] mx-auto bg-white shadow-xl min-h-[1100px] p-[40px] text-gray-800 rounded-sm">
            
            {/* Header Document */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[#1C2B1E] tracking-tight mb-1">MyUGO</h1>
                <p className="font-bold text-sm text-gray-800">UNIVERSITAS DIAN NUSWANTORO</p>
                <p className="text-xs text-gray-600 mt-0.5">Jl. Imam Bonjol No.207, Semarang</p>
              </div>
              <div className="text-right">
                <h2 className="text-lg font-bold text-[#1C2B1E] uppercase tracking-wider mb-3">LAPORAN MANAJEMEN FASILITAS</h2>
                <div className="text-xs text-gray-600 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-left inline-grid">
                  <span className="font-medium text-right">ID Laporan:</span>
                  <span className="font-semibold text-[#1C2B1E]">#UGO-2024-05-99</span>
                  <span className="font-medium text-right">Tanggal Cetak:</span>
                  <span className="font-semibold text-[#1C2B1E]">31 Mei 2024</span>
                  <span className="font-medium text-right">Periode:</span>
                  <span className="font-semibold text-[#1C2B1E]">Mei 2024</span>
                  <span className="font-medium text-right">Disusun Oleh:</span>
                  <span className="font-semibold text-[#1C2B1E]">System Admin</span>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-300 mb-8" />

            {/* RINGKASAN EKSEKUTIF */}
            <div className="mb-10">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Ringkasan Eksekutif</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Pendapatan</p>
                  <p className="text-xl font-bold text-[#1C2B1E]">Rp 42.850.000</p>
                  <p className="text-xs font-bold text-green-600 mt-1">▲ 12.5% vs Bulan Sebelumnya</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Sesi Booking</p>
                  <p className="text-xl font-bold text-[#1C2B1E]">1.248 <span className="text-sm font-medium">Sesi</span></p>
                  <p className="text-xs text-gray-500 mt-1">Rata-rata 41 sesi/hari</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Pengguna Aktif</p>
                  <p className="text-xl font-bold text-[#1C2B1E]">856 <span className="text-sm font-medium">Mahasiswa</span></p>
                  <p className="text-xs text-gray-500 mt-1">412 Free Bookings &bull; 62 Baru</p>
                </div>
              </div>
            </div>

            {/* UTILISASI FASILITAS UTAMA */}
            <div className="mb-10">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Utilisasi Fasilitas Utama</h3>
              <div className="space-y-4 max-w-lg">
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">Lapangan Futsal</span>
                    <span className="text-sm font-bold text-[#1C2B1E]">92%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-black rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">Gor Basket</span>
                    <span className="text-sm font-bold text-[#1C2B1E]">84%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1C2B1E] rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">Badminton Court</span>
                    <span className="text-sm font-bold text-[#1C2B1E]">76%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1C2B1E] opacity-70 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* RINCIAN TRANSAKSI TERAKHIR */}
            <div className="mb-16">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Rincian Transaksi Terakhir</h3>
              <table className="w-full text-left text-[12px] border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">ID TRX</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">DETAIL PENGGUNA</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">LAYANAN</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">TANGGAL</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700 text-right">NOMINAL</th>
                    <th className="py-2.5 px-3 font-bold text-center text-gray-700">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-3 font-mono border-r border-gray-300">TRX-94821</td>
                    <td className="py-3 px-3 border-r border-gray-300">Aditya Pratama (A11.2021.12345)</td>
                    <td className="py-3 px-3 border-r border-gray-300">Futsal A (2 Jam)</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">30 Mei 2024</td>
                    <td className="py-3 px-3 text-right font-semibold border-r border-gray-300">Rp 150.000</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-green-600 font-bold">SUCCESS</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-3 font-mono border-r border-gray-300">TRX-94822</td>
                    <td className="py-3 px-3 border-r border-gray-300">Siti Aminah (A11.2022.67890)</td>
                    <td className="py-3 px-3 border-r border-gray-300">Badminton Court 3</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">30 Mei 2024</td>
                    <td className="py-3 px-3 text-right font-semibold border-r border-gray-300">Rp 45.000</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-green-600 font-bold">SUCCESS</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-3 font-mono border-r border-gray-300">TRX-94823</td>
                    <td className="py-3 px-3 border-r border-gray-300">Budi Sudarsono (B12.2020.11223)</td>
                    <td className="py-3 px-3 border-r border-gray-300">Sewa Bola Basket MAHASISWA(FREE)</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">29 Mei 2024</td>
                    <td className="py-3 px-3 text-right font-semibold border-r border-gray-300">Rp 0</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-green-600 font-bold">FREE BOOKING</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">TRX-94824</td>
                    <td className="py-3 px-3 border-r border-gray-300">Rina Wijaya (C13.2023.55443)</td>
                    <td className="py-3 px-3 border-r border-gray-300">Gor Basket (Full)</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">29 Mei 2024</td>
                    <td className="py-3 px-3 text-right font-semibold border-r border-gray-300">Rp 250.000</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-red-600 font-bold">REFUNDED</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer Signatures */}
            <div className="grid grid-cols-2 gap-12 mt-20 mb-8">
              <div>
                <p className="text-[11px] font-bold uppercase mb-2 text-gray-600">Catatan Administrator:</p>
                <p className="text-[12px] italic text-gray-700 text-justify leading-relaxed">
                  "Peningkatan utilisasi sebesar 8% pada area futsal dikarenakan turnamen internal fakultas Ilmu Komputer. Implementasi kebijakan 'Free Booking' bagi mahasiswa terverifikasi menunjukkan antusiasme yang tinggi, mencapai 48% dari total sesi bulan ini."
                </p>
              </div>
              <div className="flex flex-col items-center justify-end text-sm">
                <p className="mb-12 font-medium">MENGETAHUI/MENGESAHKAN,</p>
                <div className="w-48 border-b border-black mb-2"></div>
                <p className="font-bold">Biro Kemahasiswaan UDINUS</p>
                <p className="text-[10px] text-gray-400 mt-1 font-mono">DIGITAL SIGNATURE VERIFIED</p>
              </div>
            </div>

            {/* Print Info Footer */}
            <div className="border-t border-gray-300 pt-4 mt-12 grid grid-cols-3 text-[10px] text-gray-500 font-medium">
              <div>KERAHASIAAN: KHUSUS INTERNAL</div>
              <div className="text-center">MYUGO MANAGEMENT SYSTEM &copy; 2024</div>
              <div className="text-right">HALAMAN 1 DARI 1</div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
