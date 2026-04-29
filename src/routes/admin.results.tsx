import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllResults,
  fetchStudentsList,
  createResult,
  logAuditEntry,
  type Result,
} from "@/lib/api";
import { formatFullDate, formatDateTime, todayBST } from "@/lib/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/results")({
  component: AdminResultsPage,
  head: () => ({
    meta: [{ title: "Manage Results — ET 23-24 Admin" }],
  }),
});

function AdminResultsPage() {
  const { lang } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: results = [], isLoading } = useQuery({
    queryKey: ["all-results"],
    queryFn: fetchAllResults,
  });

  const { data: students = [] } = useQuery({
    queryKey: ["students-list"],
    queryFn: fetchStudentsList,
  });

  const [showForm, setShowForm] = useState(false);
  const [filterSubject, setFilterSubject] = useState("");
  const [filterType, setFilterType] = useState("");
  const [form, setForm] = useState({
    studentId: "",
    subject: "",
    examType: "Quiz" as Result["exam_type"],
    marks: "",
    totalMarks: "",
    date: "",
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.studentId || !form.subject || !form.marks || !form.totalMarks) return;
      const student = students.find((s) => s.id === form.studentId);
      const userName = user?.name || "Admin";

      await createResult({
        student_id: form.studentId,
        student_name: student?.name || form.studentId,
        subject: form.subject,
        exam_type: form.examType,
        marks: Number(form.marks),
        total_marks: Number(form.totalMarks),
        date: form.date || todayBST(),
        uploaded_by: userName,
      });

      await logAuditEntry({
        action: "Uploaded Results",
        performed_by: userName,
        subject: form.subject,
        details: `${form.subject} ${form.examType} result for ${student?.name || form.studentId}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-results"] });
      queryClient.invalidateQueries({ queryKey: ["audit-log"] });
      setForm({
        studentId: "",
        subject: "",
        examType: "Quiz",
        marks: "",
        totalMarks: "",
        date: "",
      });
      setShowForm(false);
    },
  });

  const subjects = [...new Set(results.map((r) => r.subject))];
  const types = [...new Set(results.map((r) => r.exam_type))];

  const filtered = results.filter(
    (r) =>
      (!filterSubject || r.subject === filterSubject) &&
      (!filterType || r.exam_type === filterType),
  );

  const formatDate = formatFullDate;

  return (
    <>
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">
            {lang === "bn" ? "ফলাফল ব্যবস্থাপনা" : "Results Management"}
          </h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Upload className="h-4 w-4 mr-1" /> {lang === "bn" ? "আপলোড" : "Upload"}
          </Button>
        </div>
      </header>

      <main className="px-4 space-y-4">
        {showForm && (
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {lang === "bn" ? "ফলাফল আপলোড" : "Upload Result"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Student</Label>
                <select
                  value={form.studentId}
                  onChange={(e) => setForm((f) => ({ ...f, studentId: e.target.value }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Select student...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.student_id})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">{lang === "bn" ? "বিষয়" : "Subject"}</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="English"
                  />
                </div>
                <div>
                  <Label className="text-xs">{lang === "bn" ? "ধরন" : "Exam Type"}</Label>
                  <select
                    value={form.examType}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, examType: e.target.value as Result["exam_type"] }))
                    }
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                  >
                    <option value="Quiz">Quiz</option>
                    <option value="Class Test">Class Test</option>
                    <option value="Mid-Term">Mid-Term</option>
                    <option value="Final">Final</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">{lang === "bn" ? "প্রাপ্ত" : "Marks"}</Label>
                  <Input
                    type="number"
                    value={form.marks}
                    onChange={(e) => setForm((f) => ({ ...f, marks: e.target.value }))}
                    placeholder="18"
                  />
                </div>
                <div>
                  <Label className="text-xs">{lang === "bn" ? "মোট" : "Total"}</Label>
                  <Input
                    type="number"
                    value={form.totalMarks}
                    onChange={(e) => setForm((f) => ({ ...f, totalMarks: e.target.value }))}
                    placeholder="20"
                  />
                </div>
                <div>
                  <Label className="text-xs">{lang === "bn" ? "তারিখ" : "Date"}</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <Button
              onClick={() => saveMutation.mutate()}
              className="w-full"
              disabled={saveMutation.isPending}
            >
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {lang === "bn" ? "আপলোড করুন" : "Upload Result"}
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="rounded-lg border bg-card px-3 py-1.5 text-xs"
          >
            <option value="">{lang === "bn" ? "সব বিষয়" : "All Subjects"}</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border bg-card px-3 py-1.5 text-xs"
          >
            <option value="">{lang === "bn" ? "সব ধরন" : "All Types"}</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-xl border bg-card p-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{r.student_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.student_id} · {r.subject} · {r.exam_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {r.marks}
                      <span className="text-xs text-muted-foreground font-normal">
                        /{r.total_marks}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  {lang === "bn" ? "আপলোড করেছেন" : "Uploaded by"} {r.uploaded_by} ·{" "}
                  {formatDateTime(r.uploaded_at)}
                </p>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {lang === "bn" ? "কোনো ফলাফল নেই" : "No results found"}
          </div>
        )}
      </main>
    </>
  );
}
