import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface OrderSummaryProps {
  namaLapangan: string;
  dateParam: string;
  selectedTimesArray: string[];
  jumlahJam: number;
  lokasiLapangan: string;
  role: string;
  totalHarga: number;
  formatRupiah: (angka: number) => string;
  handleProses: () => void;
  isSubmitting: boolean;
  imageLapangan: string;
}

export default function OrderSummary({
  namaLapangan,
  dateParam,
  selectedTimesArray,
  jumlahJam,
  lokasiLapangan,
  role,
  totalHarga,
  formatRupiah,
  handleProses,
  isSubmitting,
  imageLapangan,
}: OrderSummaryProps) {
  return (
    <div className="lg:col-span-4 xl:col-span-4 mt-12 lg:mt-0">
      <div className="bg-[#1B3627] text-white rounded-2xl p-8 shadow-xl relative overflow-hidden flex flex-col mb-4">
        <svg
          className="absolute -top-10 -right-10 w-48 h-48 text-white opacity-5 pointer-events-none"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M12 2C6 2 2 8 2 14c0 4.5 4 8 10 8s10-3.5 10-8c0-6-4-12-10-12z" />
          <path d="M12 2v20" />
        </svg>

        <p className="text-[9px] font-bold text-[#8CB954] uppercase tracking-widest mb-6 relative z-10">
          RINGKASAN PESANAN
        </p>
        <h2 className="text-2xl font-black mb-6 leading-tight relative z-10">
          {namaLapangan}
        </h2>

        <div className="space-y-4 mb-8 relative z-10">
          <div className="flex items-center gap-3 text-gray-300">
            <Calendar className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-medium">{dateParam}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Clock className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-medium">
              {selectedTimesArray.join(", ") || "Belum dipilih"} ({jumlahJam}{" "}
              Jam)
            </span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-4 h-4 shrink-0" />
            <span className="text-[11px] font-medium">{lokasiLapangan}</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 space-y-3 mb-6 relative z-10">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Subtotal ({jumlahJam} Jam)</span>
            <span className="font-bold">
              {role === "mahasiswa" ? (
                <span className="text-[#8CB954]">GRATIS</span>
              ) : (
                `Rp ${formatRupiah(totalHarga)}`
              )}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400">Tax (11%)</span>
            <span className="font-bold">Included</span>
          </div>
        </div>

        <div className="flex justify-between items-end mb-8 relative z-10">
          <span className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-1">
            TOTAL PAYABLE
          </span>
          <span className="text-3xl font-black text-white">
            {role === "mahasiswa" ? "Rp 0" : `Rp ${formatRupiah(totalHarga)}`}
          </span>
        </div>

        <button
          onClick={handleProses}
          disabled={isSubmitting}
          className="w-full bg-[#8b5a2b] hover:bg-[#724a23] disabled:opacity-60 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#8b5a2b]/20 flex justify-center items-center gap-2 relative z-10"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
            </>
          ) : (
            <>
              {role === "mahasiswa" ? "Ajukan Verifikasi" : "Bayar Sekarang"}{" "}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* <p className="text-[7px] text-center text-gray-400 mt-4 tracking-widest uppercase flex items-center justify-center gap-1.5 relative z-10">
                    <ShieldCheck className="w-3 h-3" /> Secure 256-bit SSL Encrypted Data
                </p> */}
      </div>
    </div>
  );
}
