import React from 'react';
import { ArrowRight } from "lucide-react";

export default function Exploration() {
  const courts = [
    { name: "ARENA FUTSAL PRO", type: "Indoor • Lantai Vinyl", tag: "Tersedia", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600" },
    { name: "BASKET OUTDOOR", type: "Outdoor • Lantai Plester", tag: "Tersedia", img: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=600" },
    { name: "GELANGGANG VOLI", type: "Indoor • Lantai Sintetis", tag: "Banyak Dipesan", img: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Fasilitas Udinus</p>
          <h2 className="text-3xl font-bold text-[#1B3627]">EKSPLORASI LAPANGAN</h2>
        </div>
        <a href="#" className="text-sm font-semibold text-[#1B3627] flex items-center hover:underline">
          LIHAT SEMUA LAPANGAN <ArrowRight className="w-4 h-4 ml-1" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courts.map((court, index) => (
          <div key={index} className="relative group overflow-hidden rounded bg-[#1B3627] text-white aspect-[4/5] shadow-lg">
            <img src={court.img} alt={court.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B3627] via-transparent to-transparent opacity-90"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase mb-3 inline-block ${court.tag === "Tersedia" ? "bg-[#EAD0B3] text-[#1B3627]" : "border border-[#EAD0B3] text-[#EAD0B3]"}`}>
                {court.tag}
              </span>
              <h3 className="text-xl font-bold mb-1">{court.name}</h3>
              <p className="text-xs text-gray-300 mb-4">{court.type}</p>
              <a href="#" className="text-sm font-semibold flex items-center hover:text-[#EAD0B3] transition">
                LIHAT JADWAL <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}