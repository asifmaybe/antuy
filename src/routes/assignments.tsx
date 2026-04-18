import { createFileRoute } from "@tanstack/react-router";
import { Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { RouteGuard } from "@/components/RouteGuard";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { fetchAssignments } from "@/lib/api";
import { formatShortDate } from "@/lib/date";

export const Route = createFileRoute("/assignments")({
  component: AssignmentsPage,
  head: () => ({
    meta: [
      { title: "Assignments — EduPortal" },
      { name: "description", content: "View your assignments and submissions" },
    ],
  }),
});

function AssignmentsPage() {
  const { t, lang } = useLanguage();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: fetchAssignments,
  });

  const statusConfig = {
    pending: { label: t("pending"), icon: Clock, className: "text-warning bg-warning/10" },
    active: { label: t("pending"), icon: Clock, className: "text-warning bg-warning/10" },
    submitted: {
      label: t("submitted"),
      icon: CheckCircle2,
      className: "text-success bg-success/10",
    },
    overdue: {
      label: t("overdue"),
      icon: AlertCircle,
      className: "text-destructive bg-destructive/10",
    },
    completed: {
      label: t("submitted"),
      icon: CheckCircle2,
      className: "text-success bg-success/10",
    },
  };

  return (
    <RouteGuard allowedRoles={["student", "cr"]}>
      <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
        <header className="px-4 pt-6 pb-2">
          <h1 className="text-xl font-bold">{t("assignments")}</h1>
          <p className="text-xs text-muted-foreground">{t("yourTasksAndSubmissions")}</p>
        </header>

        <main className="px-4 space-y-3 mt-2">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No assignments yet
            </div>
          ) : (
            assignments.map((assignment) => {
              const status = statusConfig[assignment.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              const assignedDate = formatShortDate(assignment.assigned_date);
              const dueDate = formatShortDate(assignment.due_date);
              return (
                <div key={assignment.id} className="rounded-xl border bg-card p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{assignment.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{assignment.subject}</p>
                    </div>
                    <span
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>
                      {t("assigned")}: <strong className="text-foreground">{assignedDate}</strong>
                    </span>
                    <span>
                      {t("due")}: <strong className="text-foreground">{dueDate}</strong>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </main>

        <BottomNav role="student" />
      </div>
    </RouteGuard>
  );
}
