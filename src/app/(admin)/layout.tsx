import { Sidebar } from "@/components/Admin/Layout/Sidebar";
import { Topbar } from "@/components/Admin/Layout/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ugo-bg">
      <Topbar />
      <div className="flex pt-[70px]">
        <Sidebar />
        <main className="flex-1 ml-[220px] p-8 min-h-[calc(100vh-70px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
