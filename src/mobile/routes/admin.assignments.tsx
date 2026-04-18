import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAssignments, createAssignment, updateAssignment, deleteAssignment, logAuditEntry, type Assignment } from "@/lib/api";
import { formatFullDate, formatDateTime, todayBST } from "@/lib/date";
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: fetchAssignments,
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", subject: "", description: "", assignedDate: "", dueDate: "" });

  const resetForm = () => {
    setForm({ title: "", subject: "", description: "", assignedDate: "", dueDate: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.title || !form.subject || !form.dueDate) return;
      const userName = user?.name || "Admin";

      if (editingId) {
        await updateAssignment(editingId, {
          title: form.title,
          subject: form.subject,
          description: form.description,
          due_date: form.dueDate,
          updated_by: userName,
        });
        await logAuditEntry({ action: "Updated Assignment", performed_by: userName, subject: form.subject, details: form.title });
      } else {
        await createAssignment({
          title: form.title,
          subject: form.subject,
          description: form.description,
          assigned_date: form.assignedDate || todayBST(),
          due_date: form.dueDate,
          created_by: userName,
          updated_by: userName,
        });
        await logAuditEntry({ action: "Created Assignment", performed_by: userName, subject: form.subject, details: form.title });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["audit-log"] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteAssignment(id);
      await logAuditEntry({ action: "Deleted Assignment", performed_by: user?.name || "Admin", details: `Deleted assignment ${id}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["audit-log"] });
    },
  });

  const handleEdit = (a: Assignment) => {
    setForm({
      title: a.title,
      subject: a.subject,
      description: a.description,
      assignedDate: a.assigned_date,
      dueDate: a.due_date,
    });
    setEditingId(a.id);
    setShowForm(true);
  };

  const statusColor = (s: string) => s === "active" ? "bg-primary/10 text-primary" : s === "overdue" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground";

  const formatDate = formatFullDate;

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
                  <Input type="date" value={form.assignedDate} onChange={e => setForm(f => ({ ...f, assignedDate: e.target.value }))} />
                </div>
                <div>
                  <Label className="text-xs">{lang === "bn" ? "জমার তারিখ" : "Due Date"}</Label>
                  <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
              </div>
            </div>
            <Button onClick={() => saveMutation.mutate()} className="w-full" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {editingId ? (lang === "bn" ? "আপডেট করুন" : "Update") : (lang === "bn" ? "তৈরি করুন" : "Create")}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          assignments.map(a => (
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
                    <span>{lang === "bn" ? "দেওয়া" : "Assigned"}: {formatDate(a.assigned_date)}</span>
                    <span>{lang === "bn" ? "জমা" : "Due"}: {formatDate(a.due_date)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {lang === "bn" ? "সর্বশেষ আপডেট" : "Last updated by"} {a.updated_by} · {formatDateTime(a.updated_at)}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => handleEdit(a)} className="p-1.5 rounded-lg hover:bg-muted"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button onClick={() => deleteMutation.mutate(a.id)} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                </div>
              </div>
            </div>
          ))
        )}

        {!isLoading && assignments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {lang === "bn" ? "কোনো অ্যাসাইনমেন্ট নেই" : "No assignments yet"}
          </div>
        )}
      </main>
    </>
  );
}
