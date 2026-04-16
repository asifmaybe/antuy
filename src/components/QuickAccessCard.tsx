import { type ReactNode } from "react";

interface QuickAccessCardProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export function QuickAccessCard({ icon, iconBg, title, subtitle, onClick }: QuickAccessCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 rounded-xl border bg-card p-4 text-left transition-shadow hover:shadow-md active:scale-[0.98]"
    >
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </button>
  );
}
