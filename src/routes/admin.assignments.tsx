import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { mockAdminAssignments, type AdminAssignment } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/assignments")({
  component: AdminAssignmentsPage,
  head: () => ({
    meta: [{ title: "Manage Assignments — EduPortal Admin" }],
  }),
});

function AdminAssignmentsPage() {
  const { lang } = useLanguage();
  const [assignments, setAssignments] = useState<AdminAssignment[]>(mockAdminAssignments);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subject: "", description: "", assignedDate: "", dueDate: "" });

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("eduportal_user") || "{}"); } catch { return {}; }
  })();

  const resetForm = () => {
    setForm({ title: "", subject: "", description: "", assignedDate: "", dueDate: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.title || !form.subject || !form.dueDate) return;
    const now = new Date().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });

    if (editingId) {
      setAssignments(prev => prev.map(a => a.id === editingId ? {
        ...a, ...form, updatedBy: user.name || "Admin", updatedAt: now,
      } : a));
    } else {
      const newAssignment: AdminAssignment = {
        id: Date.now().toString(),
        ...form,
        assignedDate: form.assignedDate || now.split(",")[0],
        status: "active",
        createdBy: user.name || "Admin",
        updatedBy: user.name || "Admin",
        createdAt: now,
        updatedAt: now,
      };
      setAssignments(prev => [newAssignment, ...prev]);
    }
    resetForm();
  };

  const handleEdit = (a: AdminAssignment) => {
    setForm({ title: a.title, subject: a.subject, description: a.description, assignedDate: a.assignedDate, dueDate: a.dueDate });
    setEditingId(a.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const statusColor = (s: string) => s === "active" ? "bg-primary/10 text-primary" : s === "overdue" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground";

  return (
    <>
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{lang === "bn" ? "অ্যাসাইনমেন্ট ব্যবস্থাপনা" : "Assignment Management"}</h1>
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> {lang === "bn" ? "নতুন" : "New"}
          </Button>
        </div>
      </header>

      <main className="px-4 space-y-4">
        {showForm && (
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{editingId ? (lang === "bn" ? "সম্পাদনা" : "Edit Assignment") : (lang === "bn" ? "নতুন অ্যাসাইনমেন্ট" : "New Assignment")}</h3>
              <button onClick={resetForm}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">{lang === "bn" ? "শিরোনাম" : "Title"}</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Assignment title" />
              </div>
              <div>
                <Label className="text-xs">{lang === "bn" ? "বিষয়" : "Subject"}</Label>
                <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. English, Physics" />
              </div>
              <div>
                <Label className="text-xs">{lang === "bn" ? "বিবরণ" : "Description"}</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Details..." rows={2} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">{lang === "bn" ? "দেওয়া হয়েছে" : "Assigned Date"}</Label>
                  <Input value={form.assignedDate} onChange={e => setForm(f => ({ ...f, assignedDate: e.target.value }))} placeholder="Apr 10, 2026" />
                </div>
                <div>
                  <Label className="text-xs">{lang === "bn" ? "জমার তারিখ" : "Due Date"}</Label>
                  <Input value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} placeholder="Apr 18, 2026" />
                </div>
              </div>
            </div>
            <Button onClick={handleSave} className="w-full">{editingId ? (lang === "bn" ? "আপডেট করুন" : "Update") : (lang === "bn" ? "তৈরি করুন" : "Create")}</Button>
          </div>
        )}

        {assignments.map(a => (
          <div key={a.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{a.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(a.status)}`}>
                    {a.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{a.subject}</p>
                {a.description && <p className="text-xs text-muted-foreground mt-1">{a.description}</p>}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span>{lang === "bn" ? "দেওয়া" : "Assigned"}: {a.assignedDate}</span>
                  <span>{lang === "bn" ? "জমা" : "Due"}: {a.dueDate}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {lang === "bn" ? "সর্বশেষ আপডেট" : "Last updated by"} {a.updatedBy} · {a.updatedAt}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => handleEdit(a)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
              </div>
            </div>
          </div>
        ))}

        {assignments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {lang === "bn" ? "কোনো অ্যাসাইনমেন্ট নেই" : "No assignments yet"}
          </div>
        )}
      </main>
    </>
  );
}
