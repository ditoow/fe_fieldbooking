"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ConfirmModal from "./ConfirmModal";
import BookingSummary from "./BookingSummary";
import { Field } from "@/lib/api/field";
import { getSchedules, Slot, ScheduleDay } from "@/lib/api/schedule";
import { getCurrentPrice, formatRupiah } from "@/lib/utils/price";
import axios from "axios";

interface DateItem {
    id: number;
    dayName: string;
    dateNum: number;
    monthName: string;
    fullDate: string;
    fullDateISO: string;
    isPast: boolean;
}

interface ScheduleCalendarProps {
    field: Field;
}

export default function ScheduleCalendar({ field }: ScheduleCalendarProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<number>(0);
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schedules, setSchedules] = useState<ScheduleDay[]>([]);
    const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
    const [scheduleError, setScheduleError] = useState("");

    const generateDatesByOffset = (offset: number): DateItem[] => {
        const datesList: DateItem[] = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const currentDay = now.getDay();
        const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;

        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - distanceToMonday);

        const startDate = new Date(startOfThisWeek);
        startDate.setDate(startOfThisWeek.getDate() + (offset * 7));

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
                fullDateISO: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
                isPast: isPast
            });
        }
        return datesList;
    };

    const dates = generateDatesByOffset(weekOffset);

    useEffect(() => {
        const today = new Date();
        const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const todayIndex = dates.findIndex(d => d.fullDateISO === todayISO);

        if (todayIndex !== -1) {
            setSelectedDate(todayIndex);
        } else {
            const firstValid = dates.find(d => !d.isPast);
            if (firstValid) setSelectedDate(firstValid.id);
        }
    }, []);

    useEffect(() => {
        const fetchSchedules = async () => {
            if (dates.length === 0) return;
            setIsLoadingSchedule(true);
            setScheduleError("");

            try {
                const start_date = dates[0].fullDateISO;
                const end_date = dates[6].fullDateISO;
                const data = await getSchedules(field.id, start_date, end_date);
                setSchedules(data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setScheduleError(err.response?.data?.message || "Gagal memuat jadwal.");
                } else {
                    setScheduleError("Terjadi kesalahan.");
                }
            } finally {
                setIsLoadingSchedule(false);
            }
        };

        fetchSchedules();
    }, [weekOffset, field.id]);

    const selectedDateISO = dates[selectedDate]?.fullDateISO;
    const currentSlots = schedules.find(s => s.date === selectedDateISO)?.slots ?? [];
    
    // Ambil role user
    const role = user?.roles?.[0]?.name || "umum";
    const baseTotalHarga = selectedSlots.reduce((acc, slot) => acc + Number(slot.price), 0);
    const totalHarga = role === 'mahasiswa' ? 0 : baseTotalHarga;

    const isSlotPast = (slot: Slot): boolean => {
        const today = new Date();
        const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (selectedDateISO !== todayISO) return false;

        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        const [slotHour, slotMinute] = slot.start_time.split(':').map(Number);

        return slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute);
    };

    const handlePrevWeek = () => {
        if (weekOffset > 0) {
            const nextOffset = weekOffset - 1;
            setWeekOffset(nextOffset);
            setSelectedSlots([]);
            const nextDates = generateDatesByOffset(nextOffset);
            const validDate = nextDates.find(d => !d.isPast);
            if (validDate) setSelectedDate(validDate.id);
        }
    };

    const handleNextWeek = () => {
        const nextOffset = weekOffset + 1;
        setWeekOffset(nextOffset);
        setSelectedSlots([]);
        const nextDates = generateDatesByOffset(nextOffset);
        const validDate = nextDates.find(d => !d.isPast);
        if (validDate) setSelectedDate(validDate.id);
    };

    const labelPeriodeMinggu = () => {
        if (dates.length === 0) return "";
        return `${dates[0].dateNum} ${dates[0].monthName} — ${dates[6].dateNum} ${dates[6].monthName} 2026`;
    };

    const toggleSlot = (slot: Slot) => {
        // Tracker sekarang menggunakan start_time alih-alih ID
        const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
        if (isSelected) {
            setSelectedSlots(selectedSlots.filter(s => s.start_time !== slot.start_time));
        } else {
            setSelectedSlots([...selectedSlots, slot]);
        }
    };

    const hargaTampil = getCurrentPrice(field.price_min, field.price_max);

    return (
        <div className="space-y-8 relative">
            {/* Info Lapangan */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-transparent">
                <div className="md:col-span-7 h-64 md:h-80 w-full overflow-hidden rounded-2xl shadow-sm relative">
                    {field.image_url ? (
                        <Image
                            src={field.image_url}
                            alt={field.name}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-[#F5F2E9] flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                    )}
                </div>
                <div className="md:col-span-5 space-y-4">
                    <p className="text-xs font-bold text-[#c29867] uppercase tracking-widest">{field.category}</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1B3627]">{field.name}</h2>
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-300" /> {field.surface_type}
                    </p>
                    <div className="pt-2">
                        {hargaTampil ? (
                            <p className="text-2xl font-black text-[#1B3627]">
                                Rp {formatRupiah(hargaTampil)}{" "}
                                <span className="text-xs font-normal text-gray-400">/ hour</span>
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400 italic">Harga belum tersedia</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    {/* Header kalender */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-extrabold text-[#1B3627]">Field Availability</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{labelPeriodeMinggu()}</p>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="outline" size="icon"
                                onClick={handlePrevWeek}
                                disabled={weekOffset === 0}
                                className="h-8 w-8 rounded-md border-gray-100 text-gray-500"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                                variant="outline" size="icon"
                                onClick={handleNextWeek}
                                className="h-8 w-8 rounded-md border-gray-100 text-gray-500"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Pilih tanggal */}
                    <div className="flex gap-2 justify-between border-b border-gray-50 pb-6 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {dates.map((item) => (
                            <Button
                                key={item.id}
                                disabled={item.isPast}
                                variant={selectedDate === item.id ? "default" : "ghost"}
                                onClick={() => { setSelectedDate(item.id); setSelectedSlots([]); }}
                                className={`flex flex-col items-center justify-center py-3 w-14 h-auto rounded-xl transition-all shrink-0 ${item.isPast
                                    ? "bg-gray-100 text-gray-300 opacity-50 cursor-not-allowed"
                                    : selectedDate === item.id
                                        ? "bg-[#1B3627] text-white font-bold hover:bg-[#132A1D]"
                                        : "bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                    }`}
                            >
                                <span className="text-[9px] uppercase font-bold tracking-wider mb-1">{item.dayName}</span>
                                <span className="text-lg font-black">{item.dateNum}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-4 mb-4 flex-wrap">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-white border border-gray-200"></div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-[#EFEFEF]"></div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Booked</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-red-100 border border-red-200"></div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Maintenance</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-[#F5F2E9] opacity-50"></div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Past</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-[#8b5a2b]"></div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase">Selected</span>
                        </div>
                    </div>

                    {/* Time Slots */}
                    {isLoadingSchedule ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <Loader2 className="w-8 h-8 text-[#8CB954] animate-spin mb-2" />
                            <p className="text-sm text-gray-400">Memuat jadwal...</p>
                        </div>
                    ) : scheduleError ? (
                        <div className="text-center py-10">
                            <p className="text-sm text-red-400">{scheduleError}</p>
                        </div>
                    ) : currentSlots.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-sm text-gray-400">Tidak ada jadwal tersedia untuk tanggal ini.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {currentSlots.map((slot) => {
                                const isSelected = selectedSlots.some(s => s.start_time === slot.start_time);
                                const isBooked = slot.status === "booked";
                                const isMaintenance = slot.status === "maintenance";
                                const isPast = isSlotPast(slot);

                                return (
                                    <Button
                                        key={slot.start_time} // Menggunakan start_time karena id bisa undefined
                                        disabled={isBooked || isPast || isMaintenance}
                                        variant="outline"
                                        onClick={() => toggleSlot(slot)}
                                        className={`p-4 rounded-xl flex flex-col items-start justify-between border text-left h-19 transition-all relative ${isMaintenance
                                            ? "bg-red-50/70 border-red-100/50 text-red-400 cursor-not-allowed hover:bg-red-50/70"
                                            : isBooked
                                                ? "bg-[#EFEFEF]/60 border-transparent opacity-100 cursor-not-allowed hover:bg-[#EFEFEF]/60"
                                                : isPast
                                                    ? "bg-[#F5F2E9] border-transparent opacity-50 cursor-not-allowed hover:bg-[#F5F2E9]"
                                                    : isSelected
                                                        ? "bg-[#8b5a2b] border-[#8b5a2b] text-white hover:bg-[#724a23] hover:text-white"
                                                        : "bg-white border-gray-100 text-gray-800 hover:border-gray-300 hover:bg-white"
                                            }`}
                                    >
                                        <span className={`text-xs font-bold ${isBooked || isPast || isMaintenance ? "text-gray-400" : isSelected ? "text-white" : "text-gray-800"
                                            }`}>
                                            {slot.start_time} - {slot.end_time}
                                        </span>
                                        <span className={`text-[8px] font-black tracking-widest uppercase rounded px-1.5 py-0.5 ${isMaintenance
                                            ? "bg-red-100 text-red-500"
                                            : isBooked
                                                ? "bg-[#1B3627] text-white"
                                                : isPast
                                                    ? "bg-gray-200 text-gray-500"
                                                    : isSelected
                                                        ? "bg-white/20 text-white"
                                                        : "text-gray-400 bg-gray-50"
                                            }`}>
                                            {isMaintenance ? "MAINTENANCE" : isBooked ? "BOOKED" : isPast ? "PAST" : isSelected ? "SELECTED" : "AVAILABLE"}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>

                <BookingSummary
                    dates={dates}
                    selectedDate={selectedDate}
                    selectedSlots={selectedSlots}
                    totalHarga={totalHarga}
                    onConfirmClick={() => {
                        if (!user) {
                            router.push("/login");
                        } else {
                            setIsModalOpen(true);
                        }
                    }}
                />
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                field={field}
                dates={dates}
                selectedDate={selectedDate}
                selectedSlots={selectedSlots}
                totalHarga={totalHarga}
            />
        </div>
    );
}