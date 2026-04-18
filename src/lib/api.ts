import { supabase } from "./supabase";

// ── Types ────────────────────────────────────────────────
export interface Profile {
  id: string;
  name: string;
  role: "student" | "teacher" | "cr";
  student_id: string | null;
  roll_number: number | null;
  subject: string | null;
  attendance_percent: number;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  author: string;
  important: boolean;
  created_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  assigned_date: string;
  due_date: string;
  status: "active" | "completed" | "overdue" | "pending" | "submitted";
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: string;
  subject: string;
  type: "Class Test" | "Quiz" | "Mid-Term" | "Final";
  date: string;
  marks: number;
  instructions: string;
  upcoming: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface AttendanceSession {
  id: string;
  date: string;
  time: string;
  subject: string;
  is_online_marking_active: boolean;
  marked_by: string;
  created_at: string;
  records?: AttendanceRecord[];
}

export interface AttendanceRecord {
  id: string;
  session_id: string;
  student_id: string;
  student_name: string;
  status: "present" | "absent" | "late";
  remarks: string;
  created_at: string;
}

export interface Result {
  id: string;
  student_id: string;
  student_name: string;
  subject: string;
  exam_type: "Class Test" | "Quiz" | "Mid-Term" | "Final";
  marks: number;
  total_marks: number;
  date: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface RoutineEntry {
  id: string;
  day: string;
  time_slot: string;
  subject: string;
  teacher: string;
  hall: string;
  sort_order: number;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performed_by: string;
  subject: string | null;
  details: string;
  created_at: string;
}

// ── Notices ──────────────────────────────────────────────
export async function fetchNotices(): Promise<Notice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createNotice(notice: {
  title: string;
  description: string;
  author: string;
  important: boolean;
}) {
  const { data, error } = await supabase.from("notices").insert(notice).select().single();

  if (error) throw error;
  return data;
}

export async function updateNotice(id: string, updates: Partial<Notice>) {
  const { data, error } = await supabase
    .from("notices")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNotice(id: string) {
  const { error } = await supabase.from("notices").delete().eq("id", id);
  if (error) throw error;
}

// ── Assignments ──────────────────────────────────────────
export async function fetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("due_date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createAssignment(assignment: {
  title: string;
  subject: string;
  description: string;
  assigned_date?: string;
  due_date: string;
  created_by: string;
  updated_by: string;
}) {
  const { data, error } = await supabase.from("assignments").insert(assignment).select().single();

  if (error) throw error;
  return data;
}

export async function updateAssignment(id: string, updates: Partial<Assignment>) {
  const { data, error } = await supabase
    .from("assignments")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteAssignment(id: string) {
  const { error } = await supabase.from("assignments").delete().eq("id", id);
  if (error) throw error;
}

// ── Exams ────────────────────────────────────────────────
export async function fetchExams(): Promise<Exam[]> {
  const { data, error } = await supabase
    .from("exams")
    .select("*")
    .order("date", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createExam(exam: {
  subject: string;
  type: string;
  date: string;
  marks: number;
  instructions: string;
  upcoming?: boolean;
  created_by: string;
  updated_by: string;
}) {
  const { data, error } = await supabase.from("exams").insert(exam).select().single();

  if (error) throw error;
  return data;
}

export async function updateExam(id: string, updates: Partial<Exam>) {
  const { data, error } = await supabase
    .from("exams")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteExam(id: string) {
  const { error } = await supabase.from("exams").delete().eq("id", id);
  if (error) throw error;
}

// ── Attendance ───────────────────────────────────────────
export async function fetchAttendanceRecordsForStudent(
  studentId: string,
): Promise<
  (AttendanceRecord & { session: Pick<AttendanceSession, "date" | "time" | "subject"> })[]
> {
  const { data, error } = await supabase
    .from("attendance_records")
    .select(
      `
      *,
      session:attendance_sessions(date, time, subject)
    `,
    )
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAttendanceSessions(): Promise<AttendanceSession[]> {
  const { data, error } = await supabase
    .from("attendance_sessions")
    .select(
      `
      *,
      records:attendance_records(*)
    `,
    )
    .order("date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createAttendanceSession(session: {
  subject: string;
  marked_by: string;
  is_online_marking_active: boolean;
}) {
  const { data, error } = await supabase
    .from("attendance_sessions")
    .insert(session)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createAttendanceRecords(
  records: {
    session_id: string;
    student_id: string;
    student_name: string;
    status: "present" | "absent" | "late";
    remarks: string;
  }[],
) {
  const { error } = await supabase.from("attendance_records").insert(records);

  if (error) throw error;
}

// ── Results ──────────────────────────────────────────────
export async function fetchResultsForStudent(studentId: string): Promise<Result[]> {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .eq("student_id", studentId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchAllResults(): Promise<Result[]> {
  const { data, error } = await supabase
    .from("results")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createResult(result: {
  student_id: string;
  student_name: string;
  subject: string;
  exam_type: string;
  marks: number;
  total_marks: number;
  date: string;
  uploaded_by: string;
}) {
  const { data, error } = await supabase.from("results").insert(result).select().single();

  if (error) throw error;
  return data;
}

// ── Routine ──────────────────────────────────────────────
export async function fetchRoutine() {
  const { data, error } = await supabase
    .from("routine")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  // Group by day (same shape as mockRoutine)
  const dayOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const grouped: Record<string, RoutineEntry[]> = {};

  for (const row of data ?? []) {
    if (!grouped[row.day]) grouped[row.day] = [];
    grouped[row.day].push(row);
  }

  return dayOrder
    .filter((day) => grouped[day])
    .map((day) => ({
      day,
      periods: grouped[day].map((p) => ({
        time: p.time_slot,
        subject: p.subject,
        teacher: p.teacher,
        hall: p.hall,
      })),
    }));
}

// ── Profiles / Students ─────────────────────────────────
export async function fetchStudentsList(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("roll_number", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchCurrentProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  if (error) throw error;
  return data;
}

// ── Audit Log ────────────────────────────────────────────
export async function fetchAuditLog(): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function logAuditEntry(entry: {
  action: string;
  performed_by: string;
  subject?: string;
  details: string;
}) {
  const { error } = await supabase.from("audit_log").insert(entry);
  if (error) throw error;
}
