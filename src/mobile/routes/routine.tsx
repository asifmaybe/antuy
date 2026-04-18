import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { BottomNav } from "@/components/BottomNav";
import { RouteGuard } from "@/components/RouteGuard";
import { mockRoutine } from "@/lib/mock-data";
import { translateDay, translateSubject, translateTeacher } from "@/lib/routine-i18n";
import type { Language } from "@/lib/i18n";

export const Route = createFileRoute("/routine")({
  component: RoutinePage,
  head: () => ({
    meta: [
      { title: "Class Routine — EduPortal" },
      { name: "description", content: "Your weekly class routine" },
    ],
  }),
});

function RoutinePage() {
  const { t, lang } = useLanguage();

  return (
    <RouteGuard allowedRoles={["student", "cr"]}>
    <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-xl font-bold">{t("classRoutine")}</h1>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="px-4 space-y-5">
        {mockRoutine.map((day) => (
          <section key={day.day}>
            <h2 className="font-semibold text-sm text-muted-foreground mb-2">
              {translateDay(day.day, lang as Language)}
            </h2>
            <div className="space-y-2">
              {day.periods.map((period, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border bg-card p-3.5"
                >
                  <div className="text-xs font-medium text-muted-foreground w-16 shrink-0">
                    {period.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">
                      {translateSubject(period.subject, lang as Language)}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {translateTeacher(period.teacher, lang as Language)} · {period.hall}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </main>

      <BottomNav role="student" />
    </div>
    </RouteGuard>
  );
}
