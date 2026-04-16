import { Languages } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export function LanguageSwitcher() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent active:scale-95"
      aria-label="Switch language"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{lang === "en" ? "বাং" : "EN"}</span>
    </button>
  );
}
