"use client";

import { useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionStr = localStorage.getItem("user_session");
      if (sessionStr) {
        setUser(JSON.parse(sessionStr));
      }
    } catch (e) {
      console.error("Gagal membaca profil dari sesi", e);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-ugo-sidebar" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 fade-in animate-in pb-10">
      <div>
        <h1 className="text-[30px] font-bold text-ugo-sidebar leading-tight mb-2">Profile & Settings</h1>
        <p className="text-gray-500 text-sm">
          Kelola informasi profil Anda dan atur preferensi sistem sesuai kebutuhan Anda.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Header Profile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name || 'Admin'}`} 
                alt={user?.name || "Admin"} 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 text-gray-600 hover:text-ugo-primary transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-ugo-sidebar">{user?.name || 'Administrator'}</h2>
            <p className="text-gray-500 text-sm mt-1">{user?.role?.toUpperCase() || 'ADMINISTRATOR'}</p>
          </div>
        </div>

        {/* Account Profile Section */}
        <div className="mb-10">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ugo-sidebar mb-2">Full Name</label>
              <Input type="text" defaultValue={user?.name || ''} className="bg-gray-50 border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ugo-sidebar mb-2">Email Address</label>
              <Input type="email" defaultValue={user?.email || ''} readOnly className="bg-gray-100 border-gray-200 cursor-not-allowed" />
            </div>
          </div>
        </div>

        {/* Security & Access Section */}
        <div className="mb-10">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Security & Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ugo-sidebar mb-2">Update Password</label>
              <Input type="password" placeholder="Enter new password" className="bg-gray-50 border-gray-200" />
            </div>
          </div>
        </div>



        <hr className="border-gray-100 my-8" />

        <div className="flex items-center gap-4">
          <Button className="bg-[#1C2B1E] hover:bg-[#152016] text-white px-8">Save Changes</Button>
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700">Discard</Button>
        </div>

      </div>
    </div>
  );
}
