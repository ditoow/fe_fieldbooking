"use client";

import { Search, Filter, Check, X, Paperclip, Download, ArrowLeft } from 'lucide-react';
import { useState, useMemo } from 'react';

const verifications = [
  {
    id: '#U-1024',
    initials: 'AS',
    avatarColor: 'bg-[#2D4A30]',
    name: 'Aditya Saputra',
    email: 'aditya.s@university.id',
    kategori: 'MAHASISWA',
    kategoriBadgeClass: 'bg-green-100 text-green-800',
    dokumen: 'KTM_Verify.pdf',
    status: 'Menunggu',
  },
  {
    id: '#U-1025',
    initials: 'RM',
    avatarColor: 'bg-[#D4A574]',
    name: 'Rina Melati',
    email: 'rina.melati@gmail.com',
    kategori: 'UMUM',
    kategoriBadgeClass: 'bg-gray-100 text-gray-700',
    dokumen: 'KTP_Final.jpg',
    status: 'Disetujui',
  },
  {
    id: '#U-1026',
    initials: 'FK',
    avatarColor: 'bg-[#2D6A4F]',
    name: 'Farhan Kurnia',
    email: 'farhan_k@edu.com',
    kategori: 'MAHASISWA',
    kategoriBadgeClass: 'bg-green-100 text-green-800',
    dokumen: 'KTM_Draft.pdf',
    status: 'Ditolak',
  },
  {
    id: '#U-1027',
    initials: 'BL',
    avatarColor: 'bg-blue-600',
    name: 'Budi Laksono',
    email: 'budi_laksono@outlook.com',
    kategori: 'UMUM',
    kategoriBadgeClass: 'bg-gray-100 text-gray-700',
    dokumen: 'Identity_Card.png',
    status: 'Menunggu',
  }
];

