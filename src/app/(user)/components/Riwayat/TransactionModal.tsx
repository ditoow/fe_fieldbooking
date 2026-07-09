import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
// Import interface HistoryItem yang sudah kamu definisikan di halaman riwayat
import { HistoryItem } from "@/app/(user)/riwayat/page";

// Menambahkan prop onCancel & onRate ke dalam interface
interface TransactionModalProps {
    item: HistoryItem | null;
    onClose: () => void;
    formatRupiah: (angka: number) => string;
    onCancel?: (id: any) => void;
    userRole?: string;
    onReschedule?: (item: HistoryItem) => void;
    onRate?: (item: HistoryItem) => void;
}

export default function TransactionModal({
    item,
    onClose,
    formatRupiah,
    onCancel, // Menerima prop onCancel
    userRole,
    onReschedule,
    onRate
}: TransactionModalProps) {
    
    // Fungsi pembantu untuk menentukan apakah pemesanan bisa di-reschedule (sisa waktu >= 2 jam)
    const canReschedule = (schedules: any[] | undefined) => {
        if (!schedules || schedules.length === 0) return false;
        
        // Cari jadwal mulai paling awal
        const sorted = [...schedules].sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.start_time}`);
            const dateTimeB = new Date(`${b.date}T${b.start_time}`);
            return dateTimeA.getTime() - dateTimeB.getTime();
        });
        
        const startTime = new Date(`${sorted[0].date}T${sorted[0].start_time}`);
        const diffMs = startTime.getTime() - Date.now();
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours >= 2;
    };

    const isRescheduleAvailable = 
        item && 
        item.status === 'DIPESAN' && 
        userRole?.toLowerCase() === 'mahasiswa' && 
        onReschedule && 
        canReschedule(item.schedules);

    return (
        <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#FDFBF5] border-gray-200 p-0 overflow-hidden sm:max-w-sm [&>button]:text-white [&>button]:top-5 [&>button]:right-5">

                <DialogHeader className="bg-[#1B3627] text-white p-6 text-center m-0">
                    <DialogTitle className="text-base font-bold tracking-wide text-center">
                        Detail Transaksi
                    </DialogTitle>
                </DialogHeader>

                {item && (
                    <div className="p-6 space-y-4">
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">FASILITAS</p>
                            <p className="text-sm font-bold">{item.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">TANGGAL</p>
                                <p className="text-xs font-bold">{item.date}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">WAKTU</p>
                                <p className="text-xs font-bold">{item.time}</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-gray-500">Status Pembayaran</span>
                                <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded 
                                    ${item.status === 'SELESAI' ? 'bg-green-100 text-green-700' : 
                                      item.status === 'DIPESAN' ? 'bg-amber-100 text-[#8b5a2b]' : 
                                      item.status === 'DIBATALKAN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                        <div className="border-t border-gray-200/60 pt-3 flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-600">Total Biaya</span>
                            <span className="text-base font-black">Rp {formatRupiah(item.price)}</span>
                        </div>

                        {/* Area Tombol di dalam Modal */}
                        <div className="mt-4 flex flex-col gap-2">
                            {item.status === 'TERTUNDA' && onCancel && (
                                <button
                                    onClick={() => {
                                        onCancel(item.id);
                                        onClose();
                                    }}
                                    className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded hover:bg-red-100 transition tracking-wide"
                                >
                                    BATALKAN
                                </button>
                            )}
                            
                            {isRescheduleAvailable && onReschedule && (
                                <div className="w-full flex flex-col gap-1">
                                    <button
                                        onClick={() => {
                                            if (!item.is_rescheduled) {
                                                onReschedule(item);
                                                onClose();
                                            }
                                        }}
                                        disabled={item.is_rescheduled}
                                        className={`w-full py-2.5 text-xs font-bold rounded transition tracking-wide border ${
                                            item.is_rescheduled 
                                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none" 
                                                : "bg-[#f6ebd7]/60 text-[#8b5a2b] border-amber-200 hover:bg-[#ebd5c1]/60"
                                        }`}
                                    >
                                        RESCHEDULE JADWAL
                                    </button>
                                    {item.is_rescheduled && (
                                        <span className="text-[10px] text-red-500 font-medium text-center italic">
                                            *Sudah pernah dijadwalkan ulang
                                        </span>
                                    )}
                                </div>
                            )}

                            {item.status === 'SELESAI' && !item.is_reviewed && onRate && (
                                <button
                                    onClick={() => {
                                        onRate(item);
                                        onClose();
                                    }}
                                    className="w-full py-2.5 bg-[#8b5a2b] text-white text-xs font-bold rounded hover:bg-[#724a23] transition tracking-wide shadow-sm"
                                >
                                    BERI RATING
                                </button>
                            )}

                            <button
                                onClick={onClose}
                                className="w-full py-2.5 bg-[#1B3627] text-white text-xs font-bold rounded hover:bg-[#132A1D] transition tracking-wide"
                            >
                                TUTUP
                            </button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}