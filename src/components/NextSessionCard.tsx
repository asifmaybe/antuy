import { Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { mockNextSession } from "@/lib/mock-data";

export function NextSessionCard() {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-primary p-5 text-primary-foreground">
      <p className="text-[10px] font-semibold tracking-widest uppercase opacity-70">
        {t("happeningSoon")}
      </p>
      <h3 className="mt-2 text-xl font-bold leading-tight">{mockNextSession.subject}</h3>
      <p className="text-base font-medium opacity-80">{mockNextSession.session}</p>

      <div className="mt-3 flex items-center gap-5 text-sm opacity-85">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {mockNextSession.time}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {mockNextSession.hall}
        </span>
      </div>

    </div>
  );
}
