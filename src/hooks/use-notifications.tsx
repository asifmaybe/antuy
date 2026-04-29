/**
 * useNotifications — React hook for managing push / browser notification
 * preferences and listening to new data via Supabase Realtime.
 *
 * Subscribes to:
 *   - notices   (INSERT) → new notice notification
 *   - assignments (INSERT) → new assignment notification
 *   - exams     (INSERT) → new exam notification
 *
 * Also runs a periodic check (every 30 min) for:
 *   - Assignments due within the next 24 hours
 *   - Exams happening tomorrow or today
 */

import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  supportsNotifications,
  isNotificationsEnabled,
  setNotificationsEnabled,
  requestPermission,
  showNoticeNotification,
  showAssignmentNotification,
  showAssignmentDueReminder,
  showExamNotification,
  showExamReminder,
  isWithinHours,
  isToday,
  type NoticePayload,
  type AssignmentPayload,
  type ExamPayload,
} from "@/lib/notifications";
import { fetchAssignments, fetchExams } from "@/lib/api";

// Check reminders every 30 minutes
const REMINDER_INTERVAL_MS = 30 * 60 * 1000;

export function useNotifications() {
  const [enabled, setEnabled] = useState(() => isNotificationsEnabled());
  const [supported] = useState(() => supportsNotifications());
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const reminderTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Toggle handler ─────────────────────────────────────────
  const toggle = useCallback(async () => {
    if (enabled) {
      // Disable
      setNotificationsEnabled(false);
      setEnabled(false);
      return;
    }

    // Enable — request permission first
    const perm = await requestPermission();
    if (perm === "denied" || perm === "unsupported") {
      // Can't enable — permission was denied
      return;
    }
    setNotificationsEnabled(true);
    setEnabled(true);
  }, [enabled]);

  // ── Realtime subscriptions (notices + assignments + exams) ──
  useEffect(() => {
    if (!enabled) {
      // Clean up existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      return;
    }

    const channel = supabase
      .channel("eduportal-realtime")
      // ─ Notices
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notices" },
        (payload) => {
          const n = payload.new as NoticePayload;
          if (n?.id && n?.title) showNoticeNotification(n);
        },
      )
      // ─ Assignments
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "assignments" },
        (payload) => {
          const a = payload.new as AssignmentPayload;
          if (a?.id && a?.title) showAssignmentNotification(a);
        },
      )
      // ─ Exams
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "exams" },
        (payload) => {
          const e = payload.new as ExamPayload;
          if (e?.id && e?.subject) showExamNotification(e);
        },
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [enabled]);

  // ── Periodic reminder check (due dates + upcoming exams) ───
  useEffect(() => {
    if (!enabled) {
      if (reminderTimerRef.current) {
        clearInterval(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
      return;
    }

    const checkReminders = async () => {
      try {
        // Check assignments due within 24 hours
        const assignments = await fetchAssignments();
        for (const a of assignments) {
          if (
            (a.status === "active" || a.status === "pending") &&
            (isWithinHours(a.due_date, 24) || isToday(a.due_date))
          ) {
            showAssignmentDueReminder(a);
          }
        }

        // Check exams happening tomorrow or today
        const exams = await fetchExams();
        for (const e of exams) {
          if (e.upcoming && (isWithinHours(e.date, 24) || isToday(e.date))) {
            showExamReminder(e);
          }
        }
      } catch (err) {
        console.warn("[Notifications] Reminder check failed:", err);
      }
    };

    // Run immediately on mount, then every 30 minutes
    checkReminders();
    reminderTimerRef.current = setInterval(checkReminders, REMINDER_INTERVAL_MS);

    return () => {
      if (reminderTimerRef.current) {
        clearInterval(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
    };
  }, [enabled]);

  return { enabled, supported, toggle };
}
