"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BiodataForm from "../components/Pembayaran/BiodataForm";
import PaymentMethod from "../components/Pembayaran/PaymentMethod";
import OrderSummary from "../components/Pembayaran/OrderSummary";

function PembayaranContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const idParam = searchParams.get("id") || "1";
    const dateParam = searchParams.get("date") || "Senin, 11 Nov 2026";
    const timeParam = searchParams.get("time") || "";

    const idLapangan = parseInt(idParam) || 1;
    const isOdd = idLapangan % 2 !== 0;

    const namaLapangan = isOdd ? "Lapangan Futsal Internasional" : "Arena Basket Indoor B";
    const lokasiLapangan = isOdd ? "Gedung Olahraga Utama, Semarang" : "Student Center Lt. 3, Semarang";
    const hargaPerJam = isOdd ? 75000 : 60000;
    const imageLapangan = isOdd
        ? "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000"
        : "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000";

    const selectedTimesArray = timeParam ? timeParam.split(",") : [];
    const jumlahJam = selectedTimesArray.length || 1;

    const [role, setRole] = useState<"user" | "mahasiswa">("mahasiswa");
    const [suratFile, setSuratFile] = useState<File | null>(null);

    const totalHarga = role === "mahasiswa" ? 0 : (hargaPerJam * jumlahJam);

    const [paymentMethod, setPaymentMethod] = useState<"bank" | "qris">("qris");
    const [formData, setFormData] = useState({ nama: "", phone: "", email: "" });

    useEffect(() => {
        const session = localStorage.getItem("user_session");
        if (session) {
            const user = JSON.parse(session);
            setFormData({
                nama: user.nama || "NURALIFMAULANASYAFRUDIN",
                phone: user.phone || "+62 812 3456 7890",
                email: user.email || "alif@dinus.ac.id"
            });
            if (user.role) setRole(user.role);
        } else {
            setFormData({
                nama: "NURALIFMAULANASYAFRUDIN",
                phone: "+62 812 3456 7890",
                email: "alif@dinus.ac.id"
            });
        }
    }, []);

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(angka);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSuratFile(e.target.files[0]);
        }
    };

    const handleProses = () => {
        if (role === "mahasiswa" && !suratFile) {
            alert("Harap unggah Surat Pengantar TU terlebih dahulu!");
            return;
        }

        const existingHistory = JSON.parse(localStorage.getItem('booking_history') || '[]');

        const newBooking = {
            id: "BK-" + Math.floor(1000 + Math.random() * 9000),
            title: namaLapangan,
            category: isOdd ? "Futsal" : "Basket",
            price: totalHarga,
            date: dateParam,
            time: selectedTimesArray.join(", ") + ` (${jumlahJam} Jam)`,
            status: "TERTUNDA",
            image: imageLapangan,
            note: role === "mahasiswa" ? "*Menunggu verifikasi Surat Pengantar TU oleh Admin." : "*Menunggu pembayaran",
            createdAt: new Date().getTime(),
            facilityId: idLapangan
        };

        localStorage.setItem('booking_history', JSON.stringify([newBooking, ...existingHistory]));

        if (role === "mahasiswa") {
            alert("Berhasil! Pengajuan peminjaman sedang diverifikasi Admin.");
            router.push("/riwayat");
        } else {
            router.push(`/invoice?total=${totalHarga}`);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 xl:col-span-8 space-y-12">
                <div className="bg-amber-100/50 border border-amber-200 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest">Simulasi Role:</span>
                    </div>
                    <div className="flex bg-white rounded-lg p-1 border border-amber-200 shadow-sm">
                        <button onClick={() => setRole("user")} className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${role === "user" ? "bg-[#1B3627] text-white" : "text-gray-500 hover:bg-gray-50"}`}>Umum</button>
                        <button onClick={() => setRole("mahasiswa")} className={`px-4 py-1.5 text-xs font-bold rounded-md transition ${role === "mahasiswa" ? "bg-[#1B3627] text-white" : "text-gray-500 hover:bg-gray-50"}`}>Mahasiswa</button>
                    </div>
                </div>

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
                namaLapangan={namaLapangan}
                dateParam={dateParam}
                selectedTimesArray={selectedTimesArray}
                jumlahJam={jumlahJam}
                lokasiLapangan={lokasiLapangan}
                role={role}
                totalHarga={totalHarga}
                formatRupiah={formatRupiah}
                handleProses={handleProses}
                imageLapangan={imageLapangan}
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