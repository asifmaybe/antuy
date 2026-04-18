-- ============================================================
-- EduPortal — Complete Supabase Database Setup
-- Run this ENTIRE script in Supabase → SQL Editor → New query
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'cr')),
  student_id TEXT,
  roll_number INTEGER,
  subject    TEXT,
  attendance_percent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read profiles" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);


-- ── 2. NOTICES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notices (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date        DATE DEFAULT CURRENT_DATE,
  time        TEXT DEFAULT to_char(now(), 'HH12:MI AM'),
  author      TEXT NOT NULL DEFAULT '',
  important   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read notices" ON notices;
  DROP POLICY IF EXISTS "Authenticated can insert notices" ON notices;
  DROP POLICY IF EXISTS "Authenticated can update notices" ON notices;
  DROP POLICY IF EXISTS "Authenticated can delete notices" ON notices;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read notices" ON notices
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert notices" ON notices
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update notices" ON notices
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete notices" ON notices
  FOR DELETE TO authenticated USING (true);


-- ── 3. ASSIGNMENTS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  subject       TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  assigned_date DATE DEFAULT CURRENT_DATE,
  due_date      DATE NOT NULL,
  status        TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'overdue', 'pending', 'submitted')),
  created_by    TEXT DEFAULT '',
  updated_by    TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read assignments" ON assignments;
  DROP POLICY IF EXISTS "Authenticated can insert assignments" ON assignments;
  DROP POLICY IF EXISTS "Authenticated can update assignments" ON assignments;
  DROP POLICY IF EXISTS "Authenticated can delete assignments" ON assignments;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read assignments" ON assignments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert assignments" ON assignments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update assignments" ON assignments
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete assignments" ON assignments
  FOR DELETE TO authenticated USING (true);


-- ── 4. EXAMS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exams (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject      TEXT NOT NULL DEFAULT '',
  type         TEXT NOT NULL CHECK (type IN ('Class Test', 'Quiz', 'Mid-Term', 'Final')),
  date         DATE NOT NULL,
  marks        INTEGER NOT NULL DEFAULT 0,
  instructions TEXT DEFAULT '',
  upcoming     BOOLEAN DEFAULT true,
  created_by   TEXT DEFAULT '',
  updated_by   TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read exams" ON exams;
  DROP POLICY IF EXISTS "Authenticated can insert exams" ON exams;
  DROP POLICY IF EXISTS "Authenticated can update exams" ON exams;
  DROP POLICY IF EXISTS "Authenticated can delete exams" ON exams;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read exams" ON exams
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert exams" ON exams
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated can update exams" ON exams
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can delete exams" ON exams
  FOR DELETE TO authenticated USING (true);


-- ── 5. ATTENDANCE SESSIONS ──────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date                     DATE DEFAULT CURRENT_DATE,
  time                     TEXT DEFAULT to_char(now(), 'HH12:MI AM'),
  subject                  TEXT NOT NULL DEFAULT '',
  is_online_marking_active BOOLEAN DEFAULT false,
  marked_by                TEXT DEFAULT '',
  created_at               TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read attendance_sessions" ON attendance_sessions;
  DROP POLICY IF EXISTS "Authenticated can insert attendance_sessions" ON attendance_sessions;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read attendance_sessions" ON attendance_sessions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert attendance_sessions" ON attendance_sessions
  FOR INSERT TO authenticated WITH CHECK (true);


-- ── 6. ATTENDANCE RECORDS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance_records (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id   TEXT NOT NULL,
  student_name TEXT NOT NULL DEFAULT '',
  status       TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  remarks      TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read attendance_records" ON attendance_records;
  DROP POLICY IF EXISTS "Authenticated can insert attendance_records" ON attendance_records;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read attendance_records" ON attendance_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert attendance_records" ON attendance_records
  FOR INSERT TO authenticated WITH CHECK (true);


-- ── 7. RESULTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS results (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   TEXT NOT NULL,
  student_name TEXT NOT NULL DEFAULT '',
  subject      TEXT NOT NULL DEFAULT '',
  exam_type    TEXT NOT NULL CHECK (exam_type IN ('Class Test', 'Quiz', 'Mid-Term', 'Final')),
  marks        INTEGER NOT NULL DEFAULT 0,
  total_marks  INTEGER NOT NULL DEFAULT 100,
  date         DATE DEFAULT CURRENT_DATE,
  uploaded_by  TEXT DEFAULT '',
  uploaded_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read results" ON results;
  DROP POLICY IF EXISTS "Authenticated can insert results" ON results;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read results" ON results
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert results" ON results
  FOR INSERT TO authenticated WITH CHECK (true);


-- ── 8. ROUTINE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS routine (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day        TEXT NOT NULL,
  time_slot  TEXT NOT NULL,
  subject    TEXT NOT NULL DEFAULT '',
  teacher    TEXT NOT NULL DEFAULT '',
  hall       TEXT NOT NULL DEFAULT '',
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE routine ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read routine" ON routine;
  DROP POLICY IF EXISTS "Authenticated can manage routine" ON routine;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read routine" ON routine
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can manage routine" ON routine
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ── 9. AUDIT LOG ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action       TEXT NOT NULL,
  performed_by TEXT NOT NULL DEFAULT '',
  subject      TEXT,
  details      TEXT DEFAULT '',
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Anyone can read audit_log" ON audit_log;
  DROP POLICY IF EXISTS "Authenticated can insert audit_log" ON audit_log;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Anyone can read audit_log" ON audit_log
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can insert audit_log" ON audit_log
  FOR INSERT TO authenticated WITH CHECK (true);


-- ── 10. SAMPLE ROUTINE DATA (optional) ──────────────────────
-- Insert some sample class routine entries if the table is empty
INSERT INTO routine (day, time_slot, subject, teacher, hall, sort_order)
SELECT * FROM (VALUES
  ('Sunday',    '09:00 - 10:00', 'Physics',      'Mosharof Hosen', 'Room 301', 1),
  ('Sunday',    '10:00 - 11:00', 'Mathematics',   'Ariful Haque',   'Room 302', 2),
  ('Sunday',    '11:30 - 12:30', 'Chemistry',     'Nasrin Akhter',  'Lab 1',    3),
  ('Monday',    '09:00 - 10:00', 'English',       'Rashida Begum',  'Room 201', 4),
  ('Monday',    '10:00 - 11:00', 'Physics',       'Mosharof Hosen', 'Room 301', 5),
  ('Monday',    '11:30 - 12:30', 'Computer Sci.', 'Kamrul Islam',   'Lab 2',    6),
  ('Tuesday',   '09:00 - 10:00', 'Mathematics',   'Ariful Haque',   'Room 302', 7),
  ('Tuesday',   '10:00 - 11:00', 'Chemistry',     'Nasrin Akhter',  'Room 303', 8),
  ('Wednesday', '09:00 - 10:00', 'Physics',       'Mosharof Hosen', 'Room 301', 9),
  ('Wednesday', '10:00 - 11:00', 'English',       'Rashida Begum',  'Room 201', 10),
  ('Thursday',  '09:00 - 10:00', 'Computer Sci.', 'Kamrul Islam',   'Lab 2',    11),
  ('Thursday',  '10:00 - 11:00', 'Mathematics',   'Ariful Haque',   'Room 302', 12)
) AS v(day, time_slot, subject, teacher, hall, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM routine LIMIT 1);


-- ============================================================
-- ✅ DONE! All tables, RLS policies, and sample data created.
-- Now go to your app and try logging in.
-- ============================================================
