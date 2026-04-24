import React from 'react';
import { UserPlus, Search, FileText, CheckCircle } from "lucide-react";

export default function Steps() {
  const steps = [
    { title: "REGISTER", desc: "Masuk menggunakan akun Udinus untuk memverifikasi status.", icon: <UserPlus className="w-6 h-6" /> },
    { title: "PILIH LAPANGAN", desc: "Pilih ketersediaan jadwal lapangan sesuai preferensi.", icon: <Search className="w-6 h-6" /> },
    { title: "ISI BIODATA", desc: "Lengkapi detail tim dan pastikan data penanggung jawab valid.", icon: <FileText className="w-6 h-6" /> },
    { title: "BERMAINLAH", desc: "Hadir di lapangan sesuai jadwal dan nikmati fasilitasnya.", icon: <CheckCircle className="w-6 h-6" /> },
  ];

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Alur Booking</p>
        <h2 className="text-3xl font-bold text-[#1B3627] mb-16">4 LANGKAH MUDAH MENUJU LAPANGAN</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-[1px] bg-gray-200 z-0"></div>
          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-[#1B3627] rounded-full flex items-center justify-center text-[#EAD0B3] mb-4 shadow-md">
                {step.icon}
              </div>
              <h4 className="font-bold text-[#1B3627] mb-2">{step.title}</h4>
              <p className="text-xs text-gray-500 px-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}