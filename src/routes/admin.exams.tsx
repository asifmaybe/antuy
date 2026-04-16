import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { mockAdminExams, type AdminExam } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/exams")({
  component: AdminExamsPage,
  head: () => ({
    meta: [{ title: "Manage Exams — EduPortal Admin" }],
  }),
});

function AdminExamsPage() {
  const { lang } = useLanguage();
  const [exams, setExams] = useState<AdminExam[]>(mockAdminExams);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const [form, setForm] = useState({ subject: "", type: "Class Test" as AdminExam["type"], date: "", marks: "", instructions: "" });

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("eduportal_user") || "{}"); } catch { return {}; }
  })();

  const resetForm = () => {
    setForm({ subject: "", type: "Class Test", date: "", marks: "", instructions: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.subject || !form.date || !form.marks) return;
    const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

    if (editingId) {
      setExams(prev => prev.map(e => e.id === editingId ? {
        ...e, ...form, marks: Number(form.marks), updatedBy: user.name || "Admin", updatedAt: now,
      } : e));
    } else {
      const newExam: AdminExam = {
        id: Date.now().toString(),
        ...form,
        marks: Number(form.marks),
        upcoming: true,
        createdBy: user.name || "Admin",
        updatedBy: user.name || "Admin",
        createdAt: now,
        updatedAt: now,
      };
      setExams(prev => [newExam, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (e: AdminExam) => {
    setForm({ subject: e.subject, type: e.type, date: e.date, marks: String(e.marks), instructions: e.instructions });
    setEditingId(e.id);
    setShowForm(true);
  };

  const filtered = exams.filter(e => tab === "upcoming" ? e.upcoming : !e.upcoming);

  return (
    <>
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{lang === "bn" ? "পরীক্ষা ব্যবস্থাপনা" : "Exam Management"}</h1>
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> {lang === "bn" ? "নতুন" : "New"}
          </Button>
        </div>
        <div className="flex rounded-xl bg-muted p-1 mt-4">
          <button onClick={() => setTab("upcoming")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${tab === "upcoming" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            {lang === "bn" ? "আসন্ন" : "Upcoming"}
          </button>
          <button onClick={() => setTab("past")} className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${tab === "past" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            {lang === "bn" ? "আগের" : "Past"}
          </button>
        </div>
      </header>

      <main className="px-4 space-y-4">
        {showForm && (
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{editingId ? "Edit Exam" : (lang === "bn" ? "নতুন পরীক্ষা" : "New Exam")}</h3>
              <button onClick={resetForm}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">{lang === "bn" ? "বিষয়" : "Subject"}</Label>
                <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. English" />
              </div>
              <div>
                <Label className="text-xs">{lang === "bn" ? "ধরন" : "Type"}</Label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value as AdminExam["type"] }))}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="Class Test">Class Test</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Mid-Term">Mid-Term</option>
                  <option value="Final">Final</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">{lang === "bn" ? "তারিখ" : "Date"}</Label>
                  <Input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} placeholder="Apr 25, 2026" />
                </div>
                <div>
                  <Label className="text-xs">{lang === "bn" ? "নম্বর" : "Total Marks"}</Label>
                  <Input type="number" value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} placeholder="50" />
                </div>
              </div>
              <div>
                <Label className="text-xs">{lang === "bn" ? "নির্দেশনা" : "Instructions"}</Label>
                <Textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={2} placeholder="Optional instructions..." />
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">{editingId ? "Update" : (lang === "bn" ? "তৈরি করুন" : "Create")}</Button>
          </div>
        )}

        {filtered.map(e => (
          <div key={e.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{e.subject}</h3>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">{e.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">{e.date} · {e.marks} marks</p>
                {e.instructions && <p className="text-xs text-muted-foreground mt-1">{e.instructions}</p>}
                <p className="text-[10px] text-muted-foreground mt-2">
                  {lang === "bn" ? "সর্বশেষ আপডেট" : "Last updated by"} {e.updatedBy} · {e.updatedAt}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleEdit(e)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button onClick={() => setExams(prev => prev.filter(x => x.id !== e.id))} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {tab === "upcoming" ? (lang === "bn" ? "কোনো আসন্ন পরীক্ষা নেই" : "No upcoming exams") : (lang === "bn" ? "কোনো আগের পরীক্ষা নেই" : "No past exams")}
          </div>
        )}
      </main>
    </>
  );
}
