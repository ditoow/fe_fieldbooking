"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Download, Info, ShieldCheck, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getBookingById, BookingDetail } from "@/lib/api/booking";
import { formatBookingNumber } from "@/lib/utils";
import axios from "axios";
import { useAuth } from "@/lib/context/AuthContext";

function InvoiceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = parseInt(searchParams.get("booking_id") || "0");

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  
  const { user } = useAuth();
  const role = user?.roles?.[0]?.name || "umum";

  const isSandbox =
    !process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL.includes("localhost") ||
    process.env.NEXT_PUBLIC_API_URL.includes("127.0.0.1") ||
    process.env.NEXT_PUBLIC_API_URL.includes("sandbox");

  const midtransDomain = isSandbox
    ? "api.sandbox.midtrans.com"
    : "api.midtrans.com";
  const qrImageUrl =
    booking?.qr_image_url ||
    (booking?.qr_string && booking.qr_string.startsWith("http")
      ? booking.qr_string
      : booking?.qr_id
        ? `https://${midtransDomain}/v2/qris/${booking.qr_id}/qr-code`
        : "");

  // Fetch data booking dari BE
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

        // Hitung sisa waktu dari expires_at BE
        if (data.expires_at) {
          const expiryTime = new Date(data.expires_at).getTime();
          const now = Date.now();
          const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
          setTimeLeft(remaining);
        }
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

  // Polling status booking jika masih pending
  useEffect(() => {
    if (!bookingId || !booking || booking.status !== "pending") return;

    const pollInterval = setInterval(async () => {
      try {
        const data = await getBookingById(bookingId);
        if (data.status !== "pending") {
          setBooking(data);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error("Gagal melakukan polling status booking:", err);
      }
    }, 5000); // Polling setiap 5 detik

    return () => clearInterval(pollInterval);
  }, [bookingId, booking]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  const formatRupiah = (angka: number) =>
    new Intl.NumberFormat("id-ID").format(angka);

  const handleCancelOrder = async () => {
    if (!bookingId) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        },
      );
      router.push("/riwayat");
    } catch {
      router.push("/riwayat");
    }
  };

  const handleDownloadQr = () => {
    if (!qrImageUrl) return;

    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `QRIS_${booking?.booking_number || "Payment"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-[#1B3627] animate-spin mb-4" />
        <p className="text-[#1B3627] font-semibold text-sm">
          Memuat data transaksi...
        </p>
      </div>
    );
  }

  // Error State
  if (error || !booking) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-bold text-red-500">
          {error || "Booking tidak ditemukan."}
        </p>
        <Link
          href="/dashboard"
          className="text-sm text-[#1B3627] underline mt-4 inline-block"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  // Success State (Approved)
  if (booking.status === "approved") {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-24 h-24 bg-[#E5C3A6]/20 rounded-full flex items-center justify-center mx-auto border border-[#E5C3A6]/30 shadow-sm animate-bounce">
          <ShieldCheck className="w-12 h-12 text-[#8b5a2b]" />
        </div>
        <h1 className="text-3xl font-black text-[#1B3627] tracking-tight uppercase">
          Pembayaran Berhasil!
        </h1>

        <div className="bg-[#F5F2E9]/80 p-6 rounded-2xl border border-[#E5C3A6]/30 text-left space-y-4 max-w-md mx-auto shadow-sm">
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>NOMOR PESANAN</span>
            <span className="font-bold text-[#1B3627]">
              {formatBookingNumber(booking.booking_number)}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>TANGGAL</span>
            <span className="font-bold text-[#1B3627]">
              {booking.formatted_date}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-gray-500">
            <span>WAKTU</span>
            <span className="font-bold text-[#1B3627]">
              {booking.formatted_time}
            </span>
          </div>
          <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-600">
              TOTAL DIBAYAR
            </span>
            <span className="text-lg font-black text-[#1B3627]">
              {role === "mahasiswa" ? "Rp 0" : `Rp ${formatRupiah(booking.total_price)}`}
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

  // Failed State (Expired / Cancelled / Rejected)
  if (
    booking.status === "expired" ||
    booking.status === "cancelled" ||
    booking.status === "rejected"
  ) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4 space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100 shadow-sm">
          <XCircle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-black text-[#1B3627] tracking-tight uppercase">
          Transaksi Gagal
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed">
          Pemesanan untuk **{booking.field_name}** telah dibatalkan,
          kedaluwarsa, atau ditolak. Silakan melakukan pemesanan ulang dari
          dashboard.
        </p>
        <div className="pt-6">
          <Link
            href="/dashboard"
            className="inline-block bg-[#1B3627] hover:bg-[#132A1D] text-white py-4 px-8 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md"
          >
            Kembali Ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8">
      <div className="lg:col-span-7 space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase text-[#1B3627] mb-4">
            SELESAIKAN
            <br />
            TRANSAKSI ANDA
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            Silakan pindai kode QR di samping menggunakan aplikasi perbankan
            atau e-wallet pilihan Anda untuk mengonfirmasi pesanan Pivactive Anda.
          </p>
        </div>

        <div className="bg-[#F5F2E9]/80 p-8 rounded-2xl border border-[#E5C3A6]/30 space-y-6 shadow-sm">
          {/* Booking Number dari BE */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-6">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              ID TRANSAKSI
            </span>
            <span className="text-sm font-black text-[#1B3627]">
              {formatBookingNumber(booking.booking_number)}
            </span>
          </div>

          {/* Field & Jadwal */}
          <div className="flex justify-between items-center border-b border-gray-200 pb-6">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              LAPANGAN
            </span>
            <span className="text-sm font-bold text-[#1B3627]">
              {booking.field_name}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-6">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              TANGGAL
            </span>
            <span className="text-sm font-bold text-[#1B3627]">
              {booking.formatted_date}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-200 pb-6">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              WAKTU
            </span>
            <span className="text-sm font-bold text-[#1B3627]">
              {booking.formatted_time}
            </span>
          </div>

          {/* Total Harga dari BE */}
          <div className="flex justify-between items-center pb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              TOTAL TAGIHAN
            </span>
            <span className="text-2xl font-black text-[#1B3627]">
              {role === "mahasiswa" ? "Rp 0" : `Rp ${formatRupiah(booking.total_price)}`}
            </span>
          </div>

          {/* Info expires_at */}
          {booking.expires_at && (
            <div className="bg-[#E5C3A6]/20 p-4 rounded-xl flex gap-3 items-start border border-[#E5C3A6]/40">
              <Info className="w-5 h-5 text-[#8b5a2b] shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-[#8b5a2b] leading-relaxed">
                Pemesanan akan otomatis dibatalkan jika pembayaran tidak
                diselesaikan dalam 10 menit.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={handleDownloadQr}
            className="flex-1 bg-[#8b5a2b] hover:bg-[#724a23] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#8b5a2b]/20 flex justify-center items-center gap-2"
          >
            <Download className="w-4 h-4" /> Unduh QR Code
          </button>
          <Link
            href="/dashboard"
            className="flex-1 bg-white hover:bg-gray-50 text-[#1B3627] border border-gray-200 py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex justify-center items-center text-center"
          >
            Kembali Ke Dashboard
          </Link>
        </div>

        {/* Tombol cancel hanya untuk mahasiswa yang masih pending */}
        {booking.status === "pending" && (
          <div className="pt-2">
            <button
              onClick={handleCancelOrder}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-2 shadow-sm"
            >
              <XCircle className="w-4 h-4" /> Batalkan Pesanan
            </button>
          </div>
        )}
      </div>

      <div className="lg:col-span-5 space-y-5">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg shadow-gray-200/40 border border-gray-100 flex flex-col items-center text-center">
          {/* Timer hanya tampil kalau ada expires_at */}
          {booking.expires_at && (
            <div className="mb-6 w-full">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                SISA WAKTU PEMBAYARAN
              </p>
              <h2
                className={`text-3xl font-black mt-2 tracking-tight transition-colors duration-300 ${
                  timeLeft < 60
                    ? "text-red-500 animate-pulse"
                    : "text-[#1B3627]"
                }`}
              >
                {minutes}:{seconds}
              </h2>
            </div>
          )}

          {/* QR Code */}
          <div className="w-full max-w-[260px]">
            <div className="bg-[#F5F2E9] rounded-xl px-4 py-3 mb-4">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Scan dengan Aplikasi Pembayaran
              </p>
            </div>

            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 w-full aspect-square flex items-center justify-center relative">
              {qrImageUrl ? (
                <a
                  href={qrImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={qrImageUrl}
                    alt="QR Code QRIS"
                    className="w-full h-full object-contain"
                  />
                </a>
              ) : (
                <div className="flex items-center justify-center text-gray-400 text-xs text-center font-medium">
                  {booking.booking_type === "requirement"
                    ? "Tidak memerlukan pembayaran"
                    : "Memuat QRIS..."}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="2" width="8" height="8" rx="1" />
                <rect x="14" y="2" width="8" height="8" rx="1" />
                <rect x="2" y="14" width="8" height="8" rx="1" />
                <path d="M14 14h3v3h-3z" />
                <rect x="17" y="17" width="5" height="5" rx="1" />
              </svg>
              QRIS
            </div>
          </div>
        </div>

        {/* Informasi pembayaran */}
        <div className="bg-[#F5F2E9]/60 rounded-2xl p-5 border border-[#E5C3A6]/20">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#1B3627]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-[#1B3627]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-bold text-[#1B3627]">
                Panduan Pembayaran
              </p>
              <ol className="text-[10px] text-gray-500 mt-2 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>
                  Buka aplikasi{" "}
                  {booking.booking_type === "requirement"
                    ? "perbankan"
                    : "GoPay / OVO / Mobile Banking"}
                </li>
                <li>
                  Pilih menu <strong className="text-[#1B3627]">QRIS</strong>
                </li>
                <li>Scan kode QR di samping</li>
                <li>Konfirmasi pembayaran</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InvoicePage() {
  return (
    <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5] text-[#1B3627]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Suspense
          fallback={
            <div className="text-center py-20 font-bold text-gray-500">
              Memuat Tagihan...
            </div>
          }
        >
          <InvoiceContent />
        </Suspense>
      </div>
    </div>
  );
}
