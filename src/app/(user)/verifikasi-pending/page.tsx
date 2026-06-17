"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { getBookingById, BookingDetail } from "@/lib/api/booking";
import axios from "axios";

function VerifikasiPendingContent() {
  const searchParams = useSearchParams();
  const bookingId = parseInt(searchParams.get("booking_id") || "0");

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError("Booking ID tidak ditemukan.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Gagal memuat data booking.");
        } else {
          setError("Terjadi kesalahan.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

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

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-6">
      <div className="w-24 h-24 bg-[#E5C3A6]/20 rounded-full flex items-center justify-center mx-auto border border-[#E5C3A6]/30 shadow-sm animate-pulse">
        <Clock className="w-12 h-12 text-[#8b5a2b]" />
      </div>
      <h1 className="text-3xl font-black text-[#1B3627] tracking-tight uppercase">
        Pengajuan Verifikasi Diajukan!
      </h1>
      <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
        Terima kasih! Dokumen TU Anda untuk booking **{booking.field_name}** telah kami terima. Status pengajuan Anda saat ini adalah **Menunggu Verifikasi** dari admin/Tata Usaha.
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

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 max-w-md mx-auto">
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
