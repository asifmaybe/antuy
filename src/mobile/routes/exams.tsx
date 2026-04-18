import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { RouteGuard } from "@/components/RouteGuard";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { fetchExams } from "@/lib/api";
import { formatShortDate } from "@/lib/date";

export const Route = createFileRoute("/exams")({
  component: ExamsPage,
  head: () => ({
    meta: [
      { title: "Exams — EduPortal" },
      { name: "description", content: "Upcoming and past exams" },
    ],
  }),
});

function ExamsPage() {
  const { t, lang } = useLanguage();

  const { data: exams = [], isLoading } = useQuery({
    queryKey: ["exams"],
    queryFn: fetchExams,
  });

  const upcoming = exams.filter((e) => e.upcoming);
  const past = exams.filter((e) => !e.upcoming);

  const formatDate = formatShortDate;

  return (
    <RouteGuard allowedRoles={["student", "cr"]}>
      <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
        <header className="px-4 pt-6 pb-2">
          <h1 className="text-xl font-bold">{t("examsAndQuizzes")}</h1>
          <p className="text-xs text-muted-foreground">{t("yourExamSchedule")}</p>
        </header>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <main className="px-4 mt-2 space-y-6">
            {upcoming.length > 0 && (
              <section>
                <h2 className="font-semibold text-sm text-primary mb-3">{t("upcoming")}</h2>
                <div className="space-y-3">
                  {upcoming.map((exam) => (
                    <div key={exam.id} className="rounded-xl border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{exam.subject}</h3>
                        <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                          {exam.type}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {t("date")}:{" "}
                          <strong className="text-foreground">{formatDate(exam.date)}</strong>
                        </span>
                        <span>
                          {t("marks")}: <strong className="text-foreground">{exam.marks}</strong>
                        </span>
                      </div>
                      {exam.instructions && (
                        <p className="text-xs text-muted-foreground mt-2 italic">
                          {exam.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="font-semibold text-sm text-muted-foreground mb-3">{t("past")}</h2>
                <div className="space-y-3">
                  {past.map((exam) => (
                    <div key={exam.id} className="rounded-xl border bg-card p-4 opacity-70">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm">{exam.subject}</h3>
                        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {exam.type}
                        </span>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>
                          {t("date")}: {formatDate(exam.date)}
                        </span>
                        <span>
                          {t("marks")}: {exam.marks}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        )}

        <BottomNav role="student" />
      </div>
    </RouteGuard>
  );
}
