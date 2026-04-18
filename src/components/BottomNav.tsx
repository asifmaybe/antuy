import { Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, BookOpen, GraduationCap, Users, BarChart3, Bell } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import type { TranslationKey } from "@/lib/i18n";

const studentNavItems = [
  { to: "/dashboard", icon: LayoutGrid, labelKey: "home" as TranslationKey },
  { to: "/assignments", icon: BookOpen, labelKey: "tasks" as TranslationKey },
  { to: "/exams", icon: GraduationCap, labelKey: "exams" as TranslationKey },
  { to: "/attendance", icon: Users, labelKey: "attend" as TranslationKey },
  { to: "/results", icon: BarChart3, labelKey: "results" as TranslationKey },
] as const;

const adminNavItems = [
  { to: "/dashboard", icon: LayoutGrid, labelKey: "home" as TranslationKey },
  { to: "/assignments", icon: BookOpen, labelKey: "tasks" as TranslationKey },
  { to: "/exams", icon: GraduationCap, labelKey: "exams" as TranslationKey },
  { to: "/attendance", icon: Users, labelKey: "attend" as TranslationKey },
  { to: "/notices", icon: Bell, labelKey: "notices" as TranslationKey },
] as const;

export function BottomNav({ role = "student" }: { role?: "student" | "admin" }) {
  const location = useLocation();
  const { t } = useLanguage();
  const items = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card px-2 pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {items.map((item) => {
          const isActive =
            location.pathname === item.to || location.pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-0.5 py-2 px-3 text-xs transition-colors ${
                isActive ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
