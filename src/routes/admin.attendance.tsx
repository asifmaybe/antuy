import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, ToggleLeft, ToggleRight, Check, X as XIcon, Clock } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { mockStudentsList, type AttendanceRecord } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/attendance")({
  component: AdminAttendancePage,
  head: () => ({
    meta: [{ title: "Manage Attendance — EduPortal Admin" }],
  }),
});

function AdminAttendancePage() {
  const { lang } = useLanguage();
  const [isOnlineActive, setIsOnlineActive] = useState(false);
  const [subject, setSubject] = useState("");
  const [records, setRecords] = useState<AttendanceRecord[]>(
    mockStudentsList.map(s => ({ studentId: s.id, studentName: s.name, status: "present", remarks: "" }))
  );
  const [savedSessions, setSavedSessions] = useState<Array<{ date: string; subject: string; markedBy: string; presentCount: number; total: number }>>([
    { date: "Apr 15, 2026 8:30 AM", subject: "Physics", markedBy: "Rina Mondal", presentCount: 8, total: 10 },
    { date: "Apr 14, 2026 9:00 AM", subject: "English", markedBy: "Emdadul Hoque", presentCount: 9, total: 10 },
  ]);

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("eduportal_user") || "{}"); } catch { return {}; }
  })();

  const toggleStatus = (studentId: string) => {
    setRecords(prev => prev.map(r => {
      if (r.studentId !== studentId) return r;
      const next = r.status === "present" ? "absent" : r.status === "absent" ? "late" : "present";
      return { ...r, status: next };
    }));
  };

  const handleSave = () => {
    if (!subject) return;
    const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
    const presentCount = records.filter(r => r.status === "present").length;
    setSavedSessions(prev => [{
      date: now,
      subject,
      markedBy: user.name || "Admin",
      presentCount,
      total: records.length,
    }, ...prev]);
    setSubject("");
    setRecords(prev => prev.map(r => ({ ...r, status: "present", remarks: "" })));
    setIsOnlineActive(false);
  };

  const statusStyle = (s: string) =>
    s === "present" ? "bg-primary/10 text-primary" :
    s === "absent" ? "bg-destructive/10 text-destructive" :
    "bg-yellow-100 text-yellow-700";

  return (
    <>
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold">{lang === "bn" ? "উপস্থিতি ব্যবস্থাপনা" : "Attendance Management"}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {lang === "bn" ? "শিক্ষক অনুপস্থিত থাকলে CR অনলাইনে উপস্থিতি নিতে পারবে" : "CR can mark attendance online when teacher is absent"}
        </p>
      </header>

      <main className="px-4 space-y-4">
        {/* Toggle Online Marking */}
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <div>
            <h3 className="font-semibold text-sm">{lang === "bn" ? "অনলাইন উপস্থিতি" : "Online Attendance"}</h3>
            <p className="text-[10px] text-muted-foreground">
              {isOnlineActive
                ? (lang === "bn" ? "সক্রিয় — এখন উপস্থিতি নিন" : "Active — mark attendance now")
                : (lang === "bn" ? "নিষ্ক্রিয় — অফলাইনে হচ্ছে" : "Inactive — handled offline")}
            </p>
          </div>
          <button onClick={() => setIsOnlineActive(!isOnlineActive)} className="text-primary">
            {isOnlineActive
              ? <ToggleRight className="h-8 w-8" />
              : <ToggleLeft className="h-8 w-8 text-muted-foreground" />}
          </button>
        </div>

        {isOnlineActive && (
          <>
            <div>
              <Input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder={lang === "bn" ? "বিষয় লিখুন (যেমন Physics)" : "Enter subject (e.g. Physics)"}
              />
            </div>

            <div className="space-y-2">
              {records.map((r, i) => (
                <div key={r.studentId} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <span className="text-xs font-medium text-muted-foreground w-6">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.studentName}</p>
                    <p className="text-[10px] text-muted-foreground">{r.studentId}</p>
                  </div>
                  <button
                    onClick={() => toggleStatus(r.studentId)}
                    className={`rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyle(r.status)}`}
                  >
                    {r.status === "present" ? (lang === "bn" ? "উপস্থিত" : "Present") :
                     r.status === "absent" ? (lang === "bn" ? "অনুপস্থিত" : "Absent") :
                     (lang === "bn" ? "বিলম্বিত" : "Late")}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Check className="h-3 w-3 text-primary" /> {records.filter(r => r.status === "present").length}</span>
              <span className="flex items-center gap-1"><XIcon className="h-3 w-3 text-destructive" /> {records.filter(r => r.status === "absent").length}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-yellow-600" /> {records.filter(r => r.status === "late").length}</span>
            </div>

            <Button onClick={handleSave} className="w-full" disabled={!subject}>
              {lang === "bn" ? "উপস্থিতি সংরক্ষণ করুন" : "Save Attendance"}
            </Button>
          </>
        )}

        {/* Previous Sessions */}
        <section>
          <h2 className="font-semibold text-sm mb-2 mt-4">{lang === "bn" ? "আগের সেশন" : "Previous Sessions"}</h2>
          <div className="space-y-2">
            {savedSessions.map((s, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                  <Users className="h-3.5 w-3.5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.subject}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {s.presentCount}/{s.total} {lang === "bn" ? "উপস্থিত" : "present"} · {s.markedBy} · {s.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
