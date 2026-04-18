import { createFileRoute, Outlet, Link, useLocation } from "@tanstack/react-router";
import { LayoutGrid, ClipboardList, GraduationCap, Users, Bell, BarChart3 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { RouteGuard } from "@/components/RouteGuard";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const adminNavItems = [
  { to: "/admin", icon: LayoutGrid, label: "Dashboard", labelBn: "ড্যাশবোর্ড", exact: true },
  { to: "/admin/assignments", icon: ClipboardList, label: "Assign", labelBn: "কাজ" },
  { to: "/admin/exams", icon: GraduationCap, label: "Exams", labelBn: "পরীক্ষা" },
  { to: "/admin/attendance", icon: Users, label: "Attend.", labelBn: "উপস্থিতি" },
  { to: "/admin/results", icon: BarChart3, label: "Results", labelBn: "ফলাফল" },
];

function AdminLayout() {
  const location = useLocation();
  const { lang } = useLanguage();

  return (
    <RouteGuard allowedRoles={["teacher", "cr"]}>
      <div className={`min-h-screen pb-20 ${lang === "bn" ? "font-bengali" : ""}`}>
        <Outlet />
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card px-2 pb-[env(safe-area-inset-bottom)]">
          <div className="mx-auto flex max-w-lg items-center justify-around">
            {adminNavItems.map((item) => {
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname === item.to || location.pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex flex-col items-center gap-0.5 py-2 px-3 text-xs transition-colors ${
                    isActive ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                  <span>{lang === "bn" ? item.labelBn : item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </RouteGuard>
  );
}
