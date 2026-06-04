import React from "react";
import { Calendar, Clock } from "lucide-react";

export default function HistoryCard({
    item,
    formatRupiah,
    getDeadlineText,
    onDetail,
    onPayNow,
    onBookAgain
}: any) {
    return (
        <div className="bg-[#FDFBF5] rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-200/60 transition-all flex flex-col sm:flex-row h-auto sm:h-56">

            {/* Gambar & Badge */}
            <div className="w-full sm:w-[40%] h-48 sm:h-full relative shrink-0 bg-gray-100">
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover text-transparent"
                    onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518605368461-1e1e367803ba?q=80&w=600&auto=format&fit=crop';
                    }}
                />
                <div className="absolute inset-0 bg-black/5"></div>
                <span className={`absolute top-4 left-4 px-3 py-1.5 text-[10px] font-bold rounded shadow-sm tracking-wider uppercase
          ${item.status === 'SELESAI' ? 'bg-[#8CB954] text-white' : ''}
          ${item.status === 'DIBATALKAN' ? 'bg-red-500 text-white' : ''}
          ${item.status === 'TERTUNDA' ? 'bg-[#d4dfca] text-[#1B3627]' : ''}
        `}>
                    {item.status}
                </span>
            </div>

            {/* Konten & Informasi */}
            <div className="w-full sm:w-[60%] p-5 flex flex-col bg-[#FDFBF5]">
                <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="font-bold text-[#1B3627] text-[16px] leading-snug">{item.title}</h3>
                    <span className="font-bold text-[#8b5a2b] text-sm shrink-0">Rp {formatRupiah(item.price)}</span>
                </div>

                <div className="space-y-2 mb-4">
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" /> {item.date}
                    </p>
                    <p className="text-xs font-medium text-gray-500 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {item.time}
                    </p>
                    {item.status === 'TERTUNDA' && item.createdAt && (
                        <p className="text-[11px] font-bold text-[#c97a2e] flex items-center gap-2 pt-1">
                            <Clock className="w-3.5 h-3.5" /> {getDeadlineText(item.createdAt)}
                        </p>
                    )}
                    {item.note && item.status === 'DIBATALKAN' && (
                        <p className="text-[11px] font-semibold text-red-500 italic pt-1">
                            {item.note}
                        </p>
                    )}
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-3 mt-auto pt-2">
                    <button
                        onClick={() => onDetail(item)}
                        className="flex-1 py-2.5 text-xs font-bold text-[#1B3627] border border-gray-200 rounded hover:bg-gray-50 transition tracking-wide text-center"
                    >
                        DETAIL
                    </button>

                    {item.status === 'TERTUNDA' ? (
                        <button
                            onClick={() => onPayNow(item.price)}
                            className="flex-1 py-2.5 text-xs font-bold bg-black text-white rounded hover:bg-gray-800 transition shadow-md shadow-black/20 tracking-wide text-center"
                        >
                            BAYAR SEKARANG
                        </button>
                    ) : (
                        <button
                            onClick={() => onBookAgain(item.facilityId)}
                            className="flex-1 py-2.5 text-xs font-bold bg-[#8b5a2b] text-white rounded hover:bg-[#724a23] transition tracking-wide text-center"
                        >
                            PESAN LAGI
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}