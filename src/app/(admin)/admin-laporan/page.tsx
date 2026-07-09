"use client";

import { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Search, 
  Filter, 
  CircleDashed,
  Activity,
  Loader2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  getTransactionsReport,
  getDemographicsReport,
  getPdfReportData,
  TransactionReportItem,
  DemographicItem,
  PdfReportData
} from '@/lib/api/admin/reports';
import { getRevenueTrend, RevenueTrendItem } from '@/lib/api/admin/dashboard';

function LaporanPage() {
  const [showPDF, setShowPDF] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State data dinamis dari API
  const [transactions, setTransactions] = useState<TransactionReportItem[]>([]);
  const [demographics, setDemographics] = useState<DemographicItem[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrendItem[]>([]);
  const [pdfData, setPdfData] = useState<PdfReportData | null>(null);
  
  // State Loading
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  // Fetch data laporan utama & tren pendapatan mingguan
  useEffect(() => {
    const fetchBaseData = async () => {
      setLoading(true);
      try {
        const [txList, demoRes, trendRes] = await Promise.all([
          getTransactionsReport(searchQuery),
          getDemographicsReport(),
          getRevenueTrend()
        ]);
        setTransactions(txList);
        setDemographics(demoRes.data);
        setTotalUsers(demoRes.total_users);
        setRevenueTrend(trendRes);
      } catch (error) {
        console.error("Gagal memuat data laporan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBaseData();
  }, [searchQuery]);

  // Fetch data PDF secara on-demand saat layer PDF diaktifkan
  useEffect(() => {
    if (showPDF) {
      const fetchPdfReport = async () => {
        setPdfLoading(true);
        try {
          const data = await getPdfReportData();
          setPdfData(data);
        } catch (error) {
          console.error("Gagal memuat data laporan PDF:", error);
        } finally {
          setPdfLoading(false);
        }
      };
      fetchPdfReport();
    }
  }, [showPDF]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(trx => {
      // Filter status di client side agar instant & responsive
      const noFilterSelected = !activeFilters.menunggu && !activeFilters.berhasil && !activeFilters.gagal;
      let matchesStatus = noFilterSelected;
      
      if (!noFilterSelected) {
        if (activeFilters.menunggu && trx.status === 'MENUNGGU') matchesStatus = true;
        if (activeFilters.berhasil && trx.status === 'BERHASIL') matchesStatus = true;
        if (activeFilters.gagal && trx.status === 'GAGAL') matchesStatus = true;
      }
      
      return matchesStatus;
    });
  }, [transactions, activeFilters]);

  const publicData = demographics.find(d => d.name === 'Public');
  const studentData = demographics.find(d => d.name === 'Student');
  const publicValue = publicData?.value || 0;
  const studentValue = studentData?.value || 0;
  const publicPercent = totalUsers > 0 ? Math.round((publicValue / totalUsers) * 100) : 0;
  const studentPercent = totalUsers > 0 ? Math.round((studentValue / totalUsers) * 100) : 0;

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
                  <p className="text-sm text-[#6B7280]">Perbandingan mingguan realisasi pendapatan.</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-wider">
                  <div className="flex items-center gap-1.5 text-[#2D6A4F]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2D6A4F]"></span>
                    REALISASI
                  </div>
                </div>
              </div>
              <div className="h-[220px] w-full mt-auto flex items-center justify-center">
                {loading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F]" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRealisasiLaporan" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2D6A4F" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#2D6A4F" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
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
                      <Area 
                        type="monotone" 
                        dataKey="realisasi" 
                        stroke="#2D6A4F" 
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorRealisasiLaporan)"
                        dot={{ r: 5, strokeWidth: 2, stroke: '#2D6A4F', fill: 'white' }}
                        activeDot={{ r: 7, fill: '#2D6A4F', stroke: 'white', strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* KOLOM KANAN: User Demographics (40% approx -> col-span-2) */}
            <div className="lg:col-span-2 bg-[#1C2B1E] p-6 rounded-2xl shadow-sm flex flex-col items-center justify-between">
              <div className="w-full text-left mb-6">
                <p className="text-[10px] uppercase font-bold text-white/45 tracking-widest mb-1">USER DEMOGRAPHICS</p>
                <h2 className="text-[18px] font-bold text-white">User Types</h2>
              </div>
              
              <div className="flex flex-col items-center justify-center flex-1 w-full gap-8">
                {loading ? (
                  <div className="h-[220px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                ) : (
                  <>
                    <div className="relative w-[220px] h-[220px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={demographics}
                            cx="50%"
                            cy="50%"
                            innerRadius={75}
                            outerRadius={105}
                            stroke="none"
                            dataKey="value"
                          >
                            {demographics.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Custom Center Label */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[32px] font-bold text-white leading-none">
                          {totalUsers >= 1000 ? `${(totalUsers / 1000).toFixed(1)}k` : totalUsers}
                        </span>
                        <span className="text-[12px] text-white/55 font-bold mt-1">TOTAL USERS</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-8 w-full mt-2">
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                        <span className="w-3 h-3 rounded-full bg-[#D4A574]"></span>
                        <span className="text-white text-sm font-medium">Public</span>
                        <span className="text-white/80 text-sm font-bold ml-2">{publicPercent}%</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl">
                        <span className="w-3 h-3 rounded-full bg-[#2D6A4F]"></span>
                        <span className="text-white text-sm font-medium">Student</span>
                        <span className="text-white/80 text-sm font-bold ml-2">{studentPercent}%</span>
                      </div>
                    </div>
                  </>
                )}
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
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Jadwal Main</th>
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Pembayaran</th>
                    <th className="py-4 px-6 text-[11px] uppercase font-bold text-[#6B7280]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex justify-center items-center gap-2 text-gray-500">
                          <Loader2 className="w-5 h-5 animate-spin text-[#2D6A4F]" />
                          <span className="font-semibold text-sm">Memuat data transaksi...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map(trx => (
                      <tr key={trx.id} className="border-b border-[#F5F0EB] hover:bg-gray-50/50 transition-colors">
                        <td className="py-[18px] px-6 text-[14px] font-bold text-[#1C2B1E]">{trx.id}</td>
                        <td className="py-[18px] px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F0EDE8] flex items-center justify-center text-[14px] shrink-0">{trx.icon}</div>
                            <span className="font-medium text-sm text-[#1C2B1E]">{trx.fasilitas}</span>
                          </div>
                        </td>
                        <td className="py-[18px] px-6">
                          <p className="font-bold text-sm text-[#1C2B1E]">{trx.pengguna}</p>
                          <p className="text-[10px] uppercase font-bold text-[#6B7280] tracking-wider mt-0.5">{trx.kategori}</p>
                        </td>
                        <td className="py-[18px] px-6">
                          <p className="text-sm font-semibold text-[#1C2B1E]">{trx.tanggal}</p>
                          <p className="text-xs text-[#6B7280] font-medium mt-0.5">{trx.waktu} <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded ml-1">{trx.durasi}</span></p>
                        </td>
                        <td className="py-[18px] px-6">
                          <p className="text-sm font-bold text-[#1C2B1E]">{trx.nominal}</p>
                          <p className="text-[11px] font-medium text-[#6B7280] mt-0.5">{trx.metodePembayaran}</p>
                        </td>
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
          {pdfLoading ? (
            <div className="w-full max-w-[850px] mx-auto bg-white shadow-xl min-h-[500px] flex justify-center items-center rounded-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#1C2B1E]" />
                <span className="text-sm font-medium text-gray-500">Mengompilasi data laporan...</span>
              </div>
            </div>
          ) : (
            /* PDF Document Container */
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
                    <span className="font-semibold text-[#1C2B1E]">{pdfData?.report_id || '-'}</span>
                    <span className="font-medium text-right">Tanggal Cetak:</span>
                    <span className="font-semibold text-[#1C2B1E]">{pdfData?.print_date || '-'}</span>
                    <span className="font-medium text-right">Periode:</span>
                    <span className="font-semibold text-[#1C2B1E]">{pdfData?.print_date ? pdfData.print_date.split(' ').slice(1).join(' ') : '-'}</span>
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
                    <p className="text-xl font-bold text-[#1C2B1E]">
                      Rp {pdfData?.summary.total_revenue.toLocaleString('id-ID') || '0'}
                    </p>
                    <p className="text-xs font-bold text-green-600 mt-1">{pdfData?.summary.revenue_trend}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Sesi Booking</p>
                    <p className="text-xl font-bold text-[#1C2B1E]">{pdfData?.summary.total_bookings || 0} <span className="text-sm font-medium">Sesi</span></p>
                    <p className="text-xs text-gray-500 mt-1">Operasional GOR Aktif</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-1">Pengguna Aktif</p>
                    <p className="text-xl font-bold text-[#1C2B1E]">{pdfData?.summary.active_users || 0} <span className="text-sm font-medium">Pengguna</span></p>
                    <p className="text-xs text-gray-500 mt-1">Bulan Berjalan</p>
                  </div>
                </div>
              </div>

              {/* UTILISASI FASILITAS UTAMA */}
              <div className="mb-10">
                <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Utilisasi Fasilitas Utama</h3>
                <div className="space-y-4 max-w-lg">
                  {pdfData?.utilization.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-sm font-semibold text-gray-800">{item.field_name}</span>
                        <span className="text-sm font-bold text-[#1C2B1E]">{item.rate}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${item.rate}%` }}></div>
                      </div>
                    </div>
                  ))}
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
                    {pdfData?.transactions.map((trx, idx) => (
                      <tr key={idx} className="border-b border-gray-300">
                        <td className="py-3 px-3 font-mono border-r border-gray-300">{trx.id}</td>
                        <td className="py-3 px-3 border-r border-gray-300">{trx.user_detail}</td>
                        <td className="py-3 px-3 border-r border-gray-300">{trx.layanan}</td>
                        <td className="py-3 px-3 border-r border-gray-300 text-gray-600">{trx.tanggal}</td>
                        <td className="py-3 px-3 text-right font-semibold border-r border-gray-300">{trx.nominal}</td>
                        <td className="py-3 px-3 text-center">
                          <span className={`font-bold ${trx.status === 'SUCCESS' ? 'text-green-600' : 'text-[#C4622D]'}`}>{trx.status}</span>
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan={6} className="py-3 text-center text-gray-500">Tidak ada transaksi.</td>
                      </tr>
                    )}
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
        )}
      </div>
    )}
  </div>
  );
}

export default dynamic(() => Promise.resolve(LaporanPage), { ssr: false });
