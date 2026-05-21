"use client";

import { useState } from "react";
import { Camera, Moon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function ProfileSettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 fade-in animate-in pb-10">
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
                src="https://api.dicebear.com/7.x/notionists/svg?seed=Julian" 
                alt="Julian Rivers" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center border border-gray-100 text-gray-600 hover:text-ugo-primary transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-ugo-sidebar">Julian Rivers</h2>
            <p className="text-gray-500 text-sm mt-1">Master Administrator &bull; Since Jan 2021</p>
          </div>
        </div>

        {/* Account Profile Section */}
        <div className="mb-10">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Account Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-ugo-sidebar mb-2">Full Name</label>
              <Input type="text" defaultValue="Julian Rivers" className="bg-gray-50 border-gray-200" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ugo-sidebar mb-2">Email Address</label>
              <Input type="email" defaultValue="julian.rivers@university.edu" className="bg-gray-50 border-gray-200" />
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

        {/* Preferences Section */}
        <div className="mb-10">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Preferences</h3>
          <div className="flex flex-col gap-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-100 rounded-xl gap-4 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-ugo-sidebar">Interface Theme (Dark Mode)</p>
                  <p className="text-xs text-gray-500">Tampilkan antarmuka gelap (segera hadir)</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-100 rounded-xl gap-4 sm:gap-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-ugo-sidebar">Browser Push Notifications</p>
                  <p className="text-xs text-gray-500">Dapatkan notifikasi langsung di browser</p>
                </div>
              </div>
              <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
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
