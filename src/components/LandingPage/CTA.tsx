import React from 'react';
import Link from 'next/link'; // 1. Tambahkan import ini
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="bg-[#1B3627] rounded-xl p-12 text-center text-white shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">SIAP UNTUK BERKERINGAT <br/> HARI INI?</h2>
        <p className="text-gray-300 text-sm mb-8 max-w-lg mx-auto">
          Arahkan potensi tim basket, futsal, atau voli dengan reservasi jadwal lapangan dalam genggaman.
        </p>
        
        {/* 2. Ganti <button> menjadi <Link href="/register"> */}
        <Link href="/register" className="bg-[#EAD0B3] text-[#1B3627] font-semibold px-8 py-4 rounded w-fit text-sm hover:bg-[#d8bd9f] transition flex items-center mx-auto">
          MULAI BOOKING LAPANGAN <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </section>
  );
}