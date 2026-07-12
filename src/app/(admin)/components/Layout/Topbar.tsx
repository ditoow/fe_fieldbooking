"use client";

import { Bell, Leaf, Menu, Loader2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/auth/logout';
import { getNotifications, markAsRead, markAllAsRead, AppNotification } from '@/lib/api/notification';
import { useAuth } from '@/lib/context/AuthContext';

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoadingNotif, setIsLoadingNotif] = useState(true);
  const router = useRouter();
  const { user, logoutContext } = useAuth();

  useEffect(() => {
    fetchNotifs(false);

    // Polling setiap 5 detik (5000ms) (silent mode agar tidak kedap-kedip)
    const notifInterval = setInterval(() => fetchNotifs(true), 5000);

    return () => clearInterval(notifInterval);
  }, []);

  const fetchNotifs = async (isSilent = false) => {
    try {
      if (!isSilent) setIsLoadingNotif(true);
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      if (!isSilent) setIsLoadingNotif(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      fetchNotifs(true);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const handleLogout = async () => {
    await logoutContext();
    router.push('/login');
  };

  return (
    <header className="h-[70px] bg-ugo-sidebar w-full fixed top-0 left-0 z-30 flex items-center justify-between px-8 border-b-[3px] border-[#0EA5E9]">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group hover:opacity-80 transition w-fit">
          <img src="/logo.png?v=3" alt="Pivactive Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-xl tracking-wide text-white">Pivactive</span>
        </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 md:gap-6 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) fetchNotifs(true); }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
          >
            <Bell className="w-6 h-6 text-white/90" />
            {unreadCount > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-ugo-status-ditolak-text rounded-full"></span>}
          </button>

          {/* Simple Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden text-gray-800">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-lg">Notifikasi</h3>
                <div className="flex items-center gap-3">
                   <button onClick={() => { markAllAsRead().then(() => fetchNotifs(true)) }} className="text-xs text-ugo-primary hover:underline font-medium">Tandai semua dibaca</button>
                   <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">×</button>
                </div>
              </div>
              <div className="flex flex-col max-h-[400px] overflow-y-auto">
                {isLoadingNotif ? (
                  <div className="p-8 flex justify-center items-center">
                    <Loader2 className="w-6 h-6 text-ugo-primary animate-spin" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">Tidak ada notifikasi.</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => !n.read_at && handleMarkAsRead(n.id)}
                      className={`p-4 border-b border-gray-50 flex gap-3 ${!n.read_at ? 'bg-blue-50/30 cursor-pointer' : ''} hover:bg-gray-50 transition-colors`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === 'success' ? 'bg-ugo-status-disetujui-bg text-ugo-status-disetujui-text' : n.type === 'warning' ? 'bg-yellow-100 text-yellow-600' : n.type === 'error' ? 'bg-ugo-status-ditolak-bg text-ugo-status-ditolak-text' : 'bg-blue-100 text-blue-600'}`}>
                        {n.type === 'success' ? <Check className="w-5 h-5" /> : n.type === 'warning' ? <span className="font-bold">⚠️</span> : n.type === 'error' ? <span className="font-bold">❌</span> : <span className="font-bold">ℹ️</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold text-sm ${!n.read_at ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h4>
                        <p className={`text-sm mt-0.5 ${!n.read_at ? 'text-gray-700' : 'text-gray-500'}`}>{n.message}</p>
                        <span className="text-xs text-gray-400 mt-1 block">{n.time_ago}</span>
                      </div>
                      {!n.read_at && <div className="w-2 h-2 bg-ugo-primary rounded-full mt-1.5 shrink-0"></div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'Admin'}`}
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
                  <h4 className="font-bold">{user?.name || 'Admin User'}</h4>
                  <p className="text-xs text-gray-500">
                    {user?.roles?.[0]?.name ? user.roles[0].name.toUpperCase() : 'ADMINISTRATOR'}
                  </p>
                </div>
              </div>
              <hr className="my-2 border-gray-100" />
              <Link href="/admin/profile" onClick={() => setShowProfile(false)} className="block w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md">Pengaturan</Link>
              <button onClick={handleLogout} className="w-full text-left px-2 py-2 text-sm hover:bg-gray-50 rounded-md text-ugo-status-ditolak-text">Keluar</button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          className="md:hidden p-1 text-white hover:bg-white/10 rounded-md ml-1"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
