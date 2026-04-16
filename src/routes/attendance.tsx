import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/hooks/use-language";
import { mockAttendance, mockStudent } from "@/lib/mock-data";

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
  const presentCount = mockAttendance.filter((a) => a.status === "present").length;

  const statusIcon = {
    present: { icon: CheckCircle2, className: "text-success", label: t("present") },
    absent: { icon: XCircle, className: "text-destructive", label: t("absent") },
    late: { icon: Clock, className: "text-warning", label: t("late") },
  };

  return (
    <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold">{t("attendance")}</h1>
        <p className="text-xs text-muted-foreground">{t("yourAttendanceHistory")}</p>
      </header>

      <main className="px-4 mt-2 space-y-4">
        <div className="rounded-xl border bg-card p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t("overallAttendance")}</p>
            <p className="text-2xl font-bold text-primary">{mockStudent.attendancePercent}%</p>
          </div>
          <div className="text-right text-xs text-muted-foreground">
            <p>{presentCount}/{mockAttendance.length} {t("daysPresent")}</p>
          </div>
        </div>

        <div className="space-y-2">
          {mockAttendance.map((record, i) => {
            const s = statusIcon[record.status];
            const Icon = s.icon;
            return (
              <div key={i} className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
                <span className="text-sm font-medium">{record.date}</span>
                <span className={`flex items-center gap-1.5 text-xs font-medium ${s.className}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav role="student" />
    </div>
  );
}
