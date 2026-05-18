"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import BookingSummary from "./BookingSummary";

export default function ScheduleCalendar({ lapangan }: { lapangan: any }) {
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<number>(0);

    // REVISI: Menggunakan Array untuk menampung banyak jam
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const hargaPerJam = lapangan.harga;

    // REVISI: Menghitung total harga dikali jumlah jam yang dipilih
    const totalHarga = selectedTimes.length * hargaPerJam;

    const generateDates = () => {
        const datesList = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const currentDay = now.getDay();
        const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;

        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - distanceToMonday);

        const startDate = new Date(startOfThisWeek);
        startDate.setDate(startOfThisWeek.getDate() + (weekOffset * 7));

        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const isPast = date.getTime() < now.getTime();

            datesList.push({
                id: i,
                dayName: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                dateNum: date.getDate(),
                monthName: date.toLocaleDateString('en-US', { month: 'short' }),
                fullDate: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
                isPast: isPast
            });
        }
        return datesList;
    };

    const dates = generateDates();

    useEffect(() => {
        const validDate = dates.find(d => !d.isPast);
        if (validDate) setSelectedDate(validDate.id);
    }, [weekOffset]);

    const timeSlots = [
        { time: "08:00", status: "BOOKED" }, { time: "09:00", status: "AVAILABLE" },
        { time: "10:00", status: "FULL" }, { time: "11:00", status: "AVAILABLE" },
        { time: "12:00", status: "AVAILABLE" }, { time: "13:00", status: "AVAILABLE" },
        { time: "14:00", status: "AVAILABLE" }, { time: "15:00", status: "BOOKED" },
        { time: "16:00", status: "AVAILABLE" }, { time: "17:00", status: "AVAILABLE" },
        { time: "18:00", status: "AVAILABLE" }, { time: "19:00", status: "AVAILABLE" }
    ];

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(angka);
    };

    const labelPeriodeMinggu = () => {
        if (dates.length === 0) return "";
        return `${dates[0].dateNum} ${dates[0].monthName} — ${dates[6].dateNum} ${dates[6].monthName} 2026`;
    };

    // FUNGSI BARU: Untuk menambah/menghapus jam (Multi-select)
    const toggleTimeSlot = (time: string) => {
        if (selectedTimes.includes(time)) {
            setSelectedTimes(selectedTimes.filter(t => t !== time)); // Hapus jika sudah ada
        } else {
            setSelectedTimes([...selectedTimes, time].sort()); // Tambah dan urutkan
        }
    };

    return (
        <div className="space-y-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-transparent">
                <div className="md:col-span-7 h-64 md:h-80 w-full overflow-hidden rounded-2xl shadow-sm">
                    <img src={lapangan.image} alt={lapangan.nama} className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-5 space-y-4">
                    <p className="text-xs font-bold text-[#c29867] uppercase tracking-widest">VENUE EXCELLENCE</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1B3627]">{lapangan.nama}</h2>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-300" /> {lapangan.lokasi}
                    </p>
                    <div className="pt-2">
                        <p className="text-2xl font-black text-[#1B3627]">
                            Rp {formatRupiah(hargaPerJam)} <span className="text-xs font-normal text-gray-400">/ hour</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-extrabold text-[#1B3627]">Field Availability</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{labelPeriodeMinggu()}</p>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={() => { if (weekOffset > 0) { setWeekOffset(p => p - 1); setSelectedTimes([]); } }} disabled={weekOffset === 0} className="p-1.5 rounded-md border border-gray-100 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft className="w-3.5 h-3.5 text-gray-500" /></button>
                            <button onClick={() => { setWeekOffset(p => p + 1); setSelectedTimes([]); }} className="p-1.5 rounded-md border border-gray-100 hover:bg-gray-50"><ChevronRight className="w-3.5 h-3.5 text-gray-500" /></button>
                        </div>
                    </div>

                    <div className="flex gap-2 justify-between border-b border-gray-50 pb-6 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {dates.map((item) => (
                            <button
                                key={item.id}
                                disabled={item.isPast}
                                // Reset jam yang dipilih saat pindah hari
                                onClick={() => { setSelectedDate(item.id); setSelectedTimes([]); }}
                                className={`flex flex-col items-center justify-center py-3 w-14 rounded-xl transition-all shrink-0 ${item.isPast ? "bg-gray-100 text-gray-300 cursor-not-allowed opacity-50" : selectedDate === item.id ? "bg-[#1B3627] text-white font-bold" : "bg-white text-gray-400 hover:bg-gray-50"}`}
                            >
                                <span className="text-[9px] uppercase font-bold tracking-wider mb-1">{item.dayName}</span>
                                <span className="text-lg font-black">{item.dateNum}</span>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {timeSlots.map((slot, index) => {
                            const isSelected = selectedTimes.includes(slot.time); // Cek array
                            const isBooked = slot.status === "BOOKED";
                            const weakness = slot.status === "FULL";
                            return (
                                <button
                                    key={index}
                                    disabled={isBooked || weakness}
                                    onClick={() => toggleTimeSlot(slot.time)} // Pakai fungsi toggle
                                    className={`p-4 rounded-xl flex flex-col items-start justify-between border text-left h-[76px] transition-all relative ${isBooked ? "bg-[#EFEFEF]/60 border-transparent cursor-not-allowed" : weakness ? "bg-[#F5F2E9] border-transparent cursor-not-allowed" : isSelected ? "bg-[#8b5a2b] border-[#8b5a2b] text-white" : "bg-white border-gray-100 hover:border-gray-300"}`}
                                >
                                    <span className={`text-xs font-bold ${isBooked ? "text-gray-400" : isSelected ? "text-white" : "text-gray-800"}`}>{slot.time}</span>
                                    <span className={`text-[8px] font-black tracking-widest uppercase rounded px-1.5 py-0.5 ${isBooked ? "bg-[#1B3627] text-white" : weakness ? "bg-gray-300 text-gray-600" : isSelected ? "bg-white/20 text-white" : "text-gray-400"}`}>
                                        {isBooked ? "BOOKED" : weakness ? "FULL" : isSelected ? "SELECTED" : "AVAILABLE"}
                                    </span>
                                    {isSelected && <div className="absolute inset-0 border-2 border-[#8b5a2b] rounded-xl pointer-events-none" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <BookingSummary
                    dates={dates}
                    selectedDate={selectedDate}
                    selectedTimes={selectedTimes} // Oper prop baru
                    formatRupiah={formatRupiah}
                    totalHarga={totalHarga}       // Oper total harga
                    onConfirmClick={() => setIsModalOpen(true)}
                />
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                lapangan={lapangan}
                dates={dates}
                selectedDate={selectedDate}
                selectedTimes={selectedTimes} // Oper prop baru
                formatRupiah={formatRupiah}
                totalHarga={totalHarga}       // Oper total harga
            />
        </div>
    );
}