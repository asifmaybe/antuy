import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { LogOut, ClipboardList, GraduationCap, Users, Bell, BarChart3, Clock, Activity, Loader2, LayoutDashboard } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { NoticesBanner } from "@/components/NoticesBanner";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAssignments, fetchExams, fetchAllResults, fetchAuditLog, fetchNotices } from "@/lib/api";
import { formatDateTime } from "@/lib/date";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — EduPortal" },
      { name: "description", content: "Admin panel for managing academic operations" },
    ],
  }),
});

function AdminDashboard() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { user, logout } = useAuth();

  const { data: notices = [], isLoading: isNoticesLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: fetchNotices,
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["assignments"],
    queryFn: fetchAssignments,
  });

  const { data: exams = [] } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchExams,
  });

  const { data: results = [] } = useQuery({
    queryKey: ["all-results"],
    queryFn: fetchAllResults,
  });

  const { data: auditLog = [], isLoading: auditLoading } = useQuery({
    queryKey: ["audit-log"],
    queryFn: fetchAuditLog,
  });

  const activeAssignments = assignments.filter(a => a.status === "active").length;
  const overdueAssignments = assignments.filter(a => a.status === "overdue").length;
  const upcomingExams = exams.filter(e => e.upcoming).length;
  const totalResults = results.length;

  const stats = [
    {
      label: lang === "bn" ? "সক্রিয় অ্যাসাইনমেন্ট" : "Active Assignments",
      value: activeAssignments,
      sub: overdueAssignments > 0 ? `${overdueAssignments} overdue` : undefined,
      icon: ClipboardList,
      color: "text-primary",
      bg: "bg-accent",
      to: "/admin/assignments",
    },
    {
      label: lang === "bn" ? "আসন্ন পরীক্ষা" : "Upcoming Exams",
      value: upcomingExams,
      icon: GraduationCap,
      color: "text-chart-2",
      bg: "bg-secondary",
      to: "/admin/exams",
    },
    {
      label: lang === "bn" ? "ফলাফল আপলোড" : "Results Uploaded",
      value: totalResults,
      icon: BarChart3,
      color: "text-chart-4",
      bg: "bg-accent",
      to: "/admin/results",
    },
  ];

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
    <>
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              {lang === "bn" ? "অ্যাডমিন প্যানেল" : "Admin Panel"}
            </p>
            <h1 className="text-xl font-bold">{user?.name || "Admin"}</h1>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role === "cr" ? (lang === "bn" ? "ক্লাস রিপ্রেজেন্টেটিভ" : "Class Representative") : user?.subject || (lang === "bn" ? "শিক্ষক" : "Teacher")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === "cr" && (
              <button
                onClick={() => navigate({ to: "/dashboard" })}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                title={lang === "bn" ? "স্টুডেন্ট ড্যাশবোর্ড" : "Student Dashboard"}
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
              </button>
            )}
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
        {/* Notices Banner (For Admin/Teacher only) */}
        {user?.role !== "cr" && (
          <NoticesBanner notices={notices} isLoading={isNoticesLoading} />
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="font-semibold text-base mb-3">
            {lang === "bn" ? "দ্রুত কাজ" : "Quick Actions"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/assignments"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">{lang === "bn" ? "অ্যাসাইনমেন্ট" : "Assignments"}</span>
            </Link>
            <Link
              to="/admin/exams"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <GraduationCap className="h-5 w-5 text-chart-2" />
              </div>
              <span className="text-sm font-medium">{lang === "bn" ? "পরীক্ষা" : "Exams"}</span>
            </Link>
            <Link
              to="/admin/attendance"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">{lang === "bn" ? "উপস্থিতি" : "Attendance"}</span>
            </Link>
            <Link
              to="/admin/notices"
              className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md active:scale-[0.98]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Bell className="h-5 w-5 text-chart-2" />
              </div>
              <span className="text-sm font-medium">{lang === "bn" ? "বিজ্ঞপ্তি" : "Notices"}</span>
            </Link>
          </div>
        </section>

        {/* Overview Stats */}
        <section>
          <h2 className="font-semibold text-base mb-3">
            {lang === "bn" ? "সারসংক্ষেপ" : "Overview"}
          </h2>
          <div className="space-y-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 cursor-pointer transition-shadow hover:shadow-md active:scale-[0.98]"
                onClick={() => navigate({ to: stat.to })}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-sm">{stat.label}</h3>
                    <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                  {stat.sub && (
                    <span className="mt-1 inline-block rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                      {stat.sub}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-base">
              {lang === "bn" ? "সাম্প্রতিক কার্যকলাপ" : "Recent Activity"}
            </h2>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          {auditLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {auditLog.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 rounded-xl border bg-card p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {log.performed_by} · {formatDateTime(log.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
