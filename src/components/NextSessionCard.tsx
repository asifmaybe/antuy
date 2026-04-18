import { Clock, MapPin, Calendar } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { TranslationKey, type Language } from "@/lib/i18n";
import { mockRoutine } from "@/lib/mock-data";
import { translateDay, translateSubject, translateTeacher } from "@/lib/routine-i18n";
import { nowBST } from "@/lib/date";
import { useState, useEffect, useMemo } from "react";

// ── Types ──────────────────────────────────────────────
interface Period {
  time: string;
  subject: string;
  teacher: string;
  hall: string;
}

interface DaySchedule {
  day: string;
  periods: Period[];
}

type SessionStatus =
  | "happening_now"
  | "happening_soon"
  | "next_class"
  | "tomorrow"
  | "next_sunday"
  | "no_classes";

interface SessionInfo {
  status: SessionStatus;
  period: Period | null;
  day: string;
  startTime: string;
  endTime: string;
}

// ── Helper: parse "8:00" or "1:15" from a time slot like "8:00–8:45" ──
function parseTimeSlot(slot: string): { start: Date; end: Date } {
  const now = nowBST();
  // Handle various dash types: –, -, —
  const parts = slot.split(/[–\-—]/);
  if (parts.length !== 2) return { start: now, end: now };

  const parseTime = (t: string): Date => {
    const trimmed = t.trim();
    const [hStr, mStr] = trimmed.split(":");
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    // Assume times are in 12h college format:
    // 1:00–5:00 => PM (afternoon classes)
    // 8:00–12:30 => AM (morning classes)
    // Heuristic: if hour < 6, it's PM
    if (h < 6) h += 12;
    const d = new Date(now);
    d.setHours(h, m, 0, 0);
    return d;
  };

  return { start: parseTime(parts[0]), end: parseTime(parts[1]) };
}

// ── Day helpers ────────────────────────────────────────
const DAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKEND_DAYS = ["Friday", "Saturday"];

function getDayName(date: Date): string {
  return DAY_ORDER[date.getDay()];
}

// ── Core logic: determine the next session ────────────
function computeNextSession(routine: DaySchedule[]): SessionInfo | null {
  if (!routine || routine.length === 0) return null;

  const now = nowBST();
  const currentDay = getDayName(now);
  const TEN_MINUTES = 10 * 60 * 1000;

  // Build a lookup map: day -> periods
  const scheduleMap = new Map<string, Period[]>();
  for (const entry of routine) {
    scheduleMap.set(entry.day, entry.periods);
  }

  // ── 1. Check today's schedule ──
  const todayPeriods = scheduleMap.get(currentDay) ?? [];

  for (const period of todayPeriods) {
    const { start, end } = parseTimeSlot(period.time);
    const msUntilStart = start.getTime() - now.getTime();
    const msUntilEnd = end.getTime() - now.getTime();

    // Currently happening
    if (msUntilStart <= 0 && msUntilEnd > 0) {
      return {
        status: "happening_now",
        period,
        day: currentDay,
        startTime: formatDisplayTime(start),
        endTime: formatDisplayTime(end),
      };
    }

    // Happening soon (within 10 minutes)
    if (msUntilStart > 0 && msUntilStart <= TEN_MINUTES) {
      return {
        status: "happening_soon",
        period,
        day: currentDay,
        startTime: formatDisplayTime(start),
        endTime: formatDisplayTime(end),
      };
    }

    // Next class (more than 10 min away, but still today and in the future)
    if (msUntilStart > TEN_MINUTES) {
      return {
        status: "next_class",
        period,
        day: currentDay,
        startTime: formatDisplayTime(start),
        endTime: formatDisplayTime(end),
      };
    }
  }

  // ── 2. All classes done for today — find next day with classes ──
  const currentDayIndex = DAY_ORDER.indexOf(currentDay);

  for (let offset = 1; offset <= 7; offset++) {
    const nextDayIndex = (currentDayIndex + offset) % 7;
    const nextDay = DAY_ORDER[nextDayIndex];
    const nextPeriods = scheduleMap.get(nextDay);

    if (nextPeriods && nextPeriods.length > 0) {
      const firstPeriod = nextPeriods[0];
      const { start, end } = parseTimeSlot(firstPeriod.time);

      // Determine status based on when the next class day is
      const isWeekend = WEEKEND_DAYS.includes(currentDay);
      const isTomorrow = offset === 1;

      let status: SessionStatus;
      if (isWeekend || nextDay === "Sunday") {
        status = "next_sunday";
      } else if (isTomorrow) {
        status = "tomorrow";
      } else {
        status = "tomorrow"; // fallback — shows day name anyway
      }

      return {
        status,
        period: firstPeriod,
        day: nextDay,
        startTime: formatDisplayTime(start),
        endTime: formatDisplayTime(end),
      };
    }
  }

  return null;
}

function formatDisplayTime(d: Date): string {
  let h = d.getHours();
  const m = d.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
}

// ── Status badge config ────────────────────────────────
function getStatusConfig(status: SessionStatus, day: string, t: (key: TranslationKey) => string, lang: Language) {
  switch (status) {
    case "happening_now":
      return {
        label: t("happeningNow"),
        bgColor: "bg-red-600",
        pulse: true,
      };
    case "happening_soon":
      return {
        label: t("happeningSoon"),
        bgColor: "bg-primary",
        pulse: false,
      };
    case "next_class":
      return {
        label: t("nextClass"),
        bgColor: "bg-primary",
        pulse: false,
      };
    case "tomorrow":
      return {
        label: `${t("resumesTomorrow")} · ${translateDay(day, lang)}`,
        bgColor: "bg-slate-700 dark:bg-slate-600",
        pulse: false,
      };
    case "next_sunday":
      return {
        label: `${t("resumesSunday")}`,
        bgColor: "bg-slate-700 dark:bg-slate-600",
        pulse: false,
      };
    default:
      return {
        label: t("noClasses"),
        bgColor: "bg-slate-700 dark:bg-slate-600",
        pulse: false,
      };
  }
}

// ── Extract subject code from full name like "Generation of Electrical Power (26751)" ──
function extractSubjectInfo(fullSubject: string): { name: string; code: string } {
  const match = fullSubject.match(/^(.*?)\s*\((\d+)\)\s*$/);
  if (match) {
    return { name: match[1].trim(), code: match[2] };
  }
  return { name: fullSubject, code: "" };
}

// ── Component ──────────────────────────────────────────
export function NextSessionCard() {
  const { t, lang } = useLanguage();
  const [tick, setTick] = useState(0);

  // Use the verified college routine schedule
  const routine = mockRoutine;

  // Re-render every 30 seconds to keep status fresh
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  const session = useMemo(() => computeNextSession(routine as DaySchedule[]), [routine, tick]);

  if (!session || !session.period) {
    return (
      <div className="rounded-2xl bg-slate-700 p-5 text-white">
        <p className="text-[10px] font-semibold tracking-widest uppercase opacity-70">
          {t("noClasses")}
        </p>
        <h3 className="mt-2 text-xl font-bold leading-tight">{t("noClasses")}</h3>
        <p className="text-sm opacity-80 mt-1">{t("enjoyYourDay")}</p>
      </div>
    );
  }

  const { status, period, day, startTime } = session;
  const statusConfig = getStatusConfig(status, day, t, lang as Language);
  const { name: subjectName, code: subjectCode } = extractSubjectInfo(period.subject);

  const isToday = status === "happening_now" || status === "happening_soon" || status === "next_class";

  return (
    <div className={`rounded-2xl ${statusConfig.bgColor} p-5 text-white relative overflow-hidden transition-all duration-300`}>
      {/* Pulsing indicator for "happening now" */}
      {statusConfig.pulse && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <span className="text-[10px] font-bold tracking-wider uppercase">LIVE</span>
        </div>
      )}

      {/* Status label */}
      <p className="text-[10px] font-semibold tracking-widest uppercase opacity-80">
        {statusConfig.label}
      </p>

      {/* Subject name */}
      <h3 className="mt-2 text-xl font-bold leading-tight">{translateSubject(subjectName, lang as Language)}</h3>

      {/* Subject code + teacher */}
      {subjectCode && (
        <p className="text-base font-medium opacity-80">
          {subjectCode} — {translateTeacher(period.teacher, lang as Language).split(" ").pop()}
        </p>
      )}

      {/* Time + Hall + Day */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-sm opacity-85">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {startTime}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5" />
          {period.hall}
        </span>
        {!isToday && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {translateDay(day, lang as Language)}
          </span>
        )}
      </div>
    </div>
  );
}
