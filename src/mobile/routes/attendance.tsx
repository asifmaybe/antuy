import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { RouteGuard } from "@/components/RouteGuard";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { fetchAttendanceRecordsForStudent } from "@/lib/api";
import { formatShortDate } from "@/lib/date";

export const Route = createFileRoute("/attendance")({
  component: AttendancePage,
  head: () => ({
    meta: [
      { title: "Attendance — EduPortal" },
      { name: "description", content: "Your attendance records" },
    ],
  }),
});

function AttendancePage() {
  const { t, lang } = useLanguage();
  const { user } = useAuth();

  const { data: attendance = [], isLoading } = useQuery({
    queryKey: ["attendance", user?.id],
    queryFn: () => fetchAttendanceRecordsForStudent(user!.id),
    enabled: !!user?.id,
  });

  const presentCount = attendance.filter((a) => a.status === "present").length;
  const totalCount = attendance.length || 1;
  const attendancePercent = Math.round((presentCount / totalCount) * 100);

  const statusIcon = {
    present: { icon: CheckCircle2, className: "text-success", label: t("present") },
    absent: { icon: XCircle, className: "text-destructive", label: t("absent") },
    late: { icon: Clock, className: "text-warning", label: t("late") },
  };

  return (
    <RouteGuard allowedRoles={["student", "cr"]}>
    <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold">{t("attendance")}</h1>
        <p className="text-xs text-muted-foreground">{t("yourAttendanceHistory")}</p>
      </header>

      <main className="px-4 mt-2 space-y-4">
        <div className="rounded-xl border bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("overallAttendance")}</p>
            <p className="text-2xl font-bold text-primary">{attendancePercent}%</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{presentCount}/{attendance.length} {t("daysPresent")}</p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {attendance.map((record) => {
              const s = statusIcon[record.status];
              const Icon = s.icon;
              const dateStr = record.session
                ? formatShortDate(record.session.date)
                : formatShortDate(record.created_at);
              return (
                <div key={record.id} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                  <span className="text-sm font-medium">{dateStr}</span>
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${s.className}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <BottomNav role="student" />
    </div>
    </RouteGuard>
  );
}
