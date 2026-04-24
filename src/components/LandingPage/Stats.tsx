import React from 'react';

export default function Stats() {
  const stats = [
    { label: "Booking Berhasil", value: "500+" },
    { label: "Pilihan Lapangan", value: "3" },
    { label: "Mahasiswa Aktif", value: "1.2K" },
    { label: "Tingkat Kepuasan", value: "98%" },
  ];

  return (
    <div className="bg-[#1B3627] relative z-10 border-t border-white/20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index}>
              <h4 className="text-3xl font-bold text-[#EAD0B3]">{stat.value}</h4>
              <p className="text-xs text-gray-300 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}