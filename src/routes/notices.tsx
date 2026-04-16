import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, User } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/hooks/use-language";
import { mockNotices } from "@/lib/mock-data";

export const Route = createFileRoute("/notices")({
  component: NoticesPage,
  head: () => ({
    meta: [
      { title: "Notices — EduPortal" },
      { name: "description", content: "Announcements and notices" },
    ],
  }),
});

function NoticesPage() {
  const { t, lang } = useLanguage();

  return (
    <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
      <header className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{t("notices")}</h1>
            <p className="text-xs text-muted-foreground">{t("announcements")}</p>
          </div>
        </div>
      </header>

      <main className="px-4 mt-4 space-y-3">
        {mockNotices.map((notice) => (
          <div
            key={notice.id}
            className={`rounded-xl border bg-card p-4 ${notice.important ? "border-primary/30" : ""}`}
          >
            <div className="flex items-start gap-2">
              {notice.important && (
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-destructive" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{notice.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{notice.description}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2.5">
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {notice.date} · {notice.time}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <User className="h-3 w-3" />
                    {notice.author}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>

      <BottomNav role="student" />
    </div>
  );
}
