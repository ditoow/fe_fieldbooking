"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field } from "@/lib/api/field";
import { Slot } from "@/lib/api/schedule";
import { createBooking } from "@/lib/api/booking";
import { formatRupiah } from "@/lib/utils/price";
import axios from "axios";

interface DateItem {
    id: number;
    fullDate: string;
    fullDateISO: string;
    isPast: boolean;
    dayName: string;
    dateNum: number;
    monthName: string;
}

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    field: Field;
    dates: DateItem[];
    selectedDate: number;
    selectedSlots: Slot[];
    totalHarga: number;
}

export default function ConfirmModal({
    isOpen, onClose, field, dates, selectedDate, selectedSlots, totalHarga
}: ConfirmModalProps) {
    const router = useRouter();
    const [isAgreed, setIsAgreed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const dateString = dates?.find(d => d.id === selectedDate)?.fullDate || "";

    const handleBooking = async () => {
        if (!isAgreed || selectedSlots.length === 0) return;
        setIsLoading(true);
        setError("");

        try {
            // Membentuk payload baru sesuai skema on-demand
            const payload = {
                field_id: field.id,
                date: dates[selectedDate].fullDateISO,
                time_slots: selectedSlots.map(s => s.start_time)
            };

            // DEBUG — lihat apa yang dikirim ke BE
            console.log('payload yang dikirim:', payload);

            const result = await createBooking(payload);

            // DEBUG — lihat response dari BE
            console.log('result booking:', result);

            router.push(`/pembayaran?booking_id=${result.data.id}`);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // DEBUG — lihat detail error dari BE
                console.log('status:', err.response?.status);
                console.log('error response:', err.response?.data);

                setError(err.response?.data?.message || "Booking gagal, coba lagi.");
            } else {
                console.log('unknown error:', err);
                setError("Terjadi kesalahan.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-[#FDFBF5] border-gray-200 sm:max-w-sm p-0 overflow-hidden [&>button]:text-white [&>button]:top-6 [&>button]:right-6">
                <DialogHeader className="bg-[#1B3627] text-white p-6 text-center pb-6 m-0">
                    <div className="flex justify-center mb-3">
                        <CheckCircle2 className="w-8 h-8 text-[#8CB954]" />
                    </div>
                    <DialogTitle className="text-base font-bold tracking-wide text-center text-white">
                        Konfirmasi Pesanan
                    </DialogTitle>
                    <p className="text-[9px] uppercase tracking-widest text-[#8CB954] mt-1">PERIKSA DETAIL PESANAN ANDA</p>
                </DialogHeader>

                <div className="p-6">
                    <h4 className="font-bold text-[#1B3627] text-[15px] mb-5">{field?.name}</h4>
                    <div className="space-y-4 mb-6">
                        <div className="flex gap-3 items-start">
                            <CalendarIcon className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">TANGGAL</p>
                                <p className="text-xs font-bold text-[#1B3627]">{dateString}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 items-start">
                            <Clock className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">WAKTU ({selectedSlots.length} Sesi)</p>
                                <p className="text-xs font-bold text-[#1B3627]">
                                    {selectedSlots.map(s => `${s.start_time} - ${s.end_time}`).join(", ")}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-y border-gray-200/60 py-4 mb-4">
                        <span className="text-xs font-medium text-gray-600">Total Harga</span>
                        <span className="text-lg font-black text-[#1B3627]">Rp {formatRupiah(String(totalHarga))}</span>
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 mb-4 text-center">{error}</p>
                    )}

                    <label className="flex gap-3 cursor-pointer group mb-6">
                        <div className="relative mt-0.5">
                            <input type="checkbox" className="sr-only" checked={isAgreed} onChange={() => setIsAgreed(!isAgreed)} />
                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${isAgreed ? "bg-[#1B3627] border-[#1B3627]" : "border-gray-200"}`}>
                                {isAgreed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </div>
                        <span className="text-[10px] text-gray-500 leading-relaxed font-medium">
                            Dengan memesan, anda menyetujui <span className="text-[#1B3627] font-bold">kebijakan pembatalan</span> dan peraturan penggunaan fasilitas yang berlaku di GOR UDINUS.
                        </span>
                    </label>

                    <div className="space-y-2">
                        <button
                            onClick={handleBooking}
                            disabled={!isAgreed || isLoading}
                            className={`w-full flex items-center justify-center py-3.5 rounded-md font-bold text-xs transition shadow-lg ${isAgreed && !isLoading
                                ? "bg-[#1B3627] hover:bg-[#132A1D] text-white shadow-green-900/20"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Memproses...</>
                            ) : (
                                "Ya, Pesan Sekarang →"
                            )}
                        </button>
                        <button onClick={onClose} className="w-full py-3 text-xs font-bold text-[#1B3627] hover:text-gray-600 transition">
                            Batal
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}