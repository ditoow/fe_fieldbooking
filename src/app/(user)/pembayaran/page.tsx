"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import BiodataForm from "../components/Pembayaran/BiodataForm";
import PaymentMethod from "../components/Pembayaran/PaymentMethod";
import OrderSummary from "../components/Pembayaran/OrderSummary";
import { getBookingById, uploadBookingFile, BookingDetail } from "@/lib/api/booking";
import axios from "axios";

interface FormDataTypes {
    nama: string;
    phone: string;
    email: string;
}

function PembayaranContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = parseInt(searchParams.get("booking_id") || "0");

    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [role, setRole] = useState<string>("umum");
    const [suratFile, setSuratFile] = useState<File | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"bank" | "qris">("qris");
    const [formData, setFormData] = useState<FormDataTypes>({
        nama: "", phone: "", email: ""
    });

    useEffect(() => {
        const fetchData = async () => {
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

        // Ambil data user dari localStorage
        const session = localStorage.getItem("user_session");
        if (session) {
            const user = JSON.parse(session);
            setFormData({
                nama: user.name || "",
                phone: user.phone || "",
                email: user.email || "",
            });
            // Ambil role dari Spatie roles array
            const userRole = user.roles?.[0]?.name || "umum";
            setRole(userRole);
        }

        fetchData();
    }, [bookingId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSuratFile(e.target.files[0]);
        }
    };

    const handleProses = async () => {
        if (!booking) return;
        setIsSubmitting(true);
        setError("");

        try {
            if (role === "mahasiswa") {
                // Mahasiswa harus upload surat dulu
                if (!suratFile) {
                    setError("Harap unggah Surat Pengantar TU terlebih dahulu!");
                    setIsSubmitting(false);
                    return;
                }
                await uploadBookingFile(booking.id, suratFile);
                router.push("/riwayat");
            } else {
                // Umum langsung ke invoice
                router.push(`/invoice?booking_id=${booking.id}&method=${paymentMethod}`);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Gagal memproses, coba lagi.");
            } else {
                setError("Terjadi kesalahan.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatRupiah = (angka: number) =>
        new Intl.NumberFormat("id-ID").format(angka);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-[#8CB954] animate-spin mb-4" />
                <p className="text-[#1B3627] font-semibold text-sm">Memuat data pembayaran...</p>
            </div>
        );
    }

    if (error && !booking) {
        return (
            <div className="text-center py-20">
                <p className="text-lg font-bold text-red-500">{error}</p>
                <Link href="/dashboard" className="text-sm text-[#1B3627] underline mt-4 inline-block">
                    Kembali ke Dashboard
                </Link>
            </div>
        );
    }

    if (!booking) return null;

    // Hitung jumlah jam dari schedules
    const jumlahJam = booking.schedules?.length || 1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-12">

                {/* Error banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                        <p className="text-xs font-bold text-red-600">{error}</p>
                    </div>
                )}

                <BiodataForm formData={formData} setFormData={setFormData} />

                <PaymentMethod
                    role={role}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    suratFile={suratFile}
                    handleFileChange={handleFileChange}
                />
            </div>

            <OrderSummary
                namaLapangan={booking.field_name}
                dateParam={booking.formatted_date}
                selectedTimesArray={[booking.formatted_time]}
                jumlahJam={jumlahJam}
                lokasiLapangan={booking.field_name}
                role={role}
                totalHarga={booking.total_price}
                formatRupiah={formatRupiah}
                handleProses={handleProses}
                isSubmitting={isSubmitting}
                imageLapangan={"https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000"}
            />
        </div>
    );
}

export default function PembayaranPage() {
    return (
        <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5] text-[#1B3627]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="mb-12">
                    <p className="text-xs font-bold text-[#c29867] uppercase tracking-widest mb-2">SECURE BOOKING</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">Pilih<br />Pembayaran</h1>
                </div>
                <Suspense fallback={<div className="text-center py-20 font-bold text-gray-500">Memuat Tagihan...</div>}>
                    <PembayaranContent />
                </Suspense>
            </div>
        </div>
    );
}