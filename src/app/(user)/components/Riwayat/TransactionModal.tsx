import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
// Import interface HistoryItem yang sudah kamu definisikan di halaman riwayat
import { HistoryItem } from "@/app/(user)/riwayat/page";

// Menambahkan prop onCancel ke dalam interface
interface TransactionModalProps {
    item: HistoryItem | null;
    onClose: () => void;
    formatRupiah: (angka: number) => string;
    onCancel?: (id: any) => void;
}

export default function TransactionModal({
    item,
    onClose,
    formatRupiah,
    onCancel // Menerima prop onCancel
}: TransactionModalProps) {
    return (
        <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#FDFBF5] border-gray-200 p-0 overflow-hidden sm:max-w-sm [&>button]:text-white [&>button]:top-5 [&>button]:right-5">

                <DialogHeader className="bg-[#1B3627] text-white p-6 text-center m-0">
                    <DialogTitle className="text-base font-bold tracking-wide text-center">
                        Detail Transaksi
                    </DialogTitle>
                    {/* ID Pesanan dihapus dari sini */}
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
                                <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded ${item.status === 'SELESAI' ? 'bg-green-100 text-green-700' : item.status === 'DIBATALKAN' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
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
                                        onClose(); // Opsional: otomatis menutup modal saat klik batalkan
                                    }}
                                    className="w-full py-2.5 bg-red-50 text-red-600 border border-red-200 text-xs font-bold rounded hover:bg-red-100 transition tracking-wide"
                                >
                                    BATALKAN
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