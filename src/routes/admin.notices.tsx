import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, X, Star, StarOff } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { type AdminNotice } from "@/lib/admin-data";
import { mockNotices } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/notices")({
  component: AdminNoticesPage,
  head: () => ({
    meta: [{ title: "Manage Notices — EduPortal Admin" }],
  }),
});

function AdminNoticesPage() {
  const { lang } = useLanguage();
  const [notices, setNotices] = useState<AdminNotice[]>(
    mockNotices.map(n => ({ ...n, createdAt: `${n.date} ${n.time}` }))
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", important: false });

  const user = (() => {
    try { return JSON.parse(sessionStorage.getItem("eduportal_user") || "{}"); } catch { return {}; }
  })();

  const handleSave = () => {
    if (!form.title || !form.description) return;
    const now = new Date();
    const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const time = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
    const newNotice: AdminNotice = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      date,
      time,
      author: user.name || "Admin",
      important: form.important,
      createdAt: `${date} ${time}`,
    };
    setNotices(prev => [newNotice, ...prev]);
    setForm({ title: "", description: "", important: false });
    setShowForm(false);
  };

  const toggleImportant = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, important: !n.important } : n));
  };

  return (
    <>
      <header className="px-4 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{lang === "bn" ? "বিজ্ঞপ্তি ব্যবস্থাপনা" : "Notice Management"}</h1>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-1" /> {lang === "bn" ? "নতুন" : "New"}
          </Button>
        </div>
      </header>

      <main className="px-4 space-y-4">
        {showForm && (
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{lang === "bn" ? "নতুন বিজ্ঞপ্তি" : "New Notice"}</h3>
              <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">{lang === "bn" ? "শিরোনাম" : "Title"}</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Notice title" />
              </div>
              <div>
                <Label className="text-xs">{lang === "bn" ? "বিবরণ" : "Description"}</Label>
                <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Notice details..." />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.important}
                  onChange={e => setForm(f => ({ ...f, important: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-xs">{lang === "bn" ? "গুরুত্বপূর্ণ হিসেবে চিহ্নিত করুন" : "Mark as important"}</span>
              </label>
            </div>
            <Button onClick={handleSave} className="w-full">{lang === "bn" ? "প্রকাশ করুন" : "Publish Notice"}</Button>
          </div>
        )}

        <div className="space-y-2">
          {notices.map(n => (
            <div key={n.id} className={`rounded-xl border bg-card p-4 ${n.important ? "border-destructive/30" : ""}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {n.important && <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />}
                    <h3 className="font-semibold text-sm truncate">{n.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{n.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {n.author} · {n.date} · {n.time}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleImportant(n.id)} className="p-1.5 rounded-lg hover:bg-muted">
                    {n.important ? <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" /> : <StarOff className="h-3.5 w-3.5 text-muted-foreground" />}
                  </button>
                  <button onClick={() => setNotices(prev => prev.filter(x => x.id !== n.id))} className="p-1.5 rounded-lg hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {notices.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {lang === "bn" ? "কোনো বিজ্ঞপ্তি নেই" : "No notices yet"}
          </div>
        )}
      </main>
    </>
  );
}
