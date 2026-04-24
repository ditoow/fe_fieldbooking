import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    /* Gunakan bg-[url('/nama-file-kamu.jpg')] 
       Pastikan nama filenya sama persis dengan yang ada di folder public 
    */
    <section className="relative w-full min-h-[600px] bg-[url('/lapangan.jpg')] bg-cover bg-center bg-no-repeat text-white overflow-hidden pb-16">
      
      {/* Overlay Gradient: Penting supaya teks putih tetap kontras dan mudah dibaca di atas foto */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B3627]/90 via-[#1B3627]/60 to-transparent z-0"></div>

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row items-center justify-between z-10">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Booking Lapangan <br /> Olahraga Kampus, <br />
            <span className="text-[#EAD0B3]">Lebih Mudah.</span>
          </h1>
          <p className="text-sm text-gray-300 max-w-md leading-relaxed">
            Fasilitas pemesanan lapangan olahraga eksklusif untuk 
            mahasiswa/i Udinus. Nikmati kemudahan booking dan 
            bermain tanpa repot dengan sistem kami.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/register" className="bg-[#EAD0B3] text-[#1B3627] font-semibold px-6 py-3 rounded text-sm hover:bg-[#d8bd9f] transition flex items-center justify-center">
              MULAI BOOKING
            </Link>
            <button className="border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded text-sm transition">
              LIHAT JADWAL
            </button>
          </div>
        </div>

        {/* Floating Card: Arena Futsal Pro */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-end">
          <div className="bg-white text-[#1B3627] p-4 rounded-lg shadow-2xl rotate-3 transform hover:rotate-0 transition duration-300 w-72">
            <img 
              src="/lapangan.jpg" 
              alt="Futsal Pro" 
              className="w-full h-40 object-cover rounded mb-4"
            />
            <div className="flex justify-between items-end">
              <div>
                <h3 className="font-bold text-lg text-[14px]">ARENA FUTSAL PRO</h3>
                <p className="text-[10px] text-gray-500">Kapasitas: 15 Org • Indoor</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-500">Mulai dari</p>
                <p className="font-bold text-[14px]">Rp 100k<span className="text-[10px] font-normal">/jam</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}