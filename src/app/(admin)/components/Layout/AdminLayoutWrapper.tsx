"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ugo-bg flex flex-col">
      <Topbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex flex-1 pt-[70px]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 w-full md:ml-[220px] p-4 sm:p-8 min-h-[calc(100vh-70px)] overflow-x-hidden">
          {children}
        </main>
      </div>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden top-[70px]" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
