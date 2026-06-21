"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  ShieldCheck,
  Car,
  Wind,
  Users,
  Coffee,
  Droplets,
  Maximize,
  Layers,
  Lightbulb,
  Activity,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { getFieldById, Field } from "@/lib/api/field";

const parseDescription = (desc: string) => {
  if (!desc)
    return {
      long_description: "",
      jam_buka: "08:00 - 22:00",
      kapasitas: "Tim Standar",
      spesifikasi:
        "Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi",
    };

  if (desc.includes("|||")) {
    const parts = desc.split("|||");
    return {
      long_description: parts[0] || "",
      jam_buka: parts[1] || "08:00 - 22:00",
      kapasitas: parts[2] || "Tim Standar",
      spesifikasi:
        parts[3] ||
        "Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi",
    };
  }

  try {
    const parsed = JSON.parse(desc);
    if (parsed && typeof parsed === "object" && "long_description" in parsed) {
      return parsed;
    }
  } catch (e) {}
  return {
    long_description: desc,
    jam_buka: "08:00 - 22:00",
    kapasitas: "Tim Standar",
    spesifikasi:
      "Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi",
  };
};

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
        const data = await getFieldById(parseInt(fieldId));
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
        <p className="text-[#E5C3A6] font-semibold animate-pulse tracking-widest uppercase text-sm">
          Memuat Detail Lapangan...
        </p>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="w-full min-h-screen bg-[#FDFBF5] flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-[#1B3627] mb-2">Oops!</h2>
        <p className="text-gray-500 mb-6 text-center">
          {error || "Lapangan tidak ditemukan."}
        </p>
        <button
          onClick={() => router.back()}
          className="bg-[#1B3627] hover:bg-[#132A1D] text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg"
        >
          Kembali Ke Dashboard
        </button>
      </div>
    );
  }

  const parsedData = parseDescription(field?.description || "");

  const iconMap: Record<string, React.ReactNode> = {
    "Ukuran Lapangan": <Maximize className="w-5 h-5" />,
    Pencahayaan: <Lightbulb className="w-5 h-5" />,
    "Kapasitas Pemain": <Users className="w-5 h-5" />,
    "Kapasitas Penonton": <Users className="w-5 h-5" />,
    "Tinggi Net": <Activity className="w-5 h-5" />,
    Fasilitas: <Coffee className="w-5 h-5" />,
  };

  const specifications =
    (Array.isArray(field?.specifications) ? field.specifications : []).map((spec) => ({
      icon: iconMap[spec.label] || <Info className="w-5 h-5" />,
      label: spec.label,
      subLabel: spec.value,
    })) || [];

  const galleryImages = field
    ? ([field.image_url, ...(Array.isArray(field.carousel_urls) ? field.carousel_urls : [])].filter(
        Boolean,
      ) as string[])
    : [];

  return (
    <div className="w-full min-h-screen bg-[#F9F8F4] font-sans pb-24 selection:bg-[#E5C3A6] selection:text-[#1B3627]">
      {/* HERO SECTION - IMMERSIVE FULL WIDTH */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-end">
        {/* Background Image Slider */}
        <div className="absolute inset-0 bg-[#0a140d]">
          {galleryImages.length > 0 ? (
            galleryImages.map((img, index) => (
              <Image
                key={index}
                src={img}
                alt={`${field?.name} - ${index + 1}`}
                fill
                className={`object-cover mix-blend-overlay transition-opacity duration-1000 ${index === currentImageIndex ? "opacity-80 z-10" : "opacity-0 z-0"}`}
                priority={index === 0}
              />
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1B3627] to-[#0a140d]">
              <span className="text-white/30 font-bold uppercase tracking-widest">
                Premium Facility
              </span>
            </div>
          )}
        </div>

        {/* Slider Controls */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-10 right-6 sm:bottom-12 sm:right-12 z-30 flex items-center gap-4">
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1,
                )
              }
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
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1,
                )
              }
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
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-gradient-to-r from-[#E5C3A6] to-[#d5b090] text-[#1B3627] text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-md">
                  {field.category}
                </span>
                <div
                  className={`flex items-center text-[10px] font-bold px-3.5 py-1 rounded-full shadow-md border backdrop-blur-sm ${field.status === "available" ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}`}
                >
                  {field.status === "available" ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1.5" /> TERSEDIA
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1.5" /> MAINTENANCE
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-lg">
                {field.name}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 text-gray-200">
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-md">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-bold text-white text-base leading-none">
                    {field.rating}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    / 5.0
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-md">
                  <MapPin className="w-4 h-4 text-[#E5C3A6]" />
                  <span className="text-xs font-semibold text-gray-100">
                    GOR UDINUS Semarang
                  </span>
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
          <div className="xl:col-span-2 space-y-6">
            {/* Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-100 fill-mode-both">
              <div className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm flex flex-col items-center text-center justify-center hover:shadow-md hover:border-gray-300 transition-all cursor-default">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3 text-blue-600">
                  <Wind className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                  Permukaan
                </p>
                <p className="font-bold text-[#1B3627] text-sm capitalize">
                  {field.surface_type}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm flex flex-col items-center text-center justify-center hover:shadow-md hover:border-gray-300 transition-all cursor-default">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-3 text-orange-600">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                  Jam Buka
                </p>
                <p className="font-bold text-[#1B3627] text-sm">
                  08:00 - 22:00
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm flex flex-col items-center text-center justify-center hover:shadow-md hover:border-gray-300 transition-all cursor-default">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3 text-purple-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                  Jadwal Tersedia
                </p>
                <p className="font-bold text-[#1B3627] text-sm">
                  {field.available_slots_today} slot tersedia
                </p>
              </div>
            </div>

            {/* Description Section */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200 fill-mode-both relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                <Info className="w-40 h-40 text-[#1B3627]" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-1.5 h-6 bg-[#8CB954] rounded-full"></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1B3627] tracking-tight">
                    Tentang Lapangan
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line font-medium max-w-3xl">
                  {field.description ||
                    "Lapangan olahraga kelas premium dengan fasilitas memadai untuk menunjang performa Anda. Didesain dengan standar internasional untuk memberikan pengalaman bermain yang nyaman, kompetitif, dan aman bagi setiap pemain."}
                </p>
              </div>
            </section>

            {/* Specifications Section */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-1.5 h-6 bg-[#E5C3A6] rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1B3627] tracking-tight">
                  Spesifikasi Lapangan
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specifications.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3.5 p-4 rounded-xl bg-gray-50/50 border border-gray-200/60 hover:bg-white hover:shadow-md hover:border-gray-300 transition-all group"
                  >
                    <div className="text-[#1B3627] bg-white p-2.5 rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300 shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1B3627] text-sm">
                        {item.label}
                      </span>
                      <span className="text-gray-500 text-xs mt-0.5">
                        {item.subLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Reviews Dummy Section */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-200/60 shadow-sm animate-in fade-in slide-in-from-bottom-12 duration-700 delay-500 fill-mode-both">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-1.5 h-6 bg-yellow-400 rounded-full"></div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1B3627] tracking-tight">
                      Ulasan Pemain
                    </h3>
                  </div>
                  <p className="text-gray-500 font-medium ml-4 text-xs">
                    Pendapat mereka yang sudah mencoba lapangan ini.
                  </p>
                </div>
                <div className="bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-200/60 flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-black text-[#1B3627] leading-none">
                      {field.rating}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold tracking-wide">
                    124 Ulasan
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Review 1 */}
                <div className="p-5 rounded-xl bg-gray-50/50 border border-gray-200/60 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3627] to-[#132A1D] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      AR
                    </div>
                    <div>
                      <p className="font-bold text-[#1B3627] text-sm">
                        Ahmad Reza
                      </p>
                      <div className="flex text-yellow-400 mt-0.5 gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed font-medium italic">
                    "Kualitas lapangan sangat baik, pantulan bola sempurna dan
                    fasilitas kamar mandinya sangat bersih. Sangat
                    direkomendasikan!"
                  </p>
                </div>
                {/* Review 2 */}
                <div className="p-5 rounded-xl bg-gray-50/50 border border-gray-200/60 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3.5 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5C3A6] to-[#d5b090] text-[#1B3627] flex items-center justify-center font-bold text-sm shadow-sm">
                      BW
                    </div>
                    <div>
                      <p className="font-bold text-[#1B3627] text-sm">
                        Budi Wibowo
                      </p>
                      <div className="flex text-yellow-400 mt-0.5 gap-0.5">
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 fill-yellow-400" />
                        <Star className="w-3 h-3 text-gray-300 fill-gray-300" />
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-xs leading-relaxed font-medium italic">
                    "Cocok untuk latihan rutin. Hanya saja area parkir kadang
                    penuh kalau akhir pekan. Pencahayaan malam hari sangat
                    terang."
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN - Sticky Booking Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200/60 shadow-md sticky top-28 animate-in fade-in slide-in-from-right-12 duration-700 delay-300 fill-mode-both z-30">
              <div className="mb-6 text-center">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
                  Tarif Sewa
                </p>
                {field.price_min ? (
                  <div className="inline-flex flex-col items-center">
                    <div className="flex items-start gap-1">
                      <span className="text-lg font-bold text-[#1B3627] mt-1">
                        Rp
                      </span>
                      <p className="font-extrabold text-4xl text-[#1B3627] tracking-tight">
                        {field.price_min}
                      </p>
                    </div>
                    <div className="bg-gray-100 text-gray-500 font-bold text-[10px] px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
                      PER JAM
                    </div>
                  </div>
                ) : (
                  <p className="text-lg font-bold text-gray-400 italic">
                    Harga belum tersedia
                  </p>
                )}
                {field.price_max && field.price_max !== field.price_min && (
                  <p className="text-xs font-semibold text-gray-400 mt-3">
                    Maksimal hingga Rp {field.price_max} /jam
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-8 bg-[#F9F8F4] p-5 rounded-3xl border border-gray-100">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-500 font-semibold text-sm">
                    Buka Hari Ini
                  </span>
                  <span className="text-[#1B3627] font-extrabold text-sm">
                    {parsedData.jam_buka}
                  </span>
                </div>
                <div className="w-full h-px bg-gray-200"></div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-gray-500 font-semibold text-xs">
                    Batas Reservasi
                  </span>
                  <span className="text-[#1B3627] font-extrabold text-xs">
                    21:00 WIB
                  </span>
                </div>
              </div>

              <Link
                href={`/booking/${field.id}`}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1B3627] to-[#132A1D] hover:from-[#132A1D] hover:to-[#0a160f] text-[#E5C3A6] py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:-translate-y-0.5"
              >
                Pesan Jadwal Sekarang
              </Link>

              <div className="mt-4 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-gray-500 leading-normal font-medium">
                  Transaksi 100% aman dan terverifikasi. Kami menjamin slot
                  lapangan Anda setelah pembayaran selesai.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
