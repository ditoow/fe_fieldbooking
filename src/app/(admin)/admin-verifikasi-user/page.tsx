"use client";

import { Search, Filter, Ban, CheckCircle, Download, ArrowLeft, Loader2, FileCheck, X, Eye } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { getAllUsers, updateUserStatus, User } from '@/lib/api/admin/user';
import { getAdminBookings, approveBooking, rejectBooking } from '@/lib/api/admin/booking';
import type { BookingDetail } from '@/lib/api/booking/getOne';
import axios from 'axios';

type TabType = 'booking' | 'user';

export default function VerifikasiUserPage() {
  const [activeTab, setActiveTab] = useState<TabType>('booking');
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessingId, setIsProcessingId] = useState<string | number | null>(null);

  const [activeFilters, setActiveFilters] = useState({
    active: true,
    suspended: true,
  });
  const [pendingFilters, setPendingFilters] = useState({
    active: true,
    suspended: true,
  });
  
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [isProcessingApprove, setIsProcessingApprove] = useState(false);
  const [isProcessingReject, setIsProcessingReject] = useState(false);
  const [showPDF, setShowPDF] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const data = await getAdminBookings({ status: 'pending', booking_type: 'requirement', per_page: 50 });
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'booking') {
      fetchBookings();
    } else {
      fetchUsers().finally(() => setIsLoading(false));
    }
  }, [activeTab]);

  const handleApprove = async (id: number) => {
    if (!window.confirm('Yakin ingin menyetujui booking ini?')) return;
    try {
      setIsProcessingApprove(true);
      await approveBooking(id);
      setSelectedBooking(null);
      await fetchBookings();
    } catch (error) {
      console.error("Gagal approve booking:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menyetujui booking.");
      } else {
        alert("Terjadi kesalahan.");
      }
    } finally {
      setIsProcessingApprove(false);
    }
  };

  const handleReject = async (id: number) => {
    if (!window.confirm('Yakin ingin menolak booking ini?')) return;
    try {
      setIsProcessingReject(true);
      await rejectBooking(id);
      setSelectedBooking(null);
      await fetchBookings();
    } catch (error) {
      console.error("Gagal reject booking:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal menolak booking.");
      } else {
        alert("Terjadi kesalahan.");
      }
    } finally {
      setIsProcessingReject(false);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    const actionText = newStatus === 'active' ? 'mengaktifkan' : 'memblokir (suspend)';
    
    if (!window.confirm(`Yakin ingin ${actionText} pengguna ini?`)) return;

    try {
      setIsProcessingId(id);
      await updateUserStatus(id, newStatus);
      await fetchUsers();
      alert(`Status pengguna berhasil diubah menjadi ${newStatus}.`);
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Gagal mengubah status pengguna.");
      } else {
        alert("Terjadi kesalahan.");
      }
    } finally {
      setIsProcessingId(null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getKategori = (user: User) => {
    if (user.roles?.some(r => r.name === 'admin')) return 'ADMIN';
    if (user.roles?.some(r => r.name === 'mahasiswa')) return 'MAHASISWA';
    return 'UMUM';
  };

  const getKategoriBadge = (kategori: string) => {
    if (kategori === 'ADMIN') return 'bg-purple-100 text-purple-800';
    if (kategori === 'MAHASISWA') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-700';
  };

  const filteredUsers = useMemo(() => {
    return users.filter(v => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = v.name.toLowerCase().includes(searchLower) || 
                            (v.user_number && v.user_number.toLowerCase().includes(searchLower)) ||
                            v.email.toLowerCase().includes(searchLower);
      
      const noFilterSelected = !activeFilters.active && !activeFilters.suspended;
      let matchesStatus = noFilterSelected;
      
      if (!noFilterSelected) {
        if (activeFilters.active && v.status === 'active') matchesStatus = true;
        if (activeFilters.suspended && v.status === 'suspended') matchesStatus = true;
      }
      
      return matchesSearch && matchesStatus;
    });
  }, [users, searchQuery, activeFilters]);

  const totalActive = users.filter(u => u.status === 'active').length;
  const totalSuspended = users.filter(u => u.status === 'suspended').length;

  return (
    <div className="flex flex-col min-h-screen">
      {!showPDF ? (
        <div className="flex flex-col gap-6 fade-in animate-in">
          {/* Header */}
      <div>
        <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Verifikasi & Manajemen</h1>
        <p className="text-gray-500 text-sm">
          Kelola booking yang menunggu verifikasi serta daftar pengguna aplikasi.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('booking')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            activeTab === 'booking' ? 'bg-white text-ugo-sidebar shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          Verifikasi Booking
        </button>
        <button
          onClick={() => setActiveTab('user')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            activeTab === 'user' ? 'bg-white text-ugo-sidebar shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Filter className="w-4 h-4" />
          Manajemen User
        </button>
      </div>

      {activeTab === 'user' && (
        <>
          <div className="bg-ugo-sidebar rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-start md:items-end shadow-lg gap-6 md:gap-0">
            <div className="flex flex-col gap-5 w-full md:w-auto">
              <h2 className="text-xl font-bold text-white tracking-wide">Statistik Pengguna</h2>
              <div className="flex items-center gap-4 sm:gap-8 flex-wrap sm:flex-nowrap">
                <div>
                  <p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">TOTAL USER</p>
                  <p className="text-3xl font-bold text-white">{users.length}</p>
                </div>
                <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>
                <div>
                  <p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">AKTIF</p>
                  <p className="text-3xl font-bold text-white">{totalActive}</p>
                </div>
                <div className="hidden sm:block w-[1px] h-10 bg-white/10"></div>
                <div>
                  <p className="text-[11px] text-[#D4A574] uppercase tracking-widest font-bold mb-1">SUSPENDED</p>
                  <p className="text-3xl font-bold text-white">{totalSuspended}</p>
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
        </>
      )}

      {activeTab === 'booking' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-t-2xl">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">MENUNGGU VERIFIKASI</p>
              <h2 className="text-xl font-bold text-[#1C2B1E]">Booking Mahasiswa</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Total menunggu: {bookings.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-ugo-primary" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 gap-3">
                <FileCheck className="w-12 h-12" />
                <p className="font-medium">Tidak ada booking yang menunggu verifikasi</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">No. Booking</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Mahasiswa</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Lapangan & Waktu</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Tanggal</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Harga</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Dokumen</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => {
                    const userData = b.user as { id: string; name: string; email: string; student_id?: string } | undefined;
                    return (
                      <tr
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className="border-b border-gray-50 hover:bg-ugo-primary/5 transition-colors cursor-pointer"
                      >
                        <td className="py-4 px-6 font-mono text-sm font-semibold text-ugo-sidebar">
                          {b.booking_number}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-ugo-primary/10 text-ugo-primary font-bold flex items-center justify-center text-sm">
                              {userData ? getInitials(userData.name) : '?'}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-ugo-sidebar">{userData?.name || '-'}</p>
                              <p className="text-xs text-gray-500">{userData?.email || ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-semibold text-sm text-ugo-sidebar">{b.field_name}</p>
                          <p className="text-xs text-gray-500">{b.formatted_time}</p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">{b.formatted_date}</td>
                        <td className="py-4 px-6 font-semibold text-sm">
                          Rp {b.total_price.toLocaleString('id-ID')}
                        </td>
                        <td className="py-4 px-6">
                          {b.file_url ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ugo-primary bg-ugo-primary/5 px-3 py-1.5 rounded-full">
                              <Eye className="w-3.5 h-3.5" />
                              Lihat
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-t-2xl relative">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">DATA PENGGUNA</p>
              <h2 className="text-xl font-bold text-[#1C2B1E]">Daftar Pengguna</h2>
            </div>
            <div className="flex gap-3 relative w-full sm:w-auto">
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

              {showFilter && (
                <div className="absolute right-0 top-12 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-20">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Filter Status</h3>
                    <button onClick={() => {
                      setShowFilter(false);
                      setPendingFilters(activeFilters);
                    }} className="text-gray-400 hover:text-gray-600">×</button>
                  </div>
                  <div className="mb-5">
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={pendingFilters.active}
                          onChange={(e) => setPendingFilters({...pendingFilters, active: e.target.checked})}
                          className="w-4 h-4 accent-ugo-primary rounded" 
                        />
                        <span className="text-sm font-medium">Aktif</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={pendingFilters.suspended}
                          onChange={(e) => setPendingFilters({...pendingFilters, suspended: e.target.checked})}
                          className="w-4 h-4 accent-ugo-primary rounded" 
                        />
                        <span className="text-sm font-medium">Suspended</span>
                      </label>
                    </div>
                  </div>

                  <hr className="my-4 border-gray-100" />
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => {
                        const reset = {active: true, suspended: true};
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
                      Terapkan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-ugo-primary" />
              </div>
            ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">ID / NIM</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Nama User</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Kategori</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Status</th>
                  <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((v) => {
                    const kategori = getKategori(v);
                    return (
                      <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-sm text-ugo-sidebar whitespace-nowrap">
                          {v.user_number || v.student_id || '-'}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-ugo-primary text-white font-bold flex items-center justify-center text-sm`}>
                              {getInitials(v.name)}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-ugo-sidebar">{v.name}</p>
                              <p className="text-xs text-gray-500">{v.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`${getKategoriBadge(kategori)} px-3 py-1 rounded-full text-xs font-bold inline-flex`}>
                            {kategori}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          {v.status === 'active' ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold inline-flex">Aktif</span>
                          ) : (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold inline-flex uppercase">Suspended</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex gap-2 justify-center">
                            <button 
                              onClick={() => handleUpdateStatus(v.id, v.status)}
                              disabled={isProcessingId === v.id || kategori === 'ADMIN'}
                              title={kategori === 'ADMIN' ? 'Tidak dapat mengubah status admin' : (v.status === 'active' ? 'Suspend User' : 'Aktifkan User')}
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                                ${v.status === 'active' 
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                                  : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'
                                }`}
                            >
                              {isProcessingId === v.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : v.status === 'active' ? (
                                <Ban className="w-4 h-4" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500 font-medium">Tidak ada pengguna yang sesuai.</td>
                  </tr>
                )}
              </tbody>
            </table>
            )}
          </div>
        </div>
      )}
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
                <h2 className="text-lg font-bold text-[#1C2B1E] uppercase tracking-wider mb-3">LAPORAN DATA USER</h2>
                <div className="text-xs text-gray-600 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-left inline-grid">
                  <span className="font-medium text-right">ID Laporan:</span>
                  <span className="font-semibold text-[#1C2B1E]">#UGO-USR-2405</span>
                  <span className="font-medium text-right">Tanggal Cetak:</span>
                  <span className="font-semibold text-[#1C2B1E]">{new Date().toLocaleDateString('id-ID')}</span>
                  <span className="font-medium text-right">Dicetak Oleh:</span>
                  <span className="font-semibold text-[#1C2B1E]">Admin UGO</span>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-300 mb-8" />

            {/* RINGKASAN */}
            <div className="mb-10">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Ringkasan Pengguna</h3>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Pengguna</p>
                  <p className="text-xl font-bold text-[#1C2B1E]">{users.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Aktif</p>
                  <p className="text-xl font-bold text-green-700">{totalActive}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Suspended</p>
                  <p className="text-xl font-bold text-red-600">{totalSuspended}</p>
                </div>
              </div>
            </div>

            {/* HISTORY PENGGUNA */}
            <div className="mb-16">
              <h3 className="font-bold text-sm uppercase tracking-widest text-[#1C2B1E] mb-4">Daftar Pengguna</h3>
              <table className="w-full text-left text-[12px] border border-gray-300">
                <thead>
                  <tr className="border-b border-gray-300 bg-gray-50">
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">TANGGAL DAFTAR</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">ID / NIM</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">NAMA & KONTAK</th>
                    <th className="py-2.5 px-3 font-bold border-r border-gray-300 text-gray-700">KATEGORI</th>
                    <th className="py-2.5 px-3 font-bold text-center text-gray-700">STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 15).map((u, i) => (
                    <tr key={u.id} className={`border-b border-gray-300 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                      <td className="py-3 px-3 font-mono border-r border-gray-300 text-gray-600">
                        {new Date(u.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="py-3 px-3 font-mono border-r border-gray-300">{u.user_number || u.student_id || '-'}</td>
                      <td className="py-3 px-3 border-r border-gray-300">
                        <p className="font-semibold">{u.name}</p>
                        <p className="text-gray-500 text-[10px]">{u.email}</p>
                      </td>
                      <td className="py-3 px-3 border-r border-gray-300">{getKategori(u)}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={u.status === 'active' ? "text-green-600 font-bold uppercase" : "text-red-600 font-bold uppercase"}>
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {/* Preview Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100 rounded-t-3xl">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Preview Booking</p>
                <h2 className="text-lg font-bold text-ugo-sidebar mt-0.5">{selectedBooking.booking_number}</h2>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mahasiswa</p>
                  <p className="font-bold text-ugo-sidebar text-sm">
                    {(selectedBooking.user as { name?: string })?.name || '-'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedBooking.user as { email?: string })?.email || ''}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lapangan</p>
                  <p className="font-bold text-ugo-sidebar text-sm">{selectedBooking.field_name}</p>
                  <p className="text-xs text-gray-500">{selectedBooking.field_category}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal & Waktu</p>
                  <p className="font-bold text-ugo-sidebar text-sm">{selectedBooking.formatted_date}</p>
                  <p className="text-xs text-gray-500">{selectedBooking.formatted_time}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Harga</p>
                  <p className="font-bold text-ugo-sidebar text-sm">
                    Rp {selectedBooking.total_price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Document Preview */}
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dokumen Persyaratan</p>
                {selectedBooking.file_url ? (
                  <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <iframe
                      src={selectedBooking.file_url}
                      className="w-full h-[400px]"
                      title="Document Preview"
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400">
                    <FileCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">Belum ada dokumen yang diunggah</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleApprove(selectedBooking.id)}
                  disabled={isProcessingApprove || isProcessingReject}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingApprove ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Setujui Booking
                </button>
                <button
                  onClick={() => handleReject(selectedBooking.id)}
                  disabled={isProcessingApprove || isProcessingReject}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessingReject ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                  Tolak Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
