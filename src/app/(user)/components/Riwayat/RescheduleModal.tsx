"use client";
 
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon, Clock, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { getSchedules, Slot, ScheduleDay } from "@/lib/api/schedule";
import { rescheduleBookingApi } from "@/lib/api/booking";
import { HistoryItem } from "@/app/(user)/riwayat/page";
 
interface DateItem {
    id: number;
    dayName: string;
    dateNum: number;
    monthName: string;
    fullDate: string;
    fullDateISO: string;
}
 
interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingItem: HistoryItem | null;
    onSuccess: () => void;
}
 
export default function RescheduleModal({
    isOpen,
    onClose,
    bookingItem,
    onSuccess,
}: RescheduleModalProps) {
    const [dates, setDates] = useState<DateItem[]>([]);
    const [selectedDateIndex, setSelectedDateIndex] = useState<number>(0);
    const [selectedNewTimeSlots, setSelectedNewTimeSlots] = useState<string[]>([]);
    const [schedules, setSchedules] = useState<ScheduleDay[]>([]);
    const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
 
    // Generate 7 hari dari hari ini
    useEffect(() => {
        const datesList: DateItem[] = [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);
 
        for (let i = 0; i < 7; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() + i);
            datesList.push({
                id: i,
                dayName: date.toLocaleDateString('id-ID', { weekday: 'short' }),
                dateNum: date.getDate(),
                monthName: date.toLocaleDateString('en-US', { month: 'short' }),
                fullDate: date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
                fullDateISO: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
            });
        }
        setDates(datesList);
        setSelectedDateIndex(0);
        setSelectedNewTimeSlots([]);
    }, [isOpen]);
 
    // Clear state
    useEffect(() => {
        setError("");
        setSuccessMsg("");
        setSelectedNewTimeSlots([]);
    }, [bookingItem, isOpen]);
 
    // Fetch schedules available pada tanggal yang dipilih
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!bookingItem || dates.length === 0) return;
            const fieldId = bookingItem.facilityId || 1;
            const targetDateISO = dates[selectedDateIndex].fullDateISO;
 
            setIsLoadingSchedules(true);
            setError("");
            setSelectedNewTimeSlots([]);
 
            try {
                // Fetch untuk single day
                const data = await getSchedules(fieldId, targetDateISO, targetDateISO);
                setSchedules(data);
            } catch (err) {
                console.error("Gagal memuat jadwal untuk reschedule:", err);
                setError("Gagal memuat jadwal kosong.");
            } finally {
                setIsLoadingSchedules(false);
            }
        };
 
        if (isOpen && bookingItem) {
            fetchAvailableSlots();
        }
    }, [selectedDateIndex, bookingItem, dates, isOpen]);
 
    if (!bookingItem) return null;
 
    const selectedDateISO = dates[selectedDateIndex]?.fullDateISO;
    const currentSlots = schedules.find(s => s.date === selectedDateISO)?.slots ?? [];
    const numSlots = bookingItem.schedules?.length || 0;
 
    const isSlotPast = (slot: Slot): boolean => {
        const today = new Date();
        const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
 
        if (selectedDateISO !== todayISO) return false;
 
        const currentHour = today.getHours();
        const currentMinute = today.getMinutes();
        const [slotHour, slotMinute] = slot.start_time.split(':').map(Number);
 
        return slotHour < currentHour || (slotHour === currentHour && slotMinute <= currentMinute);
    };
 
    const checkContiguous = (slots: string[]) => {
        if (slots.length <= 1) return true;
        const sorted = [...slots].sort();
        for (let i = 0; i < sorted.length - 1; i++) {
            const currentHour = parseInt(sorted[i].split(":")[0]);
            const nextHour = parseInt(sorted[i+1].split(":")[0]);
            if (nextHour !== currentHour + 1) return false;
        }
        return true;
    };

    const toggleSlot = (slotTime: string) => {
        let newSlots = [...selectedNewTimeSlots];
        if (newSlots.includes(slotTime)) {
            newSlots = newSlots.filter(s => s !== slotTime);
        } else {
            if (newSlots.length >= numSlots) {
                alert(`Anda hanya dapat memilih ${numSlots} jam sesuai dengan durasi booking awal.`);
                return;
            }
            newSlots.push(slotTime);
        }

        if (!checkContiguous(newSlots)) {
            alert("Jadwal harus berurutan, tidak boleh ada jeda waktu.");
            return;
        }

        setSelectedNewTimeSlots(newSlots);
    };

    const handleRescheduleSubmit = async () => {
        if (selectedNewTimeSlots.length !== numSlots || !selectedDateISO) {
            setError(`Harap pilih tepat ${numSlots} jam.`);
            return;
        }
 
        // Validasi 2 jam sebelum mulai dari jadwal lama paling awal
        if (bookingItem.schedules && bookingItem.schedules.length > 0) {
            const sortedSchedules = [...bookingItem.schedules].sort((a, b) => {
                const dateTimeA = new Date(`${a.date}T${a.start_time}`);
                const dateTimeB = new Date(`${b.date}T${b.start_time}`);
                return dateTimeA.getTime() - dateTimeB.getTime();
            });
 
            const earliestSchedule = sortedSchedules[0];
            const oldDateTime = new Date(`${earliestSchedule.date}T${earliestSchedule.start_time}`);
            const diffMs = oldDateTime.getTime() - Date.now();
            const diffHours = diffMs / (1000 * 60 * 60);
 
            if (diffHours < 2) {
                setError("Reschedule hanya dapat dilakukan maksimal 2 jam sebelum jadwal lama dimulai.");
                return;
            }
        }
 
        setIsSubmitting(true);
        setError("");
        setSuccessMsg("");
 
        try {
            const earliestSlot = [...selectedNewTimeSlots].sort()[0];

            await rescheduleBookingApi(bookingItem.id, {
                field_id: bookingItem.facilityId || 1,
                date: selectedDateISO,
                new_time_slot: earliestSlot
            });
 
            setSuccessMsg("Reschedule berhasil dilakukan!");
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        } catch (err: any) {
            console.error("Gagal reschedule:", err);
            setError(err.message || "Terjadi kesalahan. Gagal melakukan reschedule.");
        } finally {
            setIsSubmitting(false);
        }
    };
 
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
            <DialogContent className="bg-[#FDFBF5] border-gray-200 sm:max-w-sm p-0 overflow-hidden flex flex-col gap-0 max-h-[90dvh] [&>button]:text-white [&>button]:top-5 [&>button]:right-5">
                <DialogHeader className="bg-[#1B3627] text-white p-6 text-center m-0 shrink-0">
                    <DialogTitle className="text-base font-bold tracking-wide text-center">
                        Reschedule Jadwal
                    </DialogTitle>
                    <p className="text-[9px] uppercase tracking-widest text-[#8CB954] mt-1">
                        PILIH JADWAL BARU ({numSlots} Sesi Berurutan)
                    </p>
                </DialogHeader>
 
                <div className="p-6 space-y-5 overflow-y-auto flex-1 overscroll-contain">
                    {/* INFO LAPANGAN */}
                    <div>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">FASILITAS</p>
                        <p className="text-sm font-bold text-[#1B3627]">{bookingItem.title}</p>
                    </div>
 
                    {/* PILIHAN TANGGAL BARU */}
                    {dates.length > 0 && (
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">PILIH TANGGAL BARU</p>
                            <div className="flex gap-2 pb-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                                {dates.map((d, index) => (
                                    <button
                                        key={d.id}
                                        type="button"
                                        onClick={() => setSelectedDateIndex(index)}
                                        className={`flex flex-col items-center justify-center py-2.5 w-12 shrink-0 rounded-xl transition ${
                                            selectedDateIndex === index
                                                ? "bg-[#8b5a2b] text-white font-bold"
                                                : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="text-[8px] uppercase font-bold mb-0.5">{d.dayName}</span>
                                        <span className="text-sm font-black">{d.dateNum}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
 
                    {/* PILIHAN WAKTU BARU */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">PILIH JAM BARU</p>
                            {numSlots > 0 && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                    selectedNewTimeSlots.length === numSlots 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-orange-100 text-orange-700"
                                }`}>
                                    {selectedNewTimeSlots.length}/{numSlots} jam dipilih
                                </span>
                            )}
                        </div>
                        {isLoadingSchedules ? (
                            <div className="flex flex-col items-center justify-center py-6 bg-white border border-gray-100 rounded-xl">
                                <Loader2 className="w-6 h-6 text-[#1B3627] animate-spin mb-2" />
                                <p className="text-[10px] text-gray-400 font-bold">Memuat slot tersedia...</p>
                            </div>
                        ) : error && currentSlots.length === 0 ? (
                            <div className="text-center py-6 text-red-500 text-xs font-semibold">
                                {error}
                            </div>
                        ) : currentSlots.length === 0 ? (
                            <div className="text-center py-6 text-gray-400 text-xs font-medium bg-white border border-gray-100 rounded-xl">
                                Tidak ada jadwal tersedia untuk tanggal ini.
                            </div>
                        ) : (
                            <div className="grid gap-2 max-h-40 overflow-y-auto p-1 grid-cols-3">
                                {currentSlots.map((slot) => {
                                    const isDisabled = slot.status === "booked" || slot.status === "maintenance" || isSlotPast(slot);
                                    const isSelected = selectedNewTimeSlots.includes(slot.start_time);
 
                                    return (
                                        <button
                                            key={slot.start_time}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => toggleSlot(slot.start_time)}
                                            className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center transition-all ${
                                                isDisabled
                                                    ? "bg-gray-100 text-gray-300 border-transparent cursor-not-allowed opacity-50"
                                                    : isSelected
                                                        ? "bg-[#8b5a2b] text-white border-transparent shadow-sm"
                                                        : "bg-white text-gray-700 border-gray-100 hover:border-gray-300"
                                            }`}
                                        >
                                            {slot.start_time}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
 
                    {/* BANNER NOTIFIKASI */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 p-3 rounded-lg flex items-start gap-2 text-red-600">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold leading-normal">{error}</p>
                        </div>
                    )}
 
                    {successMsg && (
                        <div className="bg-green-50 border border-green-200 p-3 rounded-lg flex items-start gap-2 text-green-600">
                            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p className="text-[10px] font-bold leading-normal">{successMsg}</p>
                        </div>
                    )}
 
                    {/* TOMBOL AKSI */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200/60">
                        <button
                            disabled={isSubmitting || selectedNewTimeSlots.length !== numSlots}
                            onClick={handleRescheduleSubmit}
                            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md ${
                                selectedNewTimeSlots.length === numSlots && !isSubmitting
                                    ? "bg-[#1B3627] hover:bg-[#132A1D] text-white shadow-green-950/20"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> memproses...
                                </span>
                            ) : (
                                "Konfirmasi Reschedule"
                            )}
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={onClose}
                            className="w-full py-2.5 text-xs font-bold text-[#1B3627] hover:bg-gray-50 rounded-lg transition"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
