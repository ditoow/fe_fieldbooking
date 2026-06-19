"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Clock, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { getBookingById, BookingDetail } from "@/lib/api/booking";
import axios from "axios";

function VerifikasiPendingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = parseInt(searchParams.get("booking_id") || "0");

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooking = useCallback(async (): Promise<string | null> => {
    if (!bookingId) {
      setError("Booking ID tidak ditemukan.");
      setIsLoading(false);
      return null;
    }

    try {
      const data = await getBookingById(bookingId);
      setBooking(data);
      setIsLoading(false);
      return data.status;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Gagal memuat data booking.");
      } else {
        setError("Terjadi kesalahan.");
      }
      setIsLoading(false);
      return null;
    }
  }, [bookingId]);

  useEffect(() => {
    let terminated = false;

    const poll = async () => {
      const status = await fetchBooking();
      if (status === 'approved' || status === 'rejected' || status === 'cancelled' || status === 'expired') {
        terminated = true;
        return;
      }
      if (!terminated) {
        setTimeout(poll, 5000);
      }
    };

    poll();
    return () => { terminated = true; };
  }, [fetchBooking]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#1B3627] animate-spin mb-4" />
        <p className="text-[#1B3627] font-semibold text-sm">Memuat data...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-bold text-red-500">{error || "Booking tidak ditemukan."}</p>
        <Link href="/dashboard" className="text-sm text-[#1B3627] underline mt-4 inline-block">
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  if (booking.status === 'approved') {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto border border-green-200 shadow-sm">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-black text-[#1B3627] tracking-tight uppercase">
          Booking Disetujui!
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Selamat! Dokumen TU Anda untuk booking <strong>{booking.field_name}</strong> telah diverifikasi dan disetujui oleh admin.
          Silakan cek riwayat pemesanan untuk detail lebih lanjut.
        </p>
        
        <div className="bg-[#F5F2E9]/80 p-6 rounded-2xl border border-green-200 text-left space-y-4 max-w-md mx-auto shadow-sm">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>NOMOR BOOKING</span>
            <span className="font-bold text-[#1B3627]">{booking.booking_number}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>LAPANGAN</span>
            <span className="font-bold text-[#1B3627]">{booking.field_name}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>TANGGAL</span>
            <span className="font-bold text-[#1B3627]">{booking.formatted_date}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>WAKTU</span>
            <span className="font-bold text-[#1B3627]">{booking.formatted_time}</span>
          </div>
          <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>STATUS</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
              Disetujui
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto">
          <Link
            href="/riwayat"
            className="flex-grow bg-[#1B3627] hover:bg-[#132A1D] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-lg shadow-[#1B3627]/10"
          >
            Lihat Riwayat Pemesanan
          </Link>
          <Link
            href="/dashboard"
            className="flex-grow bg-white hover:bg-gray-50 text-[#1B3627] border border-gray-200 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-sm"
          >
            Kembali Ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (booking.status === 'rejected') {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto border border-red-200 shadow-sm">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-[#1B3627] tracking-tight uppercase">
          Booking Ditolak
        </h1>
        <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
          Maaf, pengajuan booking <strong>{booking.field_name}</strong> Anda ditolak oleh admin.
          Silakan ajukan booking ulang dengan dokumen yang sesuai.
        </p>
        
        <div className="bg-[#F5F2E9]/80 p-6 rounded-2xl border border-red-200 text-left space-y-4 max-w-md mx-auto shadow-sm">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>NOMOR BOOKING</span>
            <span className="font-bold text-[#1B3627]">{booking.booking_number}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>LAPANGAN</span>
            <span className="font-bold text-[#1B3627]">{booking.field_name}</span>
          </div>
          <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>STATUS</span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
              Ditolak
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto">
          <Link
            href="/dashboard"
            className="flex-grow bg-[#1B3627] hover:bg-[#132A1D] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-lg shadow-[#1B3627]/10"
          >
            Booking Ulang
          </Link>
          <Link
            href="/riwayat"
            className="flex-grow bg-white hover:bg-gray-50 text-[#1B3627] border border-gray-200 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-sm"
          >
            Lihat Riwayat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-6">
      <div className="w-24 h-24 bg-[#E5C3A6]/20 rounded-full flex items-center justify-center mx-auto border border-[#E5C3A6]/30 shadow-sm animate-pulse">
        <Clock className="w-12 h-12 text-[#8b5a2b]" />
      </div>
      <h1 className="text-3xl font-black text-[#1B3627] tracking-tight uppercase">
        Pengajuan Verifikasi Diajukan!
      </h1>
      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
        Terima kasih! Dokumen TU Anda untuk booking <strong>{booking.field_name}</strong> telah kami terima. Status pengajuan Anda saat ini adalah <strong>Menunggu Verifikasi</strong> dari admin/Tata Usaha. Halaman ini akan diperbarui secara otomatis ketika status berubah.
      </p>
      
      <div className="bg-[#F5F2E9]/80 p-6 rounded-2xl border border-[#E5C3A6]/30 text-left space-y-4 max-w-md mx-auto shadow-sm">
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
          <span>NOMOR BOOKING</span>
          <span className="font-bold text-[#1B3627]">{booking.booking_number}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
          <span>LAPANGAN</span>
          <span className="font-bold text-[#1B3627]">{booking.field_name}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
          <span>TANGGAL</span>
          <span className="font-bold text-[#1B3627]">{booking.formatted_date}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
          <span>WAKTU</span>
          <span className="font-bold text-[#1B3627]">{booking.formatted_time}</span>
        </div>
        <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center text-[10px] font-bold text-gray-500">
          <span>STATUS</span>
          <span className="bg-[#E5C3A6]/30 text-[#8b5a2b] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
            Menunggu Verifikasi
          </span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <Loader2 className="w-3 h-3 animate-spin" />
        Memeriksa status setiap 5 detik...
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 max-w-md mx-auto">
        <Link
          href="/dashboard"
          className="flex-grow bg-[#1B3627] hover:bg-[#132A1D] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-lg shadow-[#1B3627]/10"
        >
          Kembali Ke Dashboard
        </Link>
        <Link
          href="/riwayat"
          className="flex-grow bg-white hover:bg-gray-50 text-[#1B3627] border border-gray-200 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center shadow-sm"
        >
          Lihat Riwayat Pemesanan
        </Link>
      </div>
    </div>
  );
}

export default function VerifikasiPendingPage() {
  return (
    <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5] text-[#1B3627]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Suspense fallback={<div className="text-center py-20 font-bold text-gray-500">Memuat Halaman...</div>}>
          <VerifikasiPendingContent />
        </Suspense>
      </div>
    </div>
  );
}
