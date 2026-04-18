import { useState } from "react";
import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/hooks/use-language";
import { formatTime12Hour } from "@/lib/date";

interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  author: string;
  important: boolean;
}

export function NoticesBanner({
  notices,
  isLoading = false,
}: {
  notices: Notice[];
  isLoading?: boolean;
}) {
  const [current, setCurrent] = useState(0);
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("notices")}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
          <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!notices || notices.length === 0) return null;

  // Safe guard: if current is somehow out of bounds (e.g. data shrank), reset safely
  const activeIndex = current >= notices.length ? 0 : current;
  const notice = notices[activeIndex];

  if (!notice) return null;

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t("notices")}
          </span>
        </div>
        <Link to="/notices" className="text-xs font-medium text-primary hover:underline">
          {t("viewAll")}
        </Link>
      </div>
      <div>
        <div className="flex items-start gap-2">
          {notice.important && (
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-destructive" />
          )}
          <div>
            <h3 className="font-semibold text-sm">{notice.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{notice.description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-[11px] text-muted-foreground truncate mr-2">
            {notice.date} · {formatTime12Hour(notice.time)} · {notice.author}
          </p>
          <div className="flex gap-1.5 shrink-0">
            {notices.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === activeIndex ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
