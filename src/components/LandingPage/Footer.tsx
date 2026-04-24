import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#15291E] text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2">
          <h3 className="text-xl font-bold text-[#EAD0B3] mb-4 flex items-center">
            <span className="w-4 h-4 bg-[#EAD0B3] rounded-full mr-2"></span>
            MYUGO
          </h3>
          <p className="text-xs text-gray-400 max-w-sm mb-4 leading-relaxed">
            Platform Booking lapangan olahraga berbasis web yang berfokus pada kemudahan dan transparansi penyewaan lapangan di area Kampus Udinus.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Halaman</h4>
          <ul className="space-y-2 text-xs text-gray-400">
            <li><a href="#" className="hover:text-white transition">Beranda</a></li>
            <li><a href="#" className="hover:text-white transition">Daftar Lapangan</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Layanan</h4>
          <p className="text-xs text-gray-400">Penyewaan Futsal, Basket, & Voli</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 border-t border-white/10 pt-8 flex justify-between items-center text-xs text-gray-500">
        <p>© 2026 GOR Udinus Sport Center.</p>
      </div>
    </footer>
  );
}