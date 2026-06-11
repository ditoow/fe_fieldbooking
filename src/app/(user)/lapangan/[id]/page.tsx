"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
    ChevronLeft, ChevronRight, Star, MapPin, Loader2, AlertCircle, CheckCircle, 
    XCircle, Clock, Info, ShieldCheck, Car, Wind, Users, Coffee, Droplets,
    Maximize, Layers, Lightbulb, Activity
} from "lucide-react";
import { getFieldById, Field } from "@/lib/api/field";

export default function FieldDetailPage() {
    const params = useParams();
    const router = useRouter();
    const fieldId = params.id as string;

    const [field, setField] = useState<Field | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!fieldId) return;
            try {
                setIsLoading(true);
                const data = await getFieldById(Number(fieldId));
                setField(data);
            } catch (err: any) {
                console.error("Failed to load field detail", err);
                setError("Gagal memuat detail lapangan.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [fieldId]);

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#0a140d] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#E5C3A6] animate-spin mb-6" />
                <p className="text-[#E5C3A6] font-semibold animate-pulse tracking-widest uppercase text-sm">Memuat Detail Lapangan...</p>
            </div>
        );
    }

    if (error || !field) {
        return (
            <div className="w-full min-h-screen bg-[#FDFBF5] flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                <h2 className="text-2xl font-bold text-[#1B3627] mb-2">Oops!</h2>
                <p className="text-gray-500 mb-6 text-center">{error || "Lapangan tidak ditemukan."}</p>
                <button 
                    onClick={() => router.back()}
                    className="bg-[#1B3627] hover:bg-[#132A1D] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg"
                >
                    Kembali Ke Dashboard
                </button>
            </div>
        );
    }

    // Spesifikasi Lapangan (bisa diganti dinamis dari API nanti)
    const specifications = [
        { icon: <Maximize className="w-5 h-5" />, label: "Ukuran Standar Internasional", subLabel: "Dimensi sesuai regulasi" },
        { icon: <Layers className="w-5 h-5" />, label: "Material Lantai Premium", subLabel: field?.surface_type || "Sintetis Kualitas Tinggi" },
        { icon: <Lightbulb className="w-5 h-5" />, label: "Pencahayaan LED Terang", subLabel: "Visibilitas maksimal malam hari" },
        { icon: <Activity className="w-5 h-5" />, label: "Level Kompetisi", subLabel: "Cocok untuk turnamen & latihan" },
    ];

    const galleryImages = field ? [
        field.image_url,
        "https://images.unsplash.com/photo-1518605368461-1e1e367803ba?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=2029&auto=format&fit=crop"
    ].filter(Boolean) as string[] : [];

    return (
        <div className="w-full min-h-screen bg-[#F9F8F4] font-sans pb-24 selection:bg-[#E5C3A6] selection:text-[#1B3627]">
            {/* HERO SECTION - IMMERSIVE FULL WIDTH */}
            <section className="relative w-full h-[70vh] min-h-[500px] flex items-end">
                {/* Background Image Slider */}
                <div className="absolute inset-0 bg-[#0a140d]">
                    {galleryImages.length > 0 ? (
                        galleryImages.map((img, index) => (
                            <Image 
                                key={index}
                                src={img}
                                alt={`${field?.name} - ${index + 1}`}
                                fill
                                className={`object-cover mix-blend-overlay transition-opacity duration-1000 ${index === currentImageIndex ? 'opacity-80 z-10' : 'opacity-0 z-0'}`}
                                priority={index === 0}
                            />
                        ))
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B3627] to-[#0a140d]">
                            <span className="text-white/30 font-bold uppercase tracking-widest">Premium Facility</span>
                        </div>
                    )}
                </div>

                {/* Slider Controls */}
                {galleryImages.length > 1 && (
                    <div className="absolute bottom-10 right-6 sm:bottom-12 sm:right-12 z-30 flex items-center gap-4">
                        <button 
                            onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors shadow-lg"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="flex gap-2">
                            {galleryImages.map((_, i) => (
                                <button 
                                    key={i}
                                    onClick={() => setCurrentImageIndex(i)}
                                    className={`h-2 rounded-full transition-all shadow-sm ${i === currentImageIndex ? "w-8 bg-[#E5C3A6]" : "w-2 bg-white/50 hover:bg-white/80"}`}
                                />
                            ))}
                        </div>
                        <button 
                            onClick={() => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                            className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/40 transition-colors shadow-lg"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B3627] via-[#1B3627]/60 to-transparent"></div>

                {/* Back Button (Floating) */}
                <button 
                    onClick={() => router.back()}
                    className="absolute top-24 left-4 sm:left-8 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:-translate-x-1 shadow-lg"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Content Overlay */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="max-w-3xl">
                            {/* Badges */}
                            <div className="flex flex-wrap items-center gap-3 mb-5">
                                <span className="bg-gradient-to-r from-[#E5C3A6] to-[#d5b090] text-[#1B3627] text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                    {field.category}
                                </span>
                                <div className={`flex items-center text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border backdrop-blur-sm ${field.status === "available" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}`}>
                                    {field.status === "available" ? (
                                        <><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> TERSEDIA</>
                                    ) : (
                                        <><XCircle className="w-3.5 h-3.5 mr-1.5" /> MAINTENANCE</>
                                    )}
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
                                {field.name}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-gray-200">
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-white text-lg leading-none">{field.rating}</span>
                                    <span className="text-sm text-gray-400 font-medium">/ 5.0</span>
                                </div>
                                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
                                    <MapPin className="w-5 h-5 text-[#E5C3A6]" />
                                    <span className="text-sm font-semibold text-gray-100">GOR UDINUS Semarang</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN - Details (Bento Grid Style) */}
                    <div className="xl:col-span-2 space-y-8">
                        
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100 fill-mode-both">
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center text-center justify-center hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-4 text-green-600">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Status</p>
                                <p className="font-extrabold text-[#1B3627] text-base">
                                    {field.status === "available" ? "Siap Pakai" : "Perbaikan"}
                                </p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center text-center justify-center hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                                    <Wind className="w-6 h-6" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Permukaan</p>
                                <p className="font-extrabold text-[#1B3627] text-base capitalize">{field.surface_type}</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center text-center justify-center hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 text-orange-600">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Jam Buka</p>
                                <p className="font-extrabold text-[#1B3627] text-base">08:00 - 22:00</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100 flex flex-col items-center text-center justify-center hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-gray-200/50 transition-all cursor-default">
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center mb-4 text-purple-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Kapasitas</p>
                                <p className="font-extrabold text-[#1B3627] text-base">Tim Standar</p>
                            </div>
                        </div>

                        {/* Description Section */}
                        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Info className="w-48 h-48 text-[#1B3627]" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-2 h-8 bg-[#8CB954] rounded-full"></div>
                                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B3627] tracking-tight">Tentang Lapangan</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-base sm:text-lg whitespace-pre-line font-medium max-w-3xl">
                                    {field.description || "Lapangan olahraga kelas premium dengan fasilitas memadai untuk menunjang performa Anda. Didesain dengan standar internasional untuk memberikan pengalaman bermain yang nyaman, kompetitif, dan aman bagi setiap pemain."}
                                </p>
                            </div>
                        </section>
                        
                        {/* Specifications Section */}
                        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-8 bg-[#E5C3A6] rounded-full"></div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B3627] tracking-tight">Spesifikasi Lapangan</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {specifications.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-[#F9F8F4] border border-gray-100 hover:bg-white hover:shadow-lg hover:border-gray-200 transition-all group">
                                        <div className="text-[#1B3627] bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0">
                                            {item.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1B3627] text-lg">{item.label}</span>
                                            <span className="text-gray-500 text-sm mt-1">{item.subLabel}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Reviews Dummy Section */}
                        <section className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-200/40 border border-gray-100 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 fill-mode-both">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-2 h-8 bg-yellow-400 rounded-full"></div>
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1B3627] tracking-tight">Ulasan Pemain</h3>
                                    </div>
                                    <p className="text-gray-500 font-medium ml-5">Pendapat mereka yang sudah mencoba lapangan ini.</p>
                                </div>
                                <div className="bg-[#F9F8F4] px-6 py-4 rounded-2xl border border-gray-100 flex flex-col items-center sm:items-end">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                                        <span className="text-4xl font-black text-[#1B3627] leading-none">{field.rating}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 font-semibold tracking-wide">Berdasarkan 124 Ulasan</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Review 1 */}
                                <div className="p-6 rounded-3xl bg-[#F9F8F4] border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B3627] to-[#132A1D] text-white flex items-center justify-center font-bold text-lg shadow-md">
                                            AR
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-[#1B3627] text-base">Ahmad Reza</p>
                                            <div className="flex text-yellow-400 mt-1 gap-0.5">
                                                <Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 font-medium italic">"Kualitas lapangan sangat baik, pantulan bola sempurna dan fasilitas kamar mandinya sangat bersih. Sangat direkomendasikan!"</p>
                                </div>
                                {/* Review 2 */}
                                <div className="p-6 rounded-3xl bg-[#F9F8F4] border border-gray-100 hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E5C3A6] to-[#d5b090] text-[#1B3627] flex items-center justify-center font-bold text-lg shadow-md">
                                            BW
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-[#1B3627] text-base">Budi Wibowo</p>
                                            <div className="flex text-yellow-400 mt-1 gap-0.5">
                                                <Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 fill-yellow-400" /><Star className="w-3.5 h-3.5 text-gray-300 fill-gray-300" />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 font-medium italic">"Cocok untuk latihan rutin. Hanya saja area parkir kadang penuh kalau akhir pekan. Pencahayaan malam hari sangat terang."</p>
                                </div>
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN - Sticky Booking Card */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-green-900/10 border border-gray-100 sticky top-28 animate-in fade-in slide-in-from-right-12 duration-700 delay-300 fill-mode-both z-30">
                            
                            <div className="mb-8 text-center">
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-3">
                                    Tarif Sewa
                                </p>
                                {field.price_min ? (
                                    <div className="inline-flex flex-col items-center">
                                        <div className="flex items-start gap-1">
                                            <span className="text-xl font-bold text-[#1B3627] mt-1">Rp</span>
                                            <p className="font-extrabold text-5xl text-[#1B3627] tracking-tighter">
                                                {field.price_min}
                                            </p>
                                        </div>
                                        <div className="bg-gray-100 text-gray-500 font-bold text-xs px-3 py-1 rounded-full mt-3">
                                            PER JAM
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xl font-bold text-gray-400 italic">Harga belum tersedia</p>
                                )}
                                {field.price_max && field.price_max !== field.price_min && (
                                    <p className="text-sm font-semibold text-gray-400 mt-4">
                                        Maksimal hingga Rp {field.price_max} /jam
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4 mb-8 bg-[#F9F8F4] p-5 rounded-3xl border border-gray-100">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500 font-semibold text-sm">Buka Hari Ini</span>
                                    <span className="text-[#1B3627] font-extrabold text-sm">08:00 - 22:00</span>
                                </div>
                                <div className="w-full h-px bg-gray-200"></div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-gray-500 font-semibold text-sm">Batas Reservasi</span>
                                    <span className="text-[#1B3627] font-extrabold text-sm">21:00 WIB</span>
                                </div>
                            </div>

                            <Link 
                                href={`/booking/${field.id}`}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1B3627] to-[#132A1D] hover:from-[#132A1D] hover:to-[#0a160f] text-[#E5C3A6] py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-900/30 hover:shadow-2xl hover:shadow-green-900/50 hover:-translate-y-1.5"
                            >
                                Pesan Jadwal Sekarang
                            </Link>
                            
                            <div className="mt-6 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                                    Transaksi 100% aman dan terverifikasi. Kami menjamin slot lapangan Anda setelah pembayaran selesai.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