export default function VerifikasiUserPage() {
  const [showFilter, setShowFilter] = useState(false);
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
  const [showPDF, setShowPDF] = useState(false);

  const filteredVerifications = useMemo(() => {
    return verifications.filter(v => {
      // Filter by search
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = v.name.toLowerCase().includes(searchLower) || 
                            v.id.toLowerCase().includes(searchLower) ||
                            v.email.toLowerCase().includes(searchLower);
      
      // Filter by status
      const noFilterSelected = !activeFilters.menunggu && !activeFilters.disetujui && !activeFilters.ditolak;
      let matchesStatus = noFilterSelected;
      
      if (!noFilterSelected) {
        if (activeFilters.menunggu && v.status === 'Menunggu') matchesStatus = true;
        if (activeFilters.disetujui && v.status === 'Disetujui') matchesStatus = true;
        if (activeFilters.ditolak && v.status === 'Ditolak') matchesStatus = true;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, activeFilters]);

  return (
    <div className="flex flex-col min-h-screen">
      {!showPDF ? (
        <div className="flex flex-col gap-6 fade-in animate-in">
          {/* Header */}
      <div>
        <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Verifikasi User</h1>
        <p className="text-gray-500 text-sm">
          Kelola dan tinjau permintaan verifikasi dari pengguna baru. Pastikan dokumen identitas valid sebelum menyetujui akses ke sistem pemesanan.
        </p>
      </div>

      {/* Banner */}
      <div className="bg-ugo-sidebar rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-end shadow-lg gap-6 md:gap-0">
        <div className="flex flex-col gap-5 w-full md:w-auto">
          <h2 className="text-xl font-bold text-white tracking-wide">Status Verifikasi Hari Ini</h2>
          <div className="flex items-center gap-4 sm:gap-8 flex-wrap sm:flex-nowrap">
            <div>
              <p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">TOTAL REQUEST</p>
              <p className="text-3xl font-bold text-white">124</p>
            </div>
            <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>
            <div>
              <p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">APPROVED</p>
              <p className="text-3xl font-bold text-white">98</p>
            </div>
            <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>
            <div>
              <p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">PENDING</p>
              <p className="text-3xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setShowPDF(true)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F5E6D8] hover:bg-[#ebd5c1] text-[#1C2B1E] rounded-lg text-sm font-bold shadow-sm transition-colors mb-1"
        >
          Eksport Laporan Harian
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-end items-center bg-white rounded-t-2xl relative">
          <div className="flex gap-3 relative">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Cari ID, nama, atau email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/20"
              />
            </div>
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 px-4 py-2 bg-ugo-primary text-white rounded-lg text-sm font-medium hover:bg-ugo-primary/90 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>

            {/* Filter Dialog Simulation */}
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
                  <p className="text-[10px] uppercase font-bold text-ugo-sidebar mb-3 tracking-wider">Status</p>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pendingFilters.menunggu}
                        onChange={(e) => setPendingFilters({...pendingFilters, menunggu: e.target.checked})}
                        className="w-4 h-4 accent-ugo-primary rounded" 
                      />
                      <span className="text-sm font-medium">Menunggu</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pendingFilters.disetujui}
                        onChange={(e) => setPendingFilters({...pendingFilters, disetujui: e.target.checked})}
                        className="w-4 h-4 accent-ugo-primary rounded" 
                      />
                      <span className="text-sm font-medium">Disetujui</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={pendingFilters.ditolak}
                        onChange={(e) => setPendingFilters({...pendingFilters, ditolak: e.target.checked})}
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
                    }}
                    className="text-sm text-ugo-sidebar font-medium hover:text-ugo-primary hover:underline transition-colors"
                  >
                    Atur Ulang
                  </button>
                  <button 
                    onClick={() => {
                      setActiveFilters(pendingFilters);
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
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">ID User</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Nama User</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Kategori</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Dokumen</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Status</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredVerifications.length > 0 ? (
                filteredVerifications.map((v) => (
                  <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-sm text-ugo-sidebar">{v.id}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${v.avatarColor} text-white font-bold flex items-center justify-center text-sm`}>
                          {v.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-ugo-sidebar">{v.name}</p>
                          <p className="text-xs text-gray-500">{v.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`${v.kategoriBadgeClass} px-3 py-1 rounded-full text-xs font-bold inline-flex`}>{v.kategori}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="underline decoration-gray-300 underline-offset-2">{v.dokumen}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {v.status === 'Menunggu' && <span className="bg-ugo-status-menunggu-bg text-ugo-status-menunggu-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Menunggu</span>}
                      {v.status === 'Disetujui' && <span className="bg-ugo-status-disetujui-bg text-ugo-status-disetujui-text px-3 py-1 rounded-full text-xs font-bold inline-flex">Disetujui</span>}
                      {v.status === 'Ditolak' && <span className="bg-ugo-status-ditolak-bg text-ugo-status-ditolak-text px-3 py-1 rounded-full text-xs font-bold inline-flex uppercase">Ditolak</span>}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {v.status === 'Menunggu' ? (
                        <div className="flex gap-2 justify-center">
                          <button className="w-8 h-8 rounded-lg bg-ugo-status-disetujui-bg text-ugo-status-disetujui-text flex items-center justify-center hover:bg-green-200 transition-colors">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg bg-ugo-status-ditolak-bg text-ugo-status-ditolak-text flex items-center justify-center hover:bg-red-200 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-gray-400 italic">Sudah Diproses</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-medium">Tidak ada pengguna yang sesuai.</td>
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
              Kembali
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
                <h2 className="text-lg font-bold text-[#1C2B1E] uppercase tracking-wider mb-3">LAPORAN VERIFIKASI USER</h2>
                <div className="text-xs text-gray-600 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-left inline-grid">
                  <span className="font-medium text-right">ID Laporan:</span>
                  <span className="font-semibold text-[#1C2B1E]">#UGO-VER-2405</span>
                  <span className="font-medium text-right">Tanggal Cetak:</span>
                  <span className="font-semibold text-[#1C2B1E]">17 Mei 2026</span>
                  <span className="font-medium text-right">Dicetak Oleh:</span>
                  <span className="font-semibold text-[#1C2B1E]">Admin Verifikasi</span>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-300 mb-8" />

            {/* RINGKASAN */}
            <div className="mb-10">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Ringkasan Verifikasi</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Permintaan</p>
                  <p className="text-xl font-bold text-[#1C2B1E]">124</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Disetujui</p>
                  <p className="text-xl font-bold text-green-700">98</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Menunggu/Ditolak</p>
                  <p className="text-xl font-bold text-[#D4A574]">12 / 14</p>
                </div>
              </div>
            </div>

            {/* HISTORY PENGGUNA TERVERIFIKASI */}
            <div className="mb-16">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Log History Verifikasi Harian</h3>
              <table className="w-full text-left text-[12px] border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">WAKTU</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">ID USER</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">NAMA & KONTAK</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">KATEGORI</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">DOKUMEN</th>
                    <th className="py-2.5 px-3 font-bold text-center text-gray-700">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">14:32 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1025</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Rina Melati</p>
                      <p className="text-gray-500 text-[10px]">rina.melati@gmail.com</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">UMUM</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">KTP_Final.jpg</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-green-600 font-bold">APPROVED</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-gray-50/50">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">14:15 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1024</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Aditya Saputra</p>
                      <p className="text-gray-500 text-[10px]">aditya.s@university.id</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">MAHASISWA</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">KTM_Verify.pdf</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-orange-500 font-bold">PENDING</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">13:45 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1026</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Farhan Kurnia</p>
                      <p className="text-gray-500 text-[10px]">farhan_k@edu.com</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">MAHASISWA</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">KTM_Draft.pdf</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-red-600 font-bold">REJECTED</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-gray-50/50">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">11:20 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1027</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Budi Laksono</p>
                      <p className="text-gray-500 text-[10px]">budi.laksono@outlook.com</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">UMUM</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">Identity_Card.png</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-orange-500 font-bold">PENDING</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">10:05 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1028</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Siti Masyitoh</p>
                      <p className="text-gray-500 text-[10px]">sitimas2001@yahoo.com</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">MAHASISWA</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">Scan_KTM.jpeg</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-green-600 font-bold">APPROVED</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-gray-50/50">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">09:12 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1029</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Ahmad Fauzan</p>
                      <p className="text-gray-500 text-[10px]">fauzan.a@university.id</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">MAHASISWA</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">KTM_Fauzan.pdf</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-green-600 font-bold">APPROVED</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">08:30 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1030</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Kevin Sanjaya</p>
                      <p className="text-gray-500 text-[10px]">kevin.s@gmail.com</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">UMUM</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">KTP_Buram.jpg</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-red-600 font-bold">REJECTED</span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-gray-50/50">
                    <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">07:55 WIB</td>
                    <td className="py-3 px-3 font-mono border-r border-gray-300">#U-1031</td>
                    <td className="py-3 px-3 border-r border-gray-300">
                      <p className="font-semibold">Putri Maharani</p>
                      <p className="text-gray-500 text-[10px]">putri.m@university.id</p>
                    </td>
                    <td className="py-3 px-3 border-r border-gray-300">MAHASISWA</td>
                    <td className="py-3 px-3 border-r border-gray-300 text-gray-600">KTM_Putri.pdf</td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-green-600 font-bold">APPROVED</span>
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
                  "Verifikasi harian berjalan lancar. Terdapat beberapa pengguna dengan dokumen yang tidak jelas, sehingga ditolak. Silakan pastikan pengguna mengunggah dokumen dengan resolusi tinggi."
                </p>
              </div>
              <div className="flex flex-col items-center justify-end text-sm">
                <p className="mb-12 font-medium">MENGETAHUI/MENGESAHKAN,</p>
                <div className="w-48 border-b border-black mb-2"></div>
                <p className="font-bold">Admin Verifikasi UGO</p>
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
