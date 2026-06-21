"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/api/auth/logout';
import {
  LayoutDashboard,
  FileCheck,
  Users,
  Building,
  FileText,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  {
    name: 'Manajemen',
    icon: FileCheck,
    children: [
      { name: 'Booking', href: '/admin/manajemen/booking', icon: FileCheck },
      { name: 'User', href: '/admin/manajemen/user', icon: Users },
    ],
  },
  { name: 'Kelola Lapangan', href: '/admin/lapangan', icon: Building },
  { name: 'Laporan', href: '/admin-laporan', icon: FileText },
];

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean, onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [manajemenOpen, setManajemenOpen] = useState(
    pathname.startsWith('/admin/manajemen')
  );

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const renderNavItem = (item: typeof navItems[number]) => {
    if ('children' in item && item.children) {
      const isParentActive = pathname.startsWith('/admin/manajemen');
      return (
        <div key={item.name}>
          <Button
            variant="ghost"
            onClick={() => setManajemenOpen(!manajemenOpen)}
            className={`w-full justify-start gap-3 h-11 px-3 ${
              isParentActive
                ? 'bg-ugo-icon-bg text-white hover:bg-ugo-icon-bg/90 hover:text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className="font-medium text-sm flex-1 text-left">{item.name}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${manajemenOpen ? 'rotate-0' : '-rotate-90'}`} />
          </Button>
          {manajemenOpen && (
            <div className="ml-3 mt-1 flex flex-col gap-1">
              {item.children.map((child) => {
                const isChildActive = pathname === child.href;
                const ChildIcon = child.icon;
                return (
                  <Button
                    key={child.name}
                    variant="ghost"
                    asChild
                    className={`w-full justify-start gap-3 h-9 px-3 ${
                      isChildActive
                        ? 'bg-white/10 text-white hover:bg-white/15 hover:text-white'
                        : 'text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Link href={child.href} onClick={onClose}>
                      <ChildIcon className="w-5 h-5 shrink-0" />
                      <span className="font-medium text-sm">{child.name}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    const isActive = pathname === item.href;
    const Icon = item.icon!;

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
  };

  return (
    <aside className={`w-[220px] bg-ugo-sidebar h-[calc(100vh-70px)] fixed left-0 top-[70px] flex flex-col justify-between py-6 px-4 z-20 overflow-y-auto transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        <nav className="flex flex-col gap-2">
          {navItems.map(renderNavItem)}
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-6 border-t border-white/10 mt-6">
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 h-11 px-3 text-white/60 hover:text-white hover:bg-white/10">
          <LogOut className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm">Logout</span>
        </Button>
      </div>
    </aside>
  );
}
