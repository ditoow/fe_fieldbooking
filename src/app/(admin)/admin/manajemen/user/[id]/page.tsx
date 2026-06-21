"use client";

import { ArrowLeft, Ban, CheckCircle, Loader2, Mail, Phone, Hash, Clock, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAllUsers, updateUserStatus, User } from '@/lib/api/admin/user';
import { getAdminBookings } from '@/lib/api/admin/booking';
import { cancelBookingApi } from '@/lib/api/booking/cancel';
import type { BookingDetail } from '@/lib/api/booking/getOne';
import { useConfirm } from '@/lib/hooks/use-confirm';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingStatus, setIsProcessingStatus] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);
  const { confirm, ConfirmModal } = useConfirm();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [users, bookingsData] = await Promise.all([getAllUsers(), getAdminBookings({ user_id: params.id as string, per_page: 50 })]);
      const found = users.find(u => u.id === params.id);
      if (!found) { toast.error('User tidak ditemukan'); router.push('/admin/manajemen/user'); return; }
      setUser(found);
      setBookings(bookingsData);
    } catch (error) { console.error("Failed to fetch user detail", error); toast.error("Gagal memuat data user"); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [params.id]);

  const handleStatusToggle = async () => {
    if (!user) return;
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const actionText = newStatus === 'active' ? 'mengaktifkan' : 'memblokir (suspend)';
    const ok = await confirm({ title: newStatus === 'suspended' ? 'Suspend User' : 'Aktivasi User', message: `Yakin ingin ${actionText} pengguna ini?`, variant: 'destructive' });
    if (!ok) return;
    try { setIsProcessingStatus(true); await updateUserStatus(user.id, newStatus); setUser({ ...user, status: newStatus }); toast.success(`Status berhasil diubah menjadi ${newStatus}.`); }
    catch (error) { if (axios.isAxiosError(error)) toast.error(error.response?.data?.message || "Gagal mengubah status."); else toast.error("Terjadi kesalahan."); }
    finally { setIsProcessingStatus(false); }
  };

  const handleCancelBooking = async (bookingId: number) => {
    const ok = await confirm({ title: 'Batalkan Booking', message: 'Yakin ingin membatalkan booking ini?', variant: 'destructive' });
    if (!ok) return;
    try { setCancellingId(bookingId); await cancelBookingApi(String(bookingId)); toast.success('Booking berhasil dibatalkan'); await fetchData(); }
    catch (error) { if (axios.isAxiosError(error)) toast.error(error.response?.data?.message || "Gagal membatalkan booking."); else toast.error("Terjadi kesalahan."); }
    finally { setCancellingId(null); }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const getKategori = (u: User) => { if (u.roles?.some(r => r.name === 'admin')) return 'ADMIN'; if (u.roles?.some(r => r.name === 'mahasiswa')) return 'MAHASISWA'; return 'UMUM'; };
  const getKategoriBadge = (k: string) => k === 'ADMIN' ? 'bg-purple-100 text-purple-800' : k === 'MAHASISWA' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700';
  const getStatusBadge = (s: string) => {
    if (s === 'approved') return 'bg-blue-100 text-blue-700';
    if (s === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (s === 'rejected' || s === 'cancelled') return 'bg-red-100 text-red-700';
    if (s === 'expired') return 'bg-gray-100 text-gray-500';
    return 'bg-gray-100 text-gray-700';
  };
  const canCancel = (b: BookingDetail) => b.status === 'pending' || b.status === 'approved';

  if (isLoading) return <div className="flex justify-center items-center min-h-[400px]"><Loader2 className="w-8 h-8 animate-spin text-ugo-primary" /></div>;
  if (!user) return null;

  const kategori = getKategori(user);

  return (
    <div className="flex flex-col gap-6 fade-in animate-in">
      <button onClick={() => router.push('/admin/manajemen/user')} className="flex items-center gap-2 text-gray-500 hover:text-ugo-sidebar transition-colors w-fit"><ArrowLeft className="w-4 h-4" /><span className="text-sm font-medium">Kembali ke daftar user</span></button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-2xl bg-ugo-primary text-white font-bold flex items-center justify-center text-2xl shrink-0">{getInitials(user.name)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1"><h1 className="text-2xl font-bold text-ugo-sidebar truncate">{user.name}</h1><span className={`${getKategoriBadge(kategori)} px-3 py-0.5 rounded-full text-xs font-bold shrink-0`}>{kategori}</span></div>
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-gray-600 mt-3">
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{user.email}</span>
              {user.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{user.phone}</span>}
              {(user.user_number || user.student_id) && <span className="flex items-center gap-1.5"><Hash className="w-3.5 h-3.5 text-gray-400" />{user.user_number || user.student_id}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {user.status === 'active' ? <span className="flex items-center gap-1.5 text-sm font-bold text-green-700 bg-green-100 px-4 py-2 rounded-lg"><CheckCircle className="w-4 h-4" />Aktif</span>
            : <span className="flex items-center gap-1.5 text-sm font-bold text-red-700 bg-red-100 px-4 py-2 rounded-lg"><Ban className="w-4 h-4" />Suspended</span>}
            {kategori !== 'ADMIN' && <button onClick={handleStatusToggle} disabled={isProcessingStatus}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${user.status === 'active' ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'}`}>
              {isProcessingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : user.status === 'active' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {user.status === 'active' ? 'Suspend' : 'Aktivasi'}
            </button>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100"><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">RIWAYAT BOOKING</p><h2 className="text-xl font-bold text-[#1C2B1E]">Booking {user.name}</h2></div>
        <div className="overflow-x-auto min-h-[200px]">
          {bookings.length === 0 ? <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 gap-3"><Clock className="w-10 h-10" /><p className="font-medium">User ini belum memiliki booking</p></div>
          : <table className="w-full text-left border-collapse">
              <thead><tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">No. Booking</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Lapangan</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Tanggal</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Status</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500">Kehadiran</th>
                <th className="py-3 px-6 text-xs uppercase font-semibold text-gray-500 text-center">Aksi</th>
              </tr></thead>
              <tbody>{bookings.map(b => (
                <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-sm font-semibold text-ugo-sidebar">{b.booking_number}</td>
                  <td className="py-4 px-6"><p className="font-semibold text-sm text-ugo-sidebar">{b.field_name}</p><p className="text-xs text-gray-500">{b.formatted_time}</p></td>
                  <td className="py-4 px-6 text-sm text-gray-600">{b.formatted_date}</td>
                  <td className="py-4 px-6"><span className={`${getStatusBadge(b.status)} px-3 py-1 rounded-full text-xs font-bold inline-flex`}>{b.status.charAt(0).toUpperCase() + b.status.slice(1)}</span></td>
                  <td className="py-4 px-6">{b.is_attended ? <span className="flex items-center gap-1.5 text-xs font-bold text-green-700"><CheckCircle className="w-3.5 h-3.5" />Hadir</span> : <span className="text-xs text-gray-400">{b.status === 'approved' ? 'Belum Hadir' : '-'}</span>}</td>
                  <td className="py-4 px-6 text-center">{canCancel(b) && <button onClick={() => handleCancelBooking(b.id)} disabled={cancellingId === b.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 border border-red-100 transition-colors disabled:opacity-50">{cancellingId === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}Cancel</button>}</td>
                </tr>
              ))}</tbody>
            </table>}
        </div>
      </div>
      <ConfirmModal />
    </div>
  );
}
