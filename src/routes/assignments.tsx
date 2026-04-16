import { createFileRoute } from "@tanstack/react-router";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/hooks/use-language";
import { mockAssignments } from "@/lib/mock-data";

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

  const statusConfig = {
    pending: { label: t("pending"), icon: Clock, className: "text-warning bg-warning/10" },
    submitted: { label: t("submitted"), icon: CheckCircle2, className: "text-success bg-success/10" },
    overdue: { label: t("overdue"), icon: AlertCircle, className: "text-destructive bg-destructive/10" },
  };

  return (
    <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold">{t("assignments")}</h1>
        <p className="text-xs text-muted-foreground">{t("yourTasksAndSubmissions")}</p>
      </header>

      <main className="px-4 space-y-3 mt-2">
        {mockAssignments.map((assignment) => {
          const status = statusConfig[assignment.status];
          const StatusIcon = status.icon;
          return (
            <div key={assignment.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{assignment.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{assignment.subject}</p>
                </div>
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </span>
              </div>
              <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                <span>{t("assigned")}: <strong className="text-foreground">{assignment.assignedDate}</strong></span>
                <span>{t("due")}: <strong className="text-foreground">{assignment.dueDate}</strong></span>
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav role="student" />
    </div>
  );
}
