import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import {
  LogOut,
  ClipboardList,
  CalendarClock,
  UserCheck,
  CalendarDays,
  ShieldAlert,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { NoticesBanner } from "@/components/NoticesBanner";
import { NextSessionCard } from "@/components/NextSessionCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NotificationToggle } from "@/components/NotificationToggle";
import { RouteGuard } from "@/components/RouteGuard";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotices,
  fetchAssignments,
  fetchExams,
  fetchAttendanceRecordsForStudent,
} from "@/lib/api";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [
      { title: "Dashboard — ET 23-24" },
      { name: "description", content: "Your academic dashboard" },
    ],
  }),
});

function DashboardPage() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { user, logout } = useAuth();

  const { data: notices = [], isLoading: isNoticesLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchNotices,
    enabled: !!user,
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: fetchAssignments,
    enabled: !!user,
  });

  const { data: exams = [] } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchExams,
    enabled: !!user,
  });

  const { data: attendance = [] } = useQuery({
    queryKey: ["attendance", user?.id],
    queryFn: () => fetchAttendanceRecordsForStudent(user!.id),
    enabled: !!user?.id,
  });

  const pendingCount = assignments.filter(
    (a) => a.status === "pending" || a.status === "active",
  ).length;
  const overdueCount = assignments.filter((a) => a.status === "overdue").length;
  const upcomingExams = exams.filter((e) => e.upcoming).length;
  const presentDays = attendance.filter((a) => a.status === "present").length;
  const totalDays = attendance.length || 1;
  const attendancePercent = Math.round((presentDays / totalDays) * 100);

  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // logout should never throw, but just in case
    }
    queryClient.clear();
    navigate({ to: "/" });
  };

  return (
    <RouteGuard allowedRoles={["student", "cr"]}>
      <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
        <header className="px-4 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{t("welcomeBack")}</p>
              <h1 className="text-xl font-bold">{user?.name ?? "Student"}</h1>
            </div>
            <div className="flex items-center gap-2">
              {user?.role === "cr" && (
                <button
                  onClick={() => navigate({ to: "/admin" })}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                  title={lang === "bn" ? "শিক্ষক প্যানেল" : "Teacher Panel"}
                >
                  <ShieldAlert className="h-4.5 w-4.5" />
                </button>
              )}
              <NotificationToggle />
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 space-y-6">
          <NoticesBanner notices={notices} isLoading={isNoticesLoading} />

          {/* Overview Section */}
          <section>
            <h2 className="font-semibold text-base mb-3">{t("overview")}</h2>
            <div className="space-y-3">
              {/* Pending Assignments */}
              <div
                className="flex items-center gap-4 rounded-xl border bg-card p-4 cursor-pointer transition-shadow hover:shadow-md active:scale-[0.98]"
                onClick={() => navigate({ to: "/assignments" })}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-sm">{t("pendingAssignments")}</h3>
                    <span className="text-lg font-bold text-primary">
                      {pendingCount + overdueCount}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pendingCount + overdueCount} {t("tasksAwaitingSubmission")}
                  </p>
                  {overdueCount > 0 && (
                    <span className="mt-1 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                      {overdueCount} {t("overdue")}
                    </span>
                  )}
                </div>
              </div>

              {/* Upcoming Exams */}
              <div
                className="flex items-center gap-4 rounded-xl border bg-card p-4 cursor-pointer transition-shadow hover:shadow-md active:scale-[0.98]"
                onClick={() => navigate({ to: "/exams" })}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <CalendarClock className="h-5 w-5 text-chart-2" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-sm">{t("upcomingExams")}</h3>
                    <span className="text-lg font-bold text-chart-2">{upcomingExams}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {upcomingExams} {t("scheduledThisMonth")}
                  </p>
                </div>
              </div>

              {/* Monthly Attendance */}
              <div
                className="flex items-center gap-4 rounded-xl border bg-card p-4 cursor-pointer transition-shadow hover:shadow-md active:scale-[0.98]"
                onClick={() => navigate({ to: "/attendance" })}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                  <UserCheck className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-sm">{t("monthlyAttendance")}</h3>
                    <span className="text-lg font-bold text-primary">{attendancePercent}%</span>
                  </div>
                  <Progress value={attendancePercent} className="mt-2 h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {presentDays}/{attendance.length} {t("daysPresent")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Next Session */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-base">{t("nextSession")}</h2>
              <Link
                to="/routine"
                className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
              >
                <CalendarDays className="h-3.5 w-3.5" />
                {t("viewClassRoutine")}
              </Link>
            </div>
            <NextSessionCard />
          </section>
        </main>

        <BottomNav role="student" />
      </div>
    </RouteGuard>
  );
}
