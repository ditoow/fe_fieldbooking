"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Building,
  FileText,
  HelpCircle,
  LogOut
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
  { name: 'Verifikasi User', href: '/admin-verifikasi-user', icon: Users },
  { name: 'Kelola Lapangan', href: '/admin-kelola-lapangan', icon: Building },
  { name: 'Laporan', href: '/admin-laporan', icon: FileText },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] bg-ugo-sidebar h-[calc(100vh-70px)] fixed left-0 top-[70px] flex flex-col justify-between py-6 px-4 z-20 overflow-y-auto">
      <div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-ugo-icon-bg text-white' 
                    : 'text-white/60 hover:text-white hover:bg-ugo-icon-bg/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-6 border-t border-white/10 mt-6">
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium text-sm">Help Center</span>
        </Link>
        <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </Link>
      </div>
    </aside>
  );
}
