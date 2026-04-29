-- ============================================================
-- Enable Supabase Realtime on notices, assignments, and exams
-- Run this in Supabase → SQL Editor → New query
-- ============================================================

-- Add all three tables to the supabase_realtime publication.
-- This allows the Supabase JS client to subscribe to INSERT/UPDATE/DELETE
-- events via .channel().on('postgres_changes', ...).

ALTER PUBLICATION supabase_realtime ADD TABLE notices;
ALTER PUBLICATION supabase_realtime ADD TABLE assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE exams;

-- ============================================================
-- ✅ DONE! The notices, assignments, and exams tables are now
-- part of the realtime publication.
--
-- Notifications triggered:
--   • New notice INSERT   → "📢 New Notice" notification
--   • New assignment INSERT → "📝 New Assignment" notification
--   • New exam INSERT     → "📋 New Exam Scheduled" notification
--
-- Additionally, the app checks every 30 minutes for:
--   • Assignments due within 24 hours → "⏰ Due Tomorrow" reminder
--   • Exams happening tomorrow/today  → "🔔 Exam Tomorrow" reminder
-- ============================================================
