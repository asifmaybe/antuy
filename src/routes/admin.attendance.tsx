import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, ToggleLeft, ToggleRight, Check, X as XIcon, Clock, Loader2, ClipboardPaste, ChevronDown } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStudentsList,
  fetchAttendanceSessions,
  createAttendanceSession,
  createAttendanceRecords,
  logAuditEntry,
} from "@/lib/api";
import { formatDateTime } from "@/lib/date";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/attendance")({
  component: AdminAttendancePage,
  head: () => ({
    meta: [{ title: "Manage Attendance — ET 23-24 Admin" }],
  }),
});

interface LocalRecord {
  studentId: string;
  studentName: string;
  rollNumber: number;
  status: "present" | "absent" | "late";
  remarks: string;
}

// Maps attendance dropdown values to keywords found in teacher profile subjects
const SUBJECT_TO_TEACHER_KEYWORD: Record<string, string> = {
  "Generation of Electrical Power (26751)": "Generation of Electrical Power",
  "Principle of Marketing (25851)": "Principle of Marketing",
  "Industrial Management (25852)": "Industrial Management",
  "Elec. & Electronic Measurement-I (26752)": "Electronic Measurement",
  "Testing & Maintenance of Elec. Equip. (26753)": "Testing & Maintenance",
  "Electrical Engineering Project-II (26754)": "Electrical Engineering Project",
  "Microprocessor & Microcontroller (26853)": "Microprocessor & Microcontroller",
};

const ALL_SUBJECTS = Object.keys(SUBJECT_TO_TEACHER_KEYWORD);

function AdminAttendancePage() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: students = [] } = useQuery({
    queryKey: ["students-list"],
    queryFn: fetchStudentsList,
  });

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ["attendance-sessions"],
    queryFn: fetchAttendanceSessions,
  });

  const [isOnlineActive, setIsOnlineActive] = useState(false);
  const [subject, setSubject] = useState("");
  const [rollInput, setRollInput] = useState("");
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [isProcessed, setIsProcessed] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  // Filter sessions: teachers only see their own subjects, admin/cr see all
  const filteredSessions = (user?.role === "teacher" && user?.subject)
    ? sessions.filter((s) => {
      const keyword = SUBJECT_TO_TEACHER_KEYWORD[s.subject];
      if (!keyword) return false;
      return user.subject!.toLowerCase().includes(keyword.toLowerCase());
    })
    : sessions;

  // Filter subject dropdown: teachers only see their own subjects
  const availableSubjects = (user?.role === "teacher" && user?.subject)
    ? ALL_SUBJECTS.filter((subj) => {
      const keyword = SUBJECT_TO_TEACHER_KEYWORD[subj];
      if (!keyword) return false;
      return user.subject!.toLowerCase().includes(keyword.toLowerCase());
    })
    : ALL_SUBJECTS;

  // Process pasted roll numbers and build sorted attendance table
  const processRolls = () => {
    // Parse roll numbers from textarea (supports newlines, commas, spaces)
    const inputRolls = rollInput
      .split(/[\n,\s]+/)
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    const presentRollSet = new Set(inputRolls);

    // Build records from all students with roll-based status
    const allRecords: LocalRecord[] = students.map((s) => {
      const rollStr = String(s.roll_number || "");
      const isPresent = presentRollSet.has(rollStr) || presentRollSet.has(s.id);
      return {
        studentId: s.id,
        studentName: s.name,
        rollNumber: s.roll_number || 0,
        status: isPresent ? ("present" as const) : ("absent" as const),
        remarks: "",
      };
    });

    // Sort by roll number only (keep natural order)
    allRecords.sort((a, b) => a.rollNumber - b.rollNumber);

    setRecords(allRecords);
    setIsProcessed(true);
  };

  const toggleStatus = (studentId: string) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId !== studentId) return r;
        const next = r.status === "present" ? "absent" : r.status === "absent" ? "late" : "present";
        return { ...r, status: next };
      }),
    );
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!subject) return;
      const userName = user?.name || "Admin";

      const session = await createAttendanceSession({
        subject,
        marked_by: userName,
        is_online_marking_active: true,
      });

      await createAttendanceRecords(
        records.map((r) => ({
          session_id: session.id,
          student_id: r.studentId,
          student_name: r.studentName,
          status: r.status,
          remarks: r.remarks,
        })),
      );

      const presentCount = records.filter((r) => r.status === "present").length;
      await logAuditEntry({
        action: "Marked Attendance",
        performed_by: userName,
        subject,
        details: `${presentCount}/${records.length} present for ${subject}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["audit-log"] });
      setSubject("");
      setRollInput("");
      setRecords([]);
      setIsProcessed(false);
      setIsOnlineActive(false);
    },
  });

  const statusStyle = (s: string) =>
    s === "present"
      ? "text-primary bg-primary/10"
      : s === "absent"
        ? "text-destructive bg-destructive/10"
        : "text-yellow-700 bg-yellow-100";

  const statusLabel = (s: string) =>
    s === "present" ? "✓" : s === "absent" ? "✗" : "L";

  const presentCount = records.filter((r) => r.status === "present").length;
  const absentCount = records.filter((r) => r.status === "absent").length;
  const lateCount = records.filter((r) => r.status === "late").length;

  return (
    <>
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-bold">
          {lang === "bn" ? "উপস্থিতি ব্যবস্থাপনা" : "Attendance Management"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {lang === "bn"
            ? "রোল নম্বর পেস্ট করে দ্রুত উপস্থিতি নিন"
            : "Paste roll numbers to quickly mark attendance"}
        </p>
      </header>

      <main className="px-4 space-y-4">
        {/* Toggle Online Marking */}
        <div className="flex items-center justify-between rounded-xl border bg-card p-4">
          <div>
            <h3 className="font-semibold text-sm">
              {lang === "bn" ? "অনলাইন উপস্থিতি" : "Online Attendance"}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {isOnlineActive
                ? lang === "bn"
                  ? "সক্রিয় — এখন উপস্থিতি নিন"
                  : "Active — mark attendance now"
                : lang === "bn"
                  ? "নিষ্ক্রিয় — অফলাইনে হচ্ছে"
                  : "Inactive — handled offline"}
            </p>
          </div>
          <button
            onClick={() => {
              setIsOnlineActive(!isOnlineActive);
              if (isOnlineActive) {
                setIsProcessed(false);
                setRecords([]);
                setRollInput("");
                setSubject("");
              }
            }}
            className="text-primary"
          >
            {isOnlineActive ? (
              <ToggleRight className="h-8 w-8" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-muted-foreground" />
            )}
          </button>
        </div>

        {isOnlineActive && (
          <>
            {/* Step 1: Subject + Roll Input */}
            {!isProcessed && (
              <div className="space-y-3">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">
                    {lang === "bn" ? "বিষয় নির্বাচন করুন" : "Select Subject"}
                  </option>
                  {availableSubjects.map((subj) => (
                    <option key={subj} value={subj}>{subj}</option>
                  ))}
                </select>

                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    <ClipboardPaste className="h-3 w-3 inline mr-1" />
                    {lang === "bn"
                      ? "উপস্থিত শিক্ষার্থীদের রোল নম্বর পেস্ট করুন (প্রতি লাইনে একটি)"
                      : "Paste present students' roll numbers (one per line)"}
                  </label>
                  <textarea
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    placeholder={"842943\n842944\n842946\n..."}
                    className="w-full rounded-xl border bg-card px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                    rows={6}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {lang === "bn"
                      ? "যাদের রোল নম্বর দেবেন তারা উপস্থিত, বাকিরা অনুপস্থিত হিসেবে চিহ্নিত হবে"
                      : "Roll numbers entered = Present. Everyone else = Absent."}
                  </p>
                </div>

                <Button
                  onClick={processRolls}
                  className="w-full"
                  disabled={!subject || !rollInput.trim()}
                >
                  {lang === "bn" ? "উপস্থিতি প্রক্রিয়া করুন" : "Process Attendance"}
                </Button>
              </div>
            )}

            {/* Step 2: Review compact table */}
            {isProcessed && (
              <div className="space-y-3">
                {/* Summary header */}
                <div className="flex items-center justify-between rounded-xl border bg-card p-3">
                  <div>
                    <p className="text-sm font-semibold">{subject}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-primary" /> {presentCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <XIcon className="h-3 w-3 text-destructive" /> {absentCount}
                      </span>
                      {lateCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-yellow-600" /> {lateCount}
                        </span>
                      )}
                      <span>
                        {lang === "bn" ? "মোট" : "Total"}: {records.length}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setIsProcessed(false); setRecords([]); }}
                    className="text-xs text-primary underline"
                  >
                    {lang === "bn" ? "আবার সম্পাদনা" : "Re-edit"}
                  </button>
                </div>

                {/* Compact attendance table */}
                <div className="rounded-xl border bg-card overflow-hidden">
                  {/* Table header */}
                  <div className="grid grid-cols-[2.5rem_1fr_6rem_3.5rem] gap-1 px-3 py-2 bg-muted/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                    <span>#</span>
                    <span>{lang === "bn" ? "নাম" : "Name"}</span>
                    <span className="pl-6">{lang === "bn" ? "রোল" : "Roll"}</span>
                    <span className="text-center">{lang === "bn" ? "স্থিতি" : "Status"}</span>
                  </div>

                  {/* Table rows */}
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    {records.map((r, i) => (
                      <div
                        key={r.studentId}
                        className={`grid grid-cols-[2.5rem_1fr_6rem_3.5rem] gap-1 items-center px-3 py-1.5 text-xs border-t ${r.status === "absent" ? "bg-destructive/5" : ""
                          }`}
                      >
                        <span className="text-muted-foreground">{i + 1}</span>
                        <span className="truncate font-medium">{r.studentName}</span>
                        <span className="font-mono text-[13px] font-bold pl-6">{r.rollNumber}</span>
                        <button
                          onClick={() => toggleStatus(r.studentId)}
                          className={`w-8 h-6 mx-auto flex items-center justify-center rounded text-xs font-bold ${statusStyle(r.status)}`}
                          title={lang === "bn" ? "ক্লিক করে পরিবর্তন করুন" : "Click to toggle"}
                        >
                          {statusLabel(r.status)}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground text-center">
                  {lang === "bn"
                    ? "স্থিতি বাটনে ক্লিক করে উপস্থিত/অনুপস্থিত/বিলম্বিত পরিবর্তন করুন"
                    : "Click status to toggle: Present → Absent → Late → Present"}
                </p>

                <Button
                  onClick={() => saveMutation.mutate()}
                  className="w-full"
                  disabled={!subject || saveMutation.isPending}
                >
                  {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                  {lang === "bn" ? "উপস্থিতি সংরক্ষণ করুন" : "Save Attendance"}
                </Button>
              </div>
            )}
          </>
        )}

        {/* Previous Sessions */}
        <section>
          <h2 className="font-semibold text-sm mb-2 mt-4">
            {lang === "bn" ? "আগের সেশন" : "Previous Sessions"}
          </h2>
          <p className="text-[10px] text-muted-foreground mb-2">
            {lang === "bn" ? "বিস্তারিত দেখতে ক্লিক করুন" : "Click a session to view details"}
          </p>
          {sessionsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSessions.map((s) => {
                const pCount = s.records?.filter((r) => r.status === "present").length ?? 0;
                const aCount = s.records?.filter((r) => r.status === "absent").length ?? 0;
                const total = s.records?.length ?? 0;
                const isExpanded = expandedSessionId === s.id;
                return (
                  <div key={s.id} className="rounded-xl border bg-card overflow-hidden">
                    <button
                      onClick={() => setExpandedSessionId(isExpanded ? null : s.id)}
                      className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{s.subject}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {pCount}/{total} {lang === "bn" ? "উপস্থিত" : "present"} · {aCount} {lang === "bn" ? "অনুপস্থিত" : "absent"} · {s.marked_by} · {formatDateTime(s.created_at)}
                        </p>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </button>

                    {isExpanded && s.records && s.records.length > 0 && (
                      <div className="border-t">
                        <div className="grid grid-cols-[2.5rem_1fr_6rem_3.5rem] gap-1 px-3 py-1.5 bg-muted/50 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                          <span>#</span>
                          <span>{lang === "bn" ? "নাম" : "Name"}</span>
                          <span className="pl-6">{lang === "bn" ? "রোল" : "Roll"}</span>
                          <span className="text-center">{lang === "bn" ? "স্থিতি" : "Status"}</span>
                        </div>
                        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                          {s.records.map((rec, idx) => {
                            const stu = students.find((st) => st.id === rec.student_id);
                            return (
                              <div
                                key={rec.id}
                                className={`grid grid-cols-[2.5rem_1fr_6rem_3.5rem] gap-1 items-center px-3 py-1.5 text-xs border-t ${rec.status === "absent" ? "bg-destructive/5" : ""}`}
                              >
                                <span className="text-muted-foreground">{idx + 1}</span>
                                <span className="truncate font-medium">{rec.student_name}</span>
                                <span className="font-mono text-[13px] font-bold pl-6">{stu?.roll_number ?? "—"}</span>
                                <span className={`text-center font-bold ${rec.status === "present" ? "text-primary" : rec.status === "absent" ? "text-destructive" : "text-yellow-600"}`}>
                                  {rec.status === "present" ? "✓" : rec.status === "absent" ? "✗" : "L"}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

