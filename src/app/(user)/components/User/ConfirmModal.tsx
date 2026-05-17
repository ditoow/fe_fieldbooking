import React from "react";
import { Calendar as CalendarIcon, Clock, CheckCircle2, MapPin, Info } from "lucide-react";
import Link from "next/link";

export default function ConfirmModal({
    isOpen, onClose, lapangan, dates, selectedDate, selectedTimes, formatRupiah, totalHarga
}: any) {
    const [isAgreed, setIsAgreed] = React.useState(false);

    if (!isOpen) return null;

    const dateString = dates.find((d: any) => d.id === selectedDate)?.fullDate || "";
    const timesString = selectedTimes.join(",");

    const targetUrl = `/pembayaran?id=${lapangan.id}&date=${encodeURIComponent(dateString)}&time=${encodeURIComponent(timesString)}`;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0a140d]/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}></div>
            <div className="relative w-full max-w-sm bg-[#FDFBF5] rounded-xl overflow-hidden shadow-2xl animate-in zoom-in duration-200 border border-gray-200">
                <div className="bg-[#1B3627] text-white p-6 text-center">
                    <div className="flex justify-center mb-3">
                        <CheckCircle2 className="w-8 h-8 text-[#8CB954]" />
                    </div>
                    <h3 className="text-base font-bold tracking-wide">Konfirmasi Pesanan</h3>
                    <p className="text-[9px] uppercase tracking-widest text-[#8CB954] mt-1">PERIKSA DETAIL PESANAN ANDA</p>
                </div>
                <div className="p-6">
                    <h4 className="font-bold text-[#1B3627] text-[15px] mb-5">{lapangan.nama}</h4>
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
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">WAKTU ({selectedTimes.length} Sesi)</p>
                                <p className="text-xs font-bold text-[#1B3627]">{selectedTimes.join(", ")}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center border-y border-gray-200/60 py-4 mb-4">
                        <span className="text-xs font-medium text-gray-600">Total Harga</span>
                        <span className="text-lg font-black text-[#1B3627]">Rp {formatRupiah(totalHarga)}</span>
                    </div>

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
                        <Link href={targetUrl} className={`w-full flex items-center justify-center py-3.5 rounded-md font-bold text-xs transition shadow-lg ${isAgreed ? "bg-[#1B3627] hover:bg-[#132A1D] text-white shadow-green-900/20" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                            Ya, Pesan Sekarang →
                        </Link>
                        <button onClick={onClose} className="w-full py-3 text-xs font-bold text-[#1B3627] hover:text-gray-600 transition">
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}