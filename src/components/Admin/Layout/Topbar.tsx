"use client";

import { Bell, Box } from 'lucide-react';
import { useState } from 'react';

export function Topbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-[70px] bg-ugo-sidebar w-full fixed top-0 left-0 z-30 flex items-center justify-between px-8 border-b-[3px] border-[#0EA5E9]">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-ugo-primary rounded flex items-center justify-center">
          <Box className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg leading-tight">MyUGO Admin</h1>
          <p className="text-white/60 text-[10px] uppercase font-semibold tracking-wider">Facility Management</p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-6 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
          >
            <Bell className="w-6 h-6 text-white/90" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-ugo-status-ditolak-text rounded-full"></span>
          </button>

          {/* Simple Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden text-gray-800">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Notifikasi</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">×</button>
              </div>
              <div className="flex flex-col">
                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-ugo-status-disetujui-bg flex items-center justify-center shrink-0">
                    <span className="text-ugo-status-disetujui-text font-bold">👤</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Verifikasi User Baru</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Bagus Setiawan menunggu verifikasi.</p>
                    <span className="text-xs text-gray-400 mt-1 block">2m lalu</span>
                  </div>
                </div>
                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-ugo-status-ditolak-bg flex items-center justify-center shrink-0">
                    <span className="text-ugo-status-ditolak-text font-bold">⚠️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Peringatan Maintenance</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Lapangan Basket 2 ditutup.</p>
                    <span className="text-xs text-gray-400 mt-1 block">1j lalu</span>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-ugo-status-disetujui-bg flex items-center justify-center shrink-0">
                    <span className="text-ugo-status-disetujui-text font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Booking Dikonfirmasi</h4>
                    <p className="text-sm text-gray-600 mt-0.5">Siti Aminah telah membayar.</p>
                    <span className="text-xs text-gray-400 mt-1 block">3j lalu</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://api.dicebear.com/7.x/notionists/svg?seed=Julian" 
              alt="Avatar" 
              className="w-full h-full object-cover bg-gray-100"
            />
          </button>
          
          {/* Simple Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4 text-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">📝</span>
                </div>
                <div>
                  <h4 className="font-bold">Julian Rivers</h4>
                  <p className="text-xs text-gray-500">Master Administrator</p>
                </div>
              </div>
              <hr className="my-2 border-gray-100" />
              <button className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md">Settings</button>
              <button className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md text-ugo-status-ditolak-text">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
