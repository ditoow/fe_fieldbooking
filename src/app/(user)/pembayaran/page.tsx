"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import BiodataForm from "../components/Pembayaran/BiodataForm";
import OrderSummary from "../components/Pembayaran/OrderSummary";
import { getBookingById, uploadBookingFile, notifyPayment, BookingDetail } from "@/lib/api/booking";
import { useAuth } from "@/lib/context/AuthContext";
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
  const { user } = useAuth();

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<string>("umum");
  const [suratFile, setSuratFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormDataTypes>({
    nama: "",
    phone: "",
    email: "",
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

    // Ambil data user dari AuthContext
    if (user) {
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
  }, [bookingId, user]);

  useEffect(() => {
    if (!booking || booking.booking_type !== 'payment') return;
    (window as any).bayar = async () => {
      try {
        const res = await axios.post('/api/payment/simulate', { booking_id: booking.id });
        alert('✅ Pembayaran berhasil!');
        window.location.href = `/invoice?booking_id=${booking.id}`;
      } catch (e: any) {
        alert('❌ Gagal: ' + (e.response?.data?.message || e.message));
      }
    };
    return () => { delete (window as any).bayar; };
  }, [booking]);

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
        router.push(`/verifikasi-pending?booking_id=${booking.id}`);
      } else {
        // Umum langsung ke invoice dengan QRIS
        await notifyPayment(booking.id).catch(console.error); // Panggil API notifikasi
        router.push(`/invoice?booking_id=${booking.id}`);
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
        <p className="text-[#1B3627] font-semibold text-sm">
          Memuat data...
        </p>
      </div>
    );
  }

  if (error && !booking) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-bold text-red-500">{error}</p>
        <Link
          href="/dashboard"
          className="text-sm text-[#1B3627] underline mt-4 inline-block"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    );
  }

  if (!booking) return null;

  // Hitung jumlah jam dari schedules
  const jumlahJam = booking.schedules?.length || 1;

  return (
    <div className="space-y-12">
      <div className="mb-4">
        <p className="text-xs font-bold text-[#c29867] uppercase tracking-widest mb-2">
          SECURE BOOKING
        </p>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase">
          {role === "mahasiswa" ? "Verifikasi" : "Pembayaran"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col space-y-8 self-stretch">
          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
              <p className="text-xs font-bold text-red-600">{error}</p>
            </div>
          )}

          <BiodataForm formData={formData} setFormData={setFormData} />

          {/* Upload Dokumen untuk Mahasiswa */}
          {role === "mahasiswa" && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="h-px w-6 bg-gray-300"></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-800">
                  Dokumen Pendukung
                </h3>
              </div>
              
              <div className="bg-[#F5F2E9]/60 p-6 sm:p-8 rounded-2xl border border-[#E5C3A6]/20">
                <p className="text-xs text-[#1B3627] font-semibold mb-6 leading-relaxed">
                  Sebagai mahasiswa UDINUS, Anda berhak menggunakan fasilitas olahraga secara <strong className="font-black text-[#8b5a2b]">GRATIS</strong> untuk keperluan akademik atau UKM. Silakan unggah Surat Pengantar dari Tata Usaha (TU).
                </p>

                <input 
                  type="file" 
                  id="suratTU" 
                  accept=".pdf, .jpg, .jpeg, .png" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
                <label 
                  htmlFor="suratTU" 
                  className="cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#E5C3A6]/60 bg-white rounded-xl hover:bg-[#E5C3A6]/10 transition-all shadow-sm"
                >
                  {suratFile ? (
                    <>
                      <div className="w-12 h-12 bg-[#E5C3A6]/20 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6 text-[#1b3627]" />
                      </div>
                      <span className="font-bold text-[#1B3627] text-sm">File Siap: {suratFile.name}</span>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Klik untuk mengganti file</span>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-[#1B3627]/5 rounded-full flex items-center justify-center mb-3">
                        <UploadCloud className="w-6 h-6 text-[#1b3627]" />
                      </div>
                      <span className="font-bold text-[#1B3627] text-sm mb-1">Unggah Surat TU</span>
                      <span className="text-xs text-gray-400">Mendukung format .PDF, .JPG, .JPEG, .PNG</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          <div className="w-full aspect-[3/1] h-36 rounded-2xl overflow-hidden relative shadow-md mt-auto">
            <img
              src={
                booking.field_image_url ||
                "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000"
              }
              alt="Venue Experience"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-end p-4">
              <p className="text-[12px] font-bold text-white uppercase tracking-widest">
                {booking.field_name}
              </p>
            </div>
          </div>
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
          imageLapangan={
            booking.field_image_url ||
            "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000"
          }
        />
      </div>
    </div>
  );
}

export default function PembayaranPage() {
  return (
    <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5] text-[#1B3627]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Suspense
          fallback={
            <div className="text-center py-20 font-bold text-gray-500">
              Memuat Halaman...
            </div>
          }
        >
          <PembayaranContent />
        </Suspense>
      </div>
    </div>
  );
}
