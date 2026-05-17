import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScheduleCalendar from "@/app/(user)/components/User/ScheduleCalendar";

export default async function BookingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const resolvedParams = await params;
    const idLapangan = parseInt(resolvedParams.id) || 1;

    const isOdd = idLapangan % 2 !== 0;

    const dataLapangan = {
        id: idLapangan,
        nama: isOdd ? "Lapangan Futsal Internasional" : "Arena Basket Indoor B",
        lokasi: isOdd ? "Gedung Olahraga Utama, Semarang" : "Student Center Lt. 3, Semarang",
        harga: isOdd ? 75000 : 60000,
        image: isOdd
            ? "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000"
            : "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000",
    };

    return (
        <div className="w-full pb-20 font-sans min-h-screen bg-[#FDFBF5] text-[#1B3627]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

                <Link
                    href="/dashboard"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#1B3627] mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
                </Link>

                <ScheduleCalendar lapangan={dataLapangan} />

            </div>
        </div>
    );
}