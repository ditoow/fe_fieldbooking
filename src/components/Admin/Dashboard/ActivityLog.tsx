import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Info, Loader2 } from "lucide-react";

export interface ActivityLogItem {
  id: number;
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  user_name: string;
  created_at: string;
  updated_at: string;
}

interface ActivityLogProps {
  data: ActivityLogItem[];
  loading: boolean;
}

const formatTime = (createdAtStr: string) => {
  try {
    const diffMs = new Date().getTime() - new Date(createdAtStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}j`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}h`;
  } catch (e) {
    return "";
  }
};

export function ActivityLog({ data, loading }: ActivityLogProps) {
  return (
    <Card className="shadow-sm border-gray-100 border-none sm:border-solid h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-bold text-lg text-ugo-sidebar">Log Aktivitas</CardTitle>
        <CardDescription>Aktivitas terbaru sistem</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-start">
        {loading ? (
          <div className="flex-1 flex justify-center items-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-ugo-sidebar" />
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {data.length > 0 ? (
              data.map((log) => (
                <div key={log.id} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div className="shrink-0 mt-0.5">
                    {log.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {log.type === "warning" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                    {log.type === "info" && <Info className="w-4 h-4 text-blue-500" />}
                    {log.type === "danger" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  </div>
                  <div className="flex flex-col w-full">
                    <span className="text-sm font-semibold text-gray-800">{log.title}</span>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{log.description}</p>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate max-w-[80px] sm:max-w-[120px]">{log.user_name}</span>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">{formatTime(log.created_at)} lalu</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-500 py-4 text-center">Tidak ada log aktivitas hari ini.</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
