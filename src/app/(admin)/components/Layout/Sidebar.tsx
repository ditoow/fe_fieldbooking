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
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/admin-dashboard', icon: LayoutDashboard },
  { name: 'Verifikasi User', href: '/admin-verifikasi-user', icon: Users },
  { name: 'Kelola Lapangan', href: '/admin-kelola-lapangan', icon: Building },
  { name: 'Laporan', href: '/admin-laporan', icon: FileText },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <aside className={`w-[220px] bg-ugo-sidebar h-[calc(100vh-70px)] fixed left-0 top-[70px] flex flex-col justify-between py-6 px-4 z-20 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className={`w-full justify-start gap-3 h-11 px-3 ${
                  isActive 
                    ? 'bg-ugo-icon-bg text-white hover:bg-ugo-icon-bg/90 hover:text-white' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Link href={item.href} onClick={onClose}>
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-6 border-t border-white/10 mt-6">
        <Button variant="ghost" asChild className="w-full justify-start gap-3 h-11 px-3 text-white/60 hover:text-white hover:bg-white/10">
          <Link href="#">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">Help Center</span>
          </Link>
        </Button>
        <Button variant="ghost" asChild className="w-full justify-start gap-3 h-11 px-3 text-white/60 hover:text-white hover:bg-white/10">
          <Link href="#">
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm">Logout</span>
          </Link>
        </Button>
      </div>
    </aside>
  );
}
