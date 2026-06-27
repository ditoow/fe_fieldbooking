"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, ChevronLeft, ChevronRight, Loader2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAllFields, Field } from "@/lib/api/field";
import axios from "axios";

const parseDescription = (desc: string) => {
  if (!desc) return { long_description: '', jam_buka: '08:00 - 22:00', kapasitas: 'Tim Standar', spesifikasi: 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi' };
  
  if (desc.includes('|||')) {
    const parts = desc.split('|||');
    return {
      long_description: parts[0] || '',
      jam_buka: parts[1] || '08:00 - 22:00',
      kapasitas: parts[2] || 'Tim Standar',
      spesifikasi: parts[3] || 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi'
    };
  }

  try {
    const parsed = JSON.parse(desc);
    if (parsed && typeof parsed === 'object' && 'long_description' in parsed) {
      return parsed;
    }
  } catch(e) {}
  return {
    long_description: desc,
    jam_buka: '08:00 - 22:00',
    kapasitas: 'Tim Standar',
    spesifikasi: 'Ukuran Standar Internasional, Material Lantai Premium, Pencahayaan LED Terang, Level Kompetisi'
  };
};

export default function UserDashboard() {
    const router = useRouter();
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [fields, setFields] = useState<Field[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFields = async () => {
            try {
                setIsLoading(true);
                const data = await getAllFields();
                setFields(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data?.message || "Gagal memuat data lapangan.");
                } else {
                    setError("Terjadi kesalahan, coba lagi.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchFields();
    }, []);

    // Sekarang pakai 'name' sesuai field BE yang baru
    const filteredFields = fields.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFields.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredFields.slice(startIndex, startIndex + itemsPerPage);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = () => {
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    return (
        <div className="w-full pb-20 font-sans bg-[#FDFBF5] min-h-screen">

            {/* HERO SECTION */}
            <section className="relative w-full h-100 flex flex-col justify-center items-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-[#0a140d]/70 z-10"></div>
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=2071&auto=format&fit=crop')" }}
                ></div>
                <div className="z-20 text-center px-4 mt-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                        BOOKING FASILITAS<br />GOR UDINUS
                    </h1>
                    <button className="bg-[#E5C3A6] hover:bg-[#d5b090] text-[#1B3627] font-bold py-3.5 px-8 rounded-xl transition-colors">
                        Cari Fasilitas Sekarang
                    </button>
                </div>
            </section>

            {/* SEARCH BAR */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-9 relative z-30">
                <div className="bg-white rounded-[20px] shadow-xl shadow-gray-200/50 p-2 flex flex-col sm:flex-row items-center gap-3 border border-gray-100">
                    <div className="grow flex items-center bg-[#F5F2E9] rounded-xl px-4 py-1 w-full">
                        <Search className="text-gray-400 w-5 h-5 shrink-0" />
                        <input
                            type="text"
                            placeholder="Cari nama fasilitas"
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearchSubmit();
                            }}
                            className="w-full bg-transparent border-none focus:ring-0 text-[#1B3627] outline-none placeholder:text-gray-400 font-medium text-sm md:text-base px-3 py-3"
                        />
                    </div>
                    <button 
                        onClick={handleSearchSubmit}
                        className="bg-[#1B3627] hover:bg-[#132A1D] text-white px-10 py-4 rounded-xl font-bold transition-all w-full sm:w-auto shrink-0"
                    >
                        Cari
                    </button>
                </div>
            </section>

            {/* GRID KATALOG LAPANGAN */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Loading State */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#8CB954] animate-spin mb-4" />
                        <p className="text-[#1B3627] font-semibold text-sm">Memuat data lapangan...</p>
                    </div>
                )}

                {/* Error State */}
                {!isLoading && error && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-red-100">
                        <XCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-red-500">{error}</h3>
                        <p className="text-gray-400 text-sm mt-2">Periksa koneksi atau coba refresh halaman.</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredFields.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1B3627]">Fasilitas tidak ditemukan</h3>
                        <p className="text-gray-500 mt-2 text-sm">Coba gunakan kata kunci pencarian lain.</p>
                    </div>
                )}

                {/* Grid Data */}
                {!isLoading && !error && currentItems.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentItems.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => router.push(`/lapangan/${item.id}`)}
                                className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
                            >

                                {/* Image Area */}
                                <div className="h-48 bg-[#F5F2E9] relative flex items-center justify-center overflow-hidden">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 font-medium text-sm">No Image</span>
                                    )}
                                    {/* Tag kategori */}
                                    <div className="absolute top-4 right-4 bg-[#E5C3A6] text-[#1B3627] text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
                                        {item.category}
                                    </div>
                                    <div className="absolute inset-0 bg-[#1B3627]/0 group-hover:bg-[#1B3627]/5 transition-colors duration-300"></div>
                                </div>

                                <div className="p-6 flex flex-col grow">
                                    {/* Nama */}
                                    <h3 className="font-bold text-lg text-[#1B3627] mb-2 group-hover:text-[#8CB954] transition-colors">
                                        {item.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center gap-1 mb-3">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                                        <span className="text-xs text-gray-400">· {item.surface_type}</span>
                                    </div>

                                    {/* Deskripsi */}
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                        {parseDescription(item.description || '').long_description}
                                    </p>

                                    {/* Status */}
                                    <div className={`flex items-center text-sm font-medium mb-4 ${item.status === "available" ? "text-green-600" : "text-red-500"}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${item.status === "available" ? "bg-green-50" : "bg-red-50"}`}>
                                            {item.status === "available"
                                                ? <CheckCircle className="w-4 h-4 text-green-500" />
                                                : <XCircle className="w-4 h-4 text-red-500" />
                                            }
                                        </div>
                                        {item.status === "available" ? "Tersedia" : "Maintenance"}
                                    </div>

                                    {/* Harga & Booking */}
                                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                                        <div>
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Harga Sewa</p>
                                            {item.price_min ? (
                                                <p className="font-bold text-lg text-[#1B3627]">
                                                    Rp {item.price_min}
                                                    {item.price_max && item.price_max !== item.price_min && (
                                                        <span className="text-sm font-medium text-gray-400"> - {item.price_max}</span>
                                                    )}
                                                    <span className="font-medium text-sm text-gray-400"> /jam</span>
                                                </p>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic">Harga belum tersedia</p>
                                            )}
                                        </div>
                                        <Link
                                            href={`/booking/${item.id}`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-[#E5C3A6] hover:bg-[#d5b090] text-[#1B3627] text-sm font-bold px-6 py-2.5 rounded-xl transition-colors"
                                        >
                                            Booking
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="flex justify-center items-center mt-14 gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-[#1B3627]" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-11 h-11 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1
                                    ? "bg-[#1B3627] text-white shadow-md shadow-green-900/20"
                                    : "bg-white text-gray-500 border border-gray-200 hover:border-[#8CB954] hover:text-[#1B3627]"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-[#1B3627]" />
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}