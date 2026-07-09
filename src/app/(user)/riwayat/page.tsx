"use client";

import React, { useState, useEffect } from "react";
import { SlidersHorizontal, Trophy, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HistoryCard from "../components/Riwayat/HistoryCard";
import TransactionModal from "../components/Riwayat/TransactionModal";
import { getAllBookings, cancelBookingApi } from "@/lib/api/booking";
import type { BookingDetail } from "@/lib/api/booking";

export interface HistoryItem {
    id: string;
    title: string;
    category: string;
    price: number;
    date: string;
    time: string;
    status: "SELESAI" | "DIBATALKAN" | "TERTUNDA";
    image: string;
    note: string | null;
    createdAt?: number;
    facilityId?: number;
}

function mapStatus(status: string): "SELESAI" | "DIBATALKAN" | "TERTUNDA" {
    const statusMap: Record<string, "SELESAI" | "DIBATALKAN" | "TERTUNDA"> = {
        'pending': 'TERTUNDA',
        'approved': 'SELESAI',
        'rejected': 'DIBATALKAN',
        'cancelled': 'DIBATALKAN',
    };
    return statusMap[status] ?? 'TERTUNDA';
}

function mapToHistoryItem(booking: BookingDetail): HistoryItem {
    let defaultImage = "https://images.unsplash.com/photo-1518605368461-1e1e367803ba?q=80&w=600&auto=format&fit=crop"; // futsal
    if (booking.field_name && booking.field_name.toLowerCase().includes('basket')) {
        defaultImage = "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600&auto=format&fit=crop";
    } else if (booking.field_name && booking.field_name.toLowerCase().includes('badminton')) {
        defaultImage = "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=600&auto=format&fit=crop";
    }

    return {
        id: String(booking.id),
        title: booking.field_name || "Lapangan",
        category: booking.field_name || "Umum", // ⚠️ Ganti kalau BE punya field sport/category tersendiri
        price: booking.total_price || 0,
        date: booking.formatted_date || "-",
        time: booking.formatted_time || "-",
        status: mapStatus(booking.status),
        image: defaultImage,
        note: null,
        createdAt: new Date(booking.created_at).getTime(),
        facilityId: booking.schedules?.[0]?.field_id || 1,
    };
}

export default function RiwayatPage() {
    const router = useRouter();
    const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
    const [selectedDetailItem, setSelectedDetailItem] = useState<HistoryItem | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const bookings = await getAllBookings();
            const mapped = bookings.map(mapToHistoryItem);

            // Urutkan dari yang terbaru
            mapped.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

            setHistoryData(mapped);
        } catch (err) {
            console.error('Gagal mengambil data riwayat:', err);
            // Fallback ke localStorage jika API error (opsional)
            const savedHistory = localStorage.getItem('booking_history');
            if (savedHistory) {
                setHistoryData(JSON.parse(savedHistory));
            } else {
                setError('Gagal memuat riwayat pemesanan. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // FUNGSI UNTUK MEMBATALKAN PESANAN
    const handleCancelBooking = async (bookingId: string) => {
        const isConfirm = window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?");
        if (!isConfirm) return;

        try {
            // Mengubah state lokal secara langsung agar UI langsung responsif (Optimistic Update)
            setHistoryData(prevData =>
                prevData.map(item =>
                    item.id === bookingId
                        ? { ...item, status: "DIBATALKAN", note: "Dibatalkan oleh pengguna" }
                        : item
                )
            );

            // MEMANGGIL API KE BACKEND
            await cancelBookingApi(bookingId);

            alert("Pesanan berhasil dibatalkan!");

            // Refetch data dari server setelah cancel untuk memastikan sinkronisasi
            fetchBookings();

        } catch (err: any) {
            console.error('Gagal membatalkan pesanan:', err);

            // Tangkap pesan error dari backend jika ada
            const errorMessage = err.response?.data?.message || "Terjadi kesalahan. Gagal membatalkan pesanan.";
            alert(errorMessage);

            // Jika API gagal, kembalikan data ke kondisi awal dengan fetch ulang
            fetchBookings();
        }
    };

    const validHistory = historyData.filter(item => item.status !== "DIBATALKAN");
    const totalKunjungan = validHistory.length;
    const totalPengeluaran = validHistory.reduce((sum, item) => sum + item.price, 0);

    const kategoriCount = validHistory.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const olahragaTerfavorit = Object.keys(kategoriCount).length > 0
        ? Object.keys(kategoriCount).reduce((a, b) => kategoriCount[a] > kategoriCount[b] ? a : b)
        : "Belum Ada";

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(angka);
    };

    const getDeadlineText = (createdAt: number) => {
        const deadline = new Date(createdAt + 10 * 60000);
        const hariIni = new Date(createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        const jam = deadline.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return `Hari ini, ${hariIni} • ${jam} WIB`;
    };

    const filteredData = historyData.filter(item => {
        if (filterStatus === "ALL") return true;
        return item.status === filterStatus;
    });

    return (
        <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5]">

            {/* HEADER SECTION */}
            <section className="bg-[#1B3627] pt-16 pb-36 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Riwayat Pemesanan</h1>
                    <p className="text-gray-300 text-sm md:text-base max-w-lg leading-relaxed">
                        Kelola dan tinjau kembali jadwal kunjungan olahraga Anda di berbagai fasilitas premium kami.
                    </p>
                </div>
            </section>

            {/* STATISTIK CARDS */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Kunjungan</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-[#1B3627]">{totalKunjungan}</span>
                            <span className="text-sm font-semibold text-gray-400">Sesi</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Total Pengeluaran</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm font-bold text-gray-400">IDR</span>
                            <span className="text-3xl font-bold text-[#1B3627]">{formatRupiah(totalPengeluaran)}</span>
                        </div>
                    </div>
                    <div className="bg-[#132A1D] rounded-xl p-6 shadow-lg shadow-[#132A1D]/20 border border-white/10 flex flex-col justify-center text-white">
                        <p className="text-[10px] font-bold text-[#8CB954] uppercase tracking-widest mb-4">Olahraga Terfavorit</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-[#8b5a2b] flex items-center justify-center shrink-0">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold">{olahragaTerfavorit}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* LIST ACTIVITY SECTION */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                <div className="flex justify-between items-end mb-8 relative">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1B3627] mb-1">Aktivitas Terakhir</h2>
                        <p className="text-sm text-gray-500">Daftar aktivitas dari pemesanan lapangan Anda.</p>
                    </div>

                    {/* Dropdown Filter */}
                    <div className="relative">
                        <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="flex items-center gap-2 bg-[#E5C3A6]/30 text-[#8b5a2b] px-4 py-2 rounded-md text-xs font-bold hover:bg-[#E5C3A6]/50 transition shadow-sm">
                            Filter: {filterStatus === "ALL" ? "Semua Status" : filterStatus} <SlidersHorizontal className="w-3 h-3" />
                        </button>
                        {showFilterDropdown && (
                            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-30 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                {["ALL", "TERTUNDA", "SELESAI", "DIBATALKAN"].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => { setFilterStatus(status); setShowFilterDropdown(false); }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-gray-50 ${filterStatus === status ? "text-[#8b5a2b] bg-amber-50/40" : "text-[#1B3627]"}`}
                                    >
                                        {status === "ALL" ? "Semua Status" : status.charAt(0) + status.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 py-20 flex flex-col items-center justify-center">
                        <Loader2 className="w-10 h-10 text-[#1B3627] animate-spin mb-4" />
                        <p className="text-gray-500 text-sm">Memuat riwayat pemesanan...</p>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="w-full bg-white rounded-2xl border border-red-100 py-20 flex flex-col items-center justify-center text-center">
                        <p className="text-red-500 font-semibold mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#1B3627] text-white px-6 py-2.5 rounded-xl text-sm font-bold"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredData.length === 0 && (
                    <div className="w-full bg-white rounded-2xl border border-dashed border-gray-300 py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1B3627] mb-2">Tidak ada transaksi</h3>
                        <p className="text-gray-500 max-w-sm mb-8 text-sm">Tidak ditemukan riwayat pemesanan untuk kategori status yang Anda pilih.</p>
                        {filterStatus === "ALL" && (
                            <Link href="/dashboard" className="flex items-center gap-2 bg-[#1B3627] hover:bg-[#132A1D] text-white px-8 py-3.5 rounded-xl font-bold transition shadow-lg">
                                Mulai Booking <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                )}

                {/* Data List */}
                {!isLoading && !error && filteredData.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredData.map((item) => (
                            <HistoryCard
                                key={item.id}
                                item={item}
                                formatRupiah={formatRupiah}
                                getDeadlineText={getDeadlineText}
                                onDetail={(item: HistoryItem) => setSelectedDetailItem(item)}
                                onPayNow={() => router.push(`/invoice?booking_id=${item.id}`)}
                                onBookAgain={(id: number) => router.push(`/booking/${id || 1}`)}
                            // onCancel dihapus dari sini karena sudah pindah ke modal
                            />
                        ))}
                    </div>
                )}
            </section>

            <TransactionModal
                item={selectedDetailItem}
                onClose={() => setSelectedDetailItem(null)}
                formatRupiah={formatRupiah}
                onCancel={handleCancelBooking} // <-- PINDAHKAN KE SINI
            />

        </div>
    );
}