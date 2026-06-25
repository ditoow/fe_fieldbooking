"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  User,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  Info,
  AlertTriangle,
  ChevronRight,
  CheckCheck,
} from "lucide-react";
import { logout } from "@/lib/api/auth";
import { useAuth } from "@/lib/context/AuthContext";
// IMPORT FETCHER API NOTIFIKASI
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  AppNotification,
} from "@/lib/api/notification";

interface UserSessionData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  nim?: string;
  roles: { id: number; name: string }[];
}

export default function NavbarUser() {
  const { user, logoutContext } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // STATE UNTUK NOTIFIKASI
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const desktopNotifRef = useRef<HTMLDivElement>(null);
  const mobileNotifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // FETCHING NOTIFIKASI
    const fetchNotifs = async () => {
      try {
        // Pastikan user sudah login sebelum fetch notifikasi
        if (localStorage.getItem("jwt_token")) {
          const data = await getNotifications();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Gagal mengambil notifikasi:", error);
      }
    };
    fetchNotifs();

    // Handle Click Outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        desktopNotifRef.current &&
        !desktopNotifRef.current.contains(event.target as Node) &&
        mobileNotifRef.current &&
        !mobileNotifRef.current.contains(event.target as Node)
      ) {
        setShowNotif(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: "Booking", href: "/dashboard" },
    { name: "Riwayat", href: "/riwayat" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      logoutContext();
      router.push("/login");
    }
  };

  // LOGIKA NOTIFIKASI
  const unreadCount = notifications.filter((n) => n.read_at === null).length;

  const handleNotificationClick = async (notif: AppNotification) => {
    // Optimistic update UI
    if (!notif.read_at) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notif.id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
      try {
        await markAsRead(notif.id);
      } catch (error) {
        console.error("Gagal menandai notifikasi:", error);
      }
    }

    // Redirect logic
    setShowNotif(false);
    const notifData = notif.data || (notif as any);
    if (notifData.booking_id) {
      if (notifData.type === "info") {
        router.push(`/invoice?booking_id=${notifData.booking_id}`);
      } else {
        router.push(`/riwayat`);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
    );
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Gagal menandai semua notifikasi:", error);
    }
  };

  const userRole = user?.roles?.[0]?.name || "Umum";

  // RENDER POPUP NOTIFIKASI
  const renderNotificationPopup = () => (
    <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200 z-50">
      <div className="p-4 bg-[#FDFBF5] border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-[#1B3627]">Notifikasi</h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-[10px] flex items-center gap-1 font-bold text-[#c29867] hover:underline uppercase"
          >
            <CheckCheck className="w-3 h-3" /> Tandai Dibaca
          </button>
        )}
      </div>

      <div className="max-h-96 overflow-y-auto text-[#1B3627]">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            Belum ada notifikasi
          </div>
        ) : (
          notifications.map((n) => {
            const isUnread = n.read_at === null;
            const notifData = n.data || (n as any);
            return (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition cursor-pointer ${isUnread ? "bg-[#FDFBF5]" : ""}`}
              >
                <div className="shrink-0 mt-1">
                  {notifData.type === "success" && (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  )}
                  {notifData.type === "info" && (
                    <Info className="w-4 h-4 text-blue-500" />
                  )}
                  {notifData.type === "warning" && (
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-xs ${isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}
                  >
                    {notifData.title}
                  </p>
                  <p
                    className={`text-[11px] leading-relaxed my-1 ${isUnread ? "text-gray-700" : "text-gray-500"}`}
                  >
                    {notifData.message}
                  </p>
                </div>
                {isUnread && (
                  <div className="shrink-0 mt-1.5 w-2 h-2 bg-red-500 rounded-full"></div>
                )}
              </div>
            );
          })
        )}
      </div>
      {notifications.length > 0 && (
        <button className="w-full py-3 text-[10px] font-bold text-gray-400 hover:text-[#1B3627] bg-gray-50 uppercase tracking-widest transition">
          Lihat Semua Notifikasi
        </button>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 bg-[#1B3627] text-white shadow-md font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-1 flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition shrink-0"
            >
              <Leaf className="w-5 h-5 text-[#8CB954]" />
              <span className="font-bold text-lg tracking-wide">MyUGO</span>
            </Link>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all hover:text-[#E5C3A6] ${pathname === link.href ? "text-[#E5C3A6] border-b-2 border-[#E5C3A6] pb-1" : "text-gray-300"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Icons - Desktop */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">
            {!user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-[#EAD0B3] text-[#1B3627] font-bold px-5 py-2 rounded-lg text-sm hover:bg-[#d8bd9f] transition shadow-md"
                >
                  Daftar Sekarang
                </Link>
              </div>
            ) : (
              <>
                {/* Bell Icon Desktop */}
                <div className="relative" ref={desktopNotifRef}>
                  <button
                    onClick={() => {
                      setShowNotif(!showNotif);
                      setShowProfile(false);
                    }}
                    className={`relative p-2 rounded-full transition-colors ${showNotif ? "bg-white/10 text-[#E5C3A6]" : "text-gray-300 hover:text-white"}`}
                  >
                    <Bell className="w-5 h-5" />
                    {/* UNREAD BADGE DINAMIS */}
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-[#1B3627]">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotif && renderNotificationPopup()}
                </div>

                {/* Profile Circle Desktop (Kode aslimu tetap sama) */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => {
                      setShowProfile(!showProfile);
                      setShowNotif(false);
                    }}
                    className="flex items-center gap-3 pl-4 border-l border-white/10 group"
                  >
                    <p className="text-xs font-bold uppercase tracking-tighter group-hover:text-[#E5C3A6] transition">
                      {user?.name || "User MyUGO"}
                    </p>
                    <div
                      className={`w-8 h-8 rounded-full bg-[#E5C3A6] flex items-center justify-center text-[#1B3627] font-bold border-2 transition-all ${showProfile ? "border-white" : "border-[#1B3627]"}`}
                    >
                      <User className="w-5 h-5" />
                    </div>
                  </button>

                  {showProfile && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200 text-[#1B3627] z-50">
                      <div className="p-5 bg-[#FDFBF5] border-b border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Akun Saya
                        </p>
                        <p className="font-bold text-sm truncate">
                          {user?.name || "User MyUGO"}
                        </p>
                        <p className="text-[10px] text-[#8CB954] font-bold uppercase">
                          {userRole}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-400 group-hover:text-[#1B3627]" />
                            <span className="text-xs font-semibold">
                              Profil Saya
                            </span>
                          </div>
                          <ChevronRight className="w-3 h-3 text-gray-300" />
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition group"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-xs font-bold">Keluar Akun</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Notif */}
          <div className="md:hidden flex items-center gap-1">
            {user && (
              <div className="relative" ref={mobileNotifRef}>
                <button
                  onClick={() => {
                    setShowNotif(!showNotif);
                    setIsMenuOpen(false);
                  }}
                  className={`relative p-2 rounded-full transition-colors ${showNotif ? "bg-white/10 text-[#E5C3A6]" : "text-gray-300"}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-[#1B3627]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                {showNotif && renderNotificationPopup()}
              </div>
            )}

            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                setShowNotif(false);
              }}
              className="p-2 text-gray-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Kode aslimu tetap sama) */}
      {isMenuOpen && (
        /* ... [Bagian Mobile Menu tidak ada yang berubah] ... */
        <div className="md:hidden absolute top-16 left-0 w-full bg-[#132A1D] border-t border-white/5 px-4 py-6 shadow-2xl z-40">
          <div className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block text-sm font-medium ${pathname === link.href ? "text-[#E5C3A6]" : "text-gray-300"}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Profil Mobile */}
          {!user ? (
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-4">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-white text-center w-full py-2 bg-white/10 rounded-lg"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#1B3627] text-center w-full py-2 bg-[#EAD0B3] rounded-lg shadow-md"
              >
                Daftar Sekarang
              </Link>
            </div>
          ) : (
            <div className="pt-6 mt-6 border-t border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#E5C3A6] flex items-center justify-center text-[#1B3627]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-white">
                    {user?.name || "User MyUGO"}
                  </p>
                  <p className="text-[10px] text-[#8CB954] font-bold uppercase tracking-wider">
                    {userRole}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-5 pl-2">
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-3"
                >
                  <User className="w-4 h-4" /> Profil Saya
                </Link>
                <Link
                  href="/user/settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-medium text-gray-300 hover:text-white flex items-center gap-3"
                >
                  <Settings className="w-4 h-4" /> Pengaturan
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-bold text-red-400 hover:text-red-300 flex items-center gap-3 text-left w-full"
                >
                  <LogOut className="w-4 h-4" /> Keluar Akun
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
