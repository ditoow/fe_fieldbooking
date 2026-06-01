import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

const logs = [
  { id: 1, type: "success", title: "Booking Dikonfirmasi", user: "Bagus Setiawan", time: "5m" },
  { id: 2, type: "warning", title: "Pembatalan", user: "Rara Anjani", time: "12m" },
  { id: 3, type: "info", title: "User Baru", user: "Siti Aminah", time: "1j" },
  { id: 4, type: "success", title: "Pembayaran Lunas", user: "Dodi", time: "2j" },
  { id: 5, type: "info", title: "Verifikasi Berkas", user: "Admin", time: "3j" },
];

export function ActivityLog() {
  return (
    <Card className="shadow-sm border-gray-100 border-none sm:border-solid h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-bold text-lg text-ugo-sidebar">Log Aktivitas</CardTitle>
        <CardDescription>Aktivitas terbaru sistem</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-col gap-4">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
              <div className="shrink-0 mt-0.5">
                {log.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {log.type === "warning" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                {log.type === "info" && <Info className="w-4 h-4 text-blue-500" />}
              </div>
              <div className="flex flex-col w-full">
                <span className="text-sm font-semibold text-gray-800">{log.title}</span>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500 truncate max-w-[80px] sm:max-w-[120px]">{log.user}</span>
                  <span className="text-[10px] text-gray-400 font-medium shrink-0">{log.time} lalu</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
