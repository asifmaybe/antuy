import { createFileRoute } from "@tanstack/react-router";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/hooks/use-language";
import { mockResults } from "@/lib/mock-data";

export const Route = createFileRoute("/results")({
  component: ResultsPage,
  head: () => ({
    meta: [
      { title: "Results — EduPortal" },
      { name: "description", content: "Your academic results" },
    ],
  }),
});

function ResultsPage() {
  const { t, lang } = useLanguage();

  return (
    <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold">{t("results")}</h1>
        <p className="text-xs text-muted-foreground">{t("yourMarksAndGrades")}</p>
      </header>

      <main className="px-4 mt-2 space-y-3">
        {mockResults.map((result) => {
          const percentage = Math.round((result.marks / result.total) * 100);
          return (
            <div key={result.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm">{result.subject}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.type} · {result.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary">{result.marks}<span className="text-xs font-normal text-muted-foreground">/{result.total}</span></p>
                  <p className="text-xs text-muted-foreground">{percentage}%</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
              </div>
            </div>
          );
        })}
      </main>

      <BottomNav role="student" />
    </div>
  );
}
