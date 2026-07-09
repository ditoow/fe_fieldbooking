"use client";

import { Ban, CheckCircle, FileCheck, Loader2, X, Eye, UserCheck, Clock, Search, Filter } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getAdminBookings, approveBooking, rejectBooking, attendBooking } from '@/lib/api/admin/booking';
import { useConfirm } from '@/lib/hooks/use-confirm';
import type { BookingDetail } from '@/lib/api/booking/getOne';
import axios from 'axios';
import toast from 'react-hot-toast';

type TabType = 'verifikasi' | 'kehadiran';

export default function AdminBookingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('verifikasi');
  const [pendingBookings, setPendingBookings] = useState<BookingDetail[]>([]);
  const [approvedBookings, setApprovedBookings] = useState<BookingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [isProcessingApprove, setIsProcessingApprove] = useState(false);
  const [isProcessingReject, setIsProcessingReject] = useState(false);
  const [isProcessingAttend, setIsProcessingAttend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [bookingTypeFilter, setBookingTypeFilter] = useState<'all' | 'requirement' | 'payment'>('all');
  const [showFilter, setShowFilter] = useState(false);
  const { confirm, ConfirmModal } = useConfirm();
    

  const filterByDate = (bookings: BookingDetail[], filter: string) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return bookings.filter(b => {
      const bookingDate = new Date(b.created_at);
      if (filter === 'today') return bookingDate >= startOfToday;
      if (filter === 'week') return bookingDate >= startOfWeek;
      if (filter === 'month') return bookingDate >= startOfMonth;
      return true;
    });
  };

  const filteredPending = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return filterByDate(pendingBookings, dateFilter).filter(b => {
      if (bookingTypeFilter !== 'all' && b.booking_type !== bookingTypeFilter) return false;
      const u = b.user as { name?: string; email?: string } | undefined;
      return !q || b.booking_number.toLowerCase().includes(q) || (u?.name || '').toLowerCase().includes(q) || (u?.email || '').toLowerCase().includes(q) || b.field_name.toLowerCase().includes(q);
    });
  }, [pendingBookings, searchQuery, dateFilter, bookingTypeFilter]);

  const filteredApproved = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return filterByDate(approvedBookings, dateFilter).filter(b => {
      if (bookingTypeFilter !== 'all' && b.booking_type !== bookingTypeFilter) return false;
      const u = b.user as { name?: string; email?: string } | undefined;
      return !q || b.booking_number.toLowerCase().includes(q) || (u?.name || '').toLowerCase().includes(q) || (u?.email || '').toLowerCase().includes(q) || b.field_name.toLowerCase().includes(q);
    });
  }, [approvedBookings, searchQuery, dateFilter, bookingTypeFilter]);

  const fetchPendingBookings = async () => {
    try { setIsLoading(true); const data = await getAdminBookings({ status: 'pending', booking_type: 'requirement', per_page: 50 }); setPendingBookings(data); }
    catch (error) { console.error("Failed to fetch pending bookings", error); } finally { setIsLoading(false); }
  };

  const fetchApprovedBookings = async () => {
    try { const data = await getAdminBookings({ status: 'approved', per_page: 50 }); setApprovedBookings(data); }
    catch (error) { console.error("Failed to fetch approved bookings", error); }
  };

  useEffect(() => {
    if (activeTab === 'verifikasi') fetchPendingBookings();
    else fetchApprovedBookings().finally(() => setIsLoading(false));
  }, [activeTab]);

  const handleApprove = async (id: number) => {
    const ok = await confirm({ title: 'Setujui Pemesanan', message: 'Yakin ingin menyetujui pemesanan ini?' });
    if (!ok) return;
    try { setIsProcessingApprove(true); await approveBooking(id); setSelectedBooking(null); toast.success('Pemesanan berhasil disetujui'); await fetchPendingBookings(); }
    catch (error) { if (axios.isAxiosError(error)) toast.error(error.response?.data?.message || "Gagal menyetujui pemesanan."); else toast.error("Terjadi kesalahan."); }
    finally { setIsProcessingApprove(false); }
  };

  const handleReject = async (id: number) => {
    const ok = await confirm({ title: 'Tolak Pemesanan', message: 'Yakin ingin menolak pemesanan ini?', variant: 'destructive' });
    if (!ok) return;
    try { setIsProcessingReject(true); await rejectBooking(id); setSelectedBooking(null); toast.success('Pemesanan ditolak'); await fetchPendingBookings(); }
    catch (error) { if (axios.isAxiosError(error)) toast.error(error.response?.data?.message || "Gagal menolak pemesanan."); else toast.error("Terjadi kesalahan."); }
    finally { setIsProcessingReject(false); }
  };

  const handleAttend = async (id: number) => {
    const ok = await confirm({ title: 'Catat Kehadiran', message: 'Tandai booking ini sebagai sudah hadir?' });
    if (!ok) return;
    try { setIsProcessingAttend(true); await attendBooking(id); toast.success('Kehadiran berhasil dicatat'); await fetchApprovedBookings(); }
    catch (error) { if (axios.isAxiosError(error)) toast.error(error.response?.data?.message || "Gagal mencatat kehadiran."); else toast.error("Terjadi kesalahan."); }
    finally { setIsProcessingAttend(false); }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col gap-6 fade-in animate-in">
        <div><h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Pemesanan</h1>
          <p className="text-gray-500 text-sm">Kelola pemesanan mahasiswa — verifikasi persyaratan dan catat kehadiran.</p></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {(['verifikasi', 'kehadiran'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors ${activeTab === tab ? 'bg-white text-ugo-sidebar shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab === 'verifikasi' ? <FileCheck className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                {tab === 'verifikasi' ? 'Verifikasi' : 'Kehadiran'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari No. Pemesanan, nama, lapangan..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ugo-primary/20" />
            </div>
            <div className="relative">
              <button onClick={() => setShowFilter(!showFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-ugo-primary text-white rounded-lg text-sm font-medium hover:bg-ugo-primary/90 transition-colors">
                <Filter className="w-4 h-4" /> Filter
              </button>
              {showFilter && (
                <div className="absolute right-0 top-10 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-3 z-20">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Filter Waktu</p>
                  {(['all', 'today', 'week', 'month'] as const).map(opt => (
                    <button key={opt} onClick={() => setDateFilter(opt)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dateFilter === opt ? 'bg-ugo-primary/10 text-ugo-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {opt === 'all' ? 'Semua Waktu' : opt === 'today' ? 'Hari Ini' : opt === 'week' ? 'Minggu Ini' : 'Bulan Ini'}
                    </button>
                  ))}
                  <hr className="my-2 border-gray-100" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Tipe Pemesanan</p>
                  {(['all', 'requirement', 'payment'] as const).map(opt => (
                    <button key={opt} onClick={() => setBookingTypeFilter(opt)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${bookingTypeFilter === opt ? 'bg-ugo-primary/10 text-ugo-primary' : 'text-gray-600 hover:bg-gray-50'}`}>
                      {opt === 'all' ? 'Semua' : opt === 'requirement' ? 'Mahasiswa' : 'Umum'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {activeTab === 'verifikasi' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
              <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">MENUNGGU VERIFIKASI</p><h2 className="text-xl font-bold text-[#1C2B1E]">Pemesanan Mahasiswa</h2></div>
              <span className="text-xs text-gray-500">Total menunggu: {filteredPending.length}</span>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
              {isLoading ? <div className="flex justify-center items-center h-[300px]"><Loader2 className="w-8 h-8 animate-spin text-ugo-primary" /></div>
              : filteredPending.length === 0 ? <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 gap-3"><FileCheck className="w-12 h-12" /><p className="font-medium">Tidak ada booking yang cocok</p></div>
              : <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">No. Pemesanan</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Mahasiswa</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Lapangan & Waktu</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Tanggal</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Harga</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Dokumen</th>
                  </tr></thead>
                  <tbody>{filteredPending.map(b => {
                    const u = b.user as { id: string; name: string; email: string; student_id?: string } | undefined;
                    return <tr key={b.id} onClick={() => setSelectedBooking(b)} className="border-b border-gray-50 hover:bg-ugo-primary/5 transition-colors cursor-pointer">
                      <td className="py-4 px-6 font-mono text-sm font-semibold text-ugo-sidebar">{b.booking_number}</td>
                      <td className="py-4 px-6"><div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-ugo-primary/10 text-ugo-primary font-bold flex items-center justify-center text-sm">{u ? getInitials(u.name) : '?'}</div>
                        <div><p className="font-bold text-sm text-ugo-sidebar">{u?.name || '-'}</p><p className="text-xs text-gray-500">{u?.email || ''}</p></div>
                      </div></td>
                      <td className="py-4 px-6"><p className="font-semibold text-sm text-ugo-sidebar">{b.field_name}</p><p className="text-xs text-gray-500">{b.formatted_time}</p></td>
                      <td className="py-4 px-6 text-sm text-gray-600">{b.formatted_date}</td>
                      <td className="py-4 px-6 font-semibold text-sm">Rp {b.booking_type === 'requirement' ? '0' : b.total_price.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-6">{b.file_url ? <span className="inline-flex items-center gap-1.5 text-xs font-medium text-ugo-primary bg-ugo-primary/5 px-3 py-1.5 rounded-full"><Eye className="w-3.5 h-3.5" />Lihat</span> : <span className="text-xs text-gray-400">-</span>}</td>
                    </tr>;
                  })}</tbody>
                </table>}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mt-6">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
              <div><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">KEHADIRAN</p><h2 className="text-xl font-bold text-[#1C2B1E]">Catat Kehadiran</h2></div>
              <span className="text-xs text-gray-500">Total: {filteredApproved.length}</span>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
              {isLoading ? <div className="flex justify-center items-center h-[300px]"><Loader2 className="w-8 h-8 animate-spin text-ugo-primary" /></div>
              : filteredApproved.length === 0 ? <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 gap-3"><UserCheck className="w-12 h-12" /><p className="font-medium">Belum ada booking yang disetujui</p></div>
              : <table className="w-full text-left border-collapse">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">No. Pemesanan</th><th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Nama</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Lapangan & Waktu</th><th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Tanggal</th>
                    <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Status Hadir</th><th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500 text-center">Aksi</th>
                  </tr></thead>
                  <tbody>{filteredApproved.map(b => {
                    const u = b.user as { id: string; name: string; email: string } | undefined;
                    return <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-mono text-sm font-semibold text-ugo-sidebar">{b.booking_number}</td>
                      <td className="py-4 px-6"><div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-ugo-primary/10 text-ugo-primary font-bold flex items-center justify-center text-sm">{u ? getInitials(u.name) : '?'}</div>
                        <div><p className="font-bold text-sm text-ugo-sidebar">{u?.name || '-'}</p><p className="text-xs text-gray-500">{u?.email || ''}</p></div>
                      </div></td>
                      <td className="py-4 px-6"><p className="font-semibold text-sm text-ugo-sidebar">{b.field_name}</p><p className="text-xs text-gray-500">{b.formatted_time}</p></td>
                      <td className="py-4 px-6 text-sm text-gray-600">{b.formatted_date}</td>
                      <td className="py-4 px-6">{b.is_attended ? <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-full"><CheckCircle className="w-3.5 h-3.5" />Hadir</span> : <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full"><Clock className="w-3.5 h-3.5" />Belum Hadir</span>}</td>
                      <td className="py-4 px-6 text-center">{!b.is_attended && <button onClick={() => handleAttend(b.id)} disabled={isProcessingAttend} className="inline-flex items-center gap-2 px-4 py-2 bg-ugo-primary text-white rounded-lg text-sm font-bold hover:bg-ugo-primary/90 transition-colors disabled:opacity-50">{isProcessingAttend ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}Tandai Hadir</button>}</td>
                    </tr>;
                  })}</tbody>
                </table>}
            </div>
          </div>
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-100 rounded-t-3xl">
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pratinjau Pemesanan</p><h2 className="text-lg font-bold text-ugo-sidebar mt-0.5">{selectedBooking.booking_number}</h2></div>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mahasiswa</p><p className="font-bold text-ugo-sidebar text-sm">{(selectedBooking.user as { name?: string })?.name || '-'}</p><p className="text-xs text-gray-500">{(selectedBooking.user as { email?: string })?.email || ''}</p></div>
                <div className="bg-gray-50 rounded-xl p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lapangan</p><p className="font-bold text-ugo-sidebar text-sm">{selectedBooking.field_name}</p><p className="text-xs text-gray-500">{selectedBooking.field_category}</p></div>
                <div className="bg-gray-50 rounded-xl p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tanggal & Waktu</p><p className="font-bold text-ugo-sidebar text-sm">{selectedBooking.formatted_date}</p><p className="text-xs text-gray-500">{selectedBooking.formatted_time}</p></div>
                <div className="bg-gray-50 rounded-xl p-4"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Harga</p><p className="font-bold text-ugo-sidebar text-sm">Rp {selectedBooking.booking_type === 'requirement' ? '0' : selectedBooking.total_price.toLocaleString('id-ID')}</p></div>
              </div>
              <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Dokumen Persyaratan</p>
                {selectedBooking.file_url ? <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50"><iframe src={selectedBooking.file_url} className="w-full h-[400px]" title="Document Preview" /></div>
                : <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-400"><FileCheck className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm font-medium">Belum ada dokumen yang diunggah</p></div>}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleApprove(selectedBooking.id)} disabled={isProcessingApprove || isProcessingReject} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">{isProcessingApprove ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}Setujui Pemesanan</button>
                <button onClick={() => handleReject(selectedBooking.id)} disabled={isProcessingApprove || isProcessingReject} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">{isProcessingReject ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}Tolak Pemesanan</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal />
    </div>
  );
}
