import React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export default function BookingSummary({
    dates, selectedDate, selectedTimes, formatRupiah, totalHarga, onConfirmClick
}: any) {
    return (
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#F5F2E9]/60 border border-gray-100 rounded-2xl p-6 text-[#1B3627]">
                <h4 className="text-sm font-black uppercase tracking-wider mb-6">Booking Summary</h4>
                <div className="space-y-4 mb-6">
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#8b5a2b]"><CalendarIcon className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">PILIH TANGGAL</p>
                            <p className="text-xs font-bold">{dates.find((d: any) => d.id === selectedDate)?.fullDate || "-"}</p>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-700"><Clock className="w-4 h-4" /></div>
                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">WAKTU ({selectedTimes.length} Sesi)</p>
                            <p className="text-xs font-bold">{selectedTimes.length > 0 ? selectedTimes.join(", ") : "-"}</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200/60 pt-4 mb-6">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">TOTAL HARGA</p>
                    <div className="flex justify-between items-baseline">
                        <p className="text-xl font-black">Rp {formatRupiah(totalHarga)}</p>
                        <span className="text-[9px] text-gray-400 font-medium">Tax included</span>
                    </div>
                </div>
                <button
                    onClick={onConfirmClick}
                    disabled={selectedTimes.length === 0}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all text-center ${selectedTimes.length > 0 ? "bg-[#8b5a2b] hover:bg-[#724a23]" : "bg-gray-300 cursor-not-allowed"}`}
                >
                    Confirm & Book Now →
                </button>
                <p className="text-[9px] text-center text-gray-400 mt-4 leading-relaxed">
                    By clicking "Book Now", you agree to our Terms of Service regarding online cancellations.
                </p>
            </div>
            <div className="bg-[#132A1D] rounded-2xl p-5 border border-white/5 text-white">
                <h5 className="text-xs font-bold flex items-center gap-2 mb-2 text-[#8CB954]"><span>🌿</span> Botanica Member Perk</h5>
                <p className="text-[11px] text-gray-300 leading-relaxed">Members receive a 15% discount on all morning bookings (08:00 - 11:00). Sign in to apply.</p>
            </div>
        </div>
    );
}