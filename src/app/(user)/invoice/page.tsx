"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Download, Info, ShieldCheck, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getBookingById, BookingDetail } from "@/lib/api/booking";
import axios from "axios";

function InvoiceContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = parseInt(searchParams.get("booking_id") || "0");

    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(600);

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

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
            setTimeLeft((prev) => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
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
                }
            );
            router.push("/riwayat");
        } catch {
            router.push("/riwayat");
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#8CB954] animate-spin mb-4" />
                <p className="text-[#1B3627] font-semibold text-sm">Memuat data transaksi...</p>
            </div>
        );
    }

    // Error State
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8">

            <div className="lg:col-span-7 space-y-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase text-[#1B3627] mb-4">
                        SELESAIKAN<br />TRANSAKSI ANDA
                    </h1>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                        Silakan pindai kode QR di samping menggunakan aplikasi perbankan atau e-wallet pilihan Anda untuk mengonfirmasi pesanan MyUGO Anda.
                    </p>
                </div>

                <div className="bg-[#F5F2E9]/80 p-8 rounded-2xl border border-[#E5C3A6]/30 space-y-6 shadow-sm">
                    {/* Booking Number dari BE */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-6">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID TRANSAKSI</span>
                        <span className="text-sm font-black text-[#1B3627]">{booking.booking_number}</span>
                    </div>

                    {/* Field & Jadwal */}
                    <div className="flex justify-between items-center border-b border-gray-200 pb-6">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">LAPANGAN</span>
                        <span className="text-sm font-bold text-[#1B3627]">{booking.field_name}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-200 pb-6">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TANGGAL</span>
                        <span className="text-sm font-bold text-[#1B3627]">{booking.formatted_date}</span>
                    </div>

                    <div className="flex justify-between items-center border-b border-gray-200 pb-6">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">WAKTU</span>
                        <span className="text-sm font-bold text-[#1B3627]">{booking.formatted_time}</span>
                    </div>

                    {/* Total Harga dari BE */}
                    <div className="flex justify-between items-center pb-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TOTAL TAGIHAN</span>
                        <span className="text-2xl font-black text-[#1B3627]">Rp {formatRupiah(booking.total_price)}</span>
                    </div>

                    {/* Info expires_at */}
                    {booking.expires_at && (
                        <div className="bg-[#E5C3A6]/20 p-4 rounded-xl flex gap-3 items-start border border-[#E5C3A6]/40">
                            <Info className="w-5 h-5 text-[#8b5a2b] shrink-0 mt-0.5" />
                            <p className="text-xs font-medium text-[#8b5a2b] leading-relaxed">
                                Pemesanan akan otomatis dibatalkan jika pembayaran tidak diselesaikan dalam 10 menit.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button className="flex-1 bg-[#8b5a2b] hover:bg-[#724a23] text-white py-4 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#8b5a2b]/20 flex justify-center items-center gap-2">
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

            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center relative overflow-hidden">

                    {/* Timer hanya tampil kalau ada expires_at */}
                    {booking.expires_at && (
                        <>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">SELESAIKAN PEMBAYARAN DALAM</p>
                            <h2 className={`text-4xl font-black mb-8 transition-colors duration-300 ${timeLeft < 60 ? "text-red-500 animate-pulse" : "text-[#8b5a2b]"}`}>
                                {minutes}:{seconds}
                            </h2>
                        </>
                    )}

                    <div className="bg-[#1B3627] p-6 rounded-3xl shadow-inner mb-8 w-full max-w-[280px] aspect-square flex flex-col items-center justify-center relative">
                        <div className="absolute top-4 text-[10px] text-gray-400 font-medium tracking-widest uppercase">Payment Gateway</div>
                        <div className="bg-white p-3 rounded-xl w-3/4 aspect-square mt-4 relative shadow-lg">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                alt="QR Code"
                                className="w-full h-full object-contain opacity-90"
                            />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-white p-1 rounded-md shadow-sm">
                                    <ShieldCheck className="w-6 h-6 text-[#8CB954]" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 text-[10px] text-gray-400 font-medium tracking-widest uppercase">Safe Network</div>
                    </div>

                    <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100 px-4 py-2 rounded-full bg-gray-50">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> DPN SECURED
                    </div>
                </div>

                <div className="w-full h-32 rounded-3xl overflow-hidden shadow-md opacity-90">
                    <img
                        src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000"
                        alt="Leaves"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
}

export default function InvoicePage() {
    return (
        <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5] text-[#1B3627]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <Suspense fallback={<div className="text-center py-20 font-bold text-gray-500">Memuat Tagihan...</div>}>
                    <InvoiceContent />
                </Suspense>
            </div>
        </div>
    );
}