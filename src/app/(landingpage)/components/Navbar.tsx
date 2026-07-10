"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans text-white ${isScrolled ? 'bg-[#1B3627] shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition shrink-0">
              <img src="/logo.png?v=2" alt="Pivactive Logo" width={120} height={40} className="object-contain" />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-[#EAD0B3] transition-colors">
              Sewa Lapangan
            </Link>
            <Link href="/riwayat" className="text-sm font-medium text-gray-300 hover:text-[#EAD0B3] transition-colors">
              Riwayat Lapangan
            </Link>
          </div>

          {/* Action Buttons - Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                  Masuk
                </Link>
                <Link href="/register" className="bg-[#EAD0B3] text-[#1B3627] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d8bd9f] transition shadow-md">
                  Daftar Sekarang
                </Link>
              </>
            ) : (
              <Link href="/dashboard" className="bg-[#EAD0B3] text-[#1B3627] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d8bd9f] transition shadow-md">
                Ke Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 w-full bg-[#132A1D] border-t border-white/5 px-4 py-6 shadow-2xl z-40">
          <div className="space-y-4">
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-[#EAD0B3]">Sewa Lapangan</Link>
            <Link href="/riwayat" onClick={() => setIsMenuOpen(false)} className="block text-sm font-medium text-gray-300 hover:text-[#EAD0B3]">Riwayat Lapangan</Link>
          </div>
          
          {!user ? (
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-4">
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-white text-center w-full py-2 bg-white/10 rounded-lg">
                Masuk
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-[#1B3627] text-center w-full py-2 bg-[#EAD0B3] rounded-lg shadow-md">
                Daftar Sekarang
              </Link>
            </div>
          ) : (
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-4">
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-[#1B3627] text-center w-full py-2 bg-[#EAD0B3] rounded-lg shadow-md">
                Ke Dashboard
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
