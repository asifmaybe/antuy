/**
 * Notification utilities for ET 23-24.
 *
 * - Web: uses the browser Notification API.
 * - Mobile (Capacitor): uses @capacitor/local-notifications.
 *
 * Supports notifications for:
 *   - New notices
 *   - New assignments
 *   - Assignment due-date reminders (24h before)
 *   - Upcoming exams (day before + same day)
 *
 * Preferences (enabled/disabled) are stored in localStorage so they
 * persist across sessions without needing a server-side table.
 */

const NOTIFICATION_PREF_KEY = "eduportal_notifications_enabled";
const DEDUP_PREFIX = "eduportal_notified_";

// ── Platform detection ──────────────────────────────────────────
const isBrowser = typeof window !== "undefined";

/** True when running inside a Capacitor native shell. */
export function isCapacitorNative(): boolean {
  if (!isBrowser) return false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return !!(win.Capacitor?.isNativePlatform?.() ?? win.Capacitor?.isNative);
}

// ── Permission helpers ──────────────────────────────────────────

/** Check if the browser/device supports notifications. */
export function supportsNotifications(): boolean {
  if (!isBrowser) return false;
  if (isCapacitorNative()) return true; // Capacitor local notifications are always available
  return "Notification" in window;
}

/** Check current permission state. */
export function getPermissionState(): NotificationPermission | "unsupported" {
  if (!isBrowser) return "unsupported";
  if (isCapacitorNative()) return "granted"; // local notifications don't need explicit permission on Android
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

/** Request notification permission from the browser. Returns the resulting state. */
export async function requestPermission(): Promise<NotificationPermission | "unsupported"> {
  if (!isBrowser) return "unsupported";

  if (isCapacitorNative()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      const result = await LocalNotifications.requestPermissions();
      return result.display === "granted" ? "granted" : "denied";
    } catch {
      // Plugin not installed — fallback
      return "granted";
    }
  }

  if (!("Notification" in window)) return "unsupported";
  const result = await Notification.requestPermission();
  return result;
}

// ── User preference (opt-in/opt-out) ────────────────────────────

export function isNotificationsEnabled(): boolean {
  if (!isBrowser) return false;
  return localStorage.getItem(NOTIFICATION_PREF_KEY) === "true";
}

export function setNotificationsEnabled(enabled: boolean): void {
  if (!isBrowser) return;
  localStorage.setItem(NOTIFICATION_PREF_KEY, enabled ? "true" : "false");
}

// ── De-duplication ──────────────────────────────────────────────

/** Check if a notification with this key has already been shown. */
function wasAlreadyNotified(key: string): boolean {
  if (!isBrowser) return true;
  return localStorage.getItem(DEDUP_PREFIX + key) === "1";
}

/** Mark a notification key as shown. */
function markNotified(key: string): void {
  if (!isBrowser) return;
  localStorage.setItem(DEDUP_PREFIX + key, "1");
}

// ── Payload types ───────────────────────────────────────────────

export interface NoticePayload {
  id: string;
  title: string;
  description: string;
  important: boolean;
}

export interface AssignmentPayload {
  id: string;
  title: string;
  subject: string;
  description: string;
  due_date: string;
}

export interface ExamPayload {
  id: string;
  subject: string;
  type: string;
  date: string;
  marks: number;
}

// ── Core notification dispatcher ────────────────────────────────

async function dispatchNotification(
  title: string,
  body: string,
  tag: string,
  urgent = false,
): Promise<void> {
  if (!isBrowser || !isNotificationsEnabled()) return;

  // De-duplicate
  if (wasAlreadyNotified(tag)) return;
  markNotified(tag);

  const trimmedBody = body.length > 140 ? body.slice(0, 137) + "..." : body;

  if (isCapacitorNative()) {
    try {
      const { LocalNotifications } = await import("@capacitor/local-notifications");
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body: trimmedBody,
            id: Math.floor(Math.random() * 2147483647),
            schedule: { at: new Date(Date.now() + 100) },
            sound: undefined,
            smallIcon: "ic_stat_icon_config_sample",
            largeIcon: "splash",
          },
        ],
      });
    } catch (err) {
      console.warn("[Notifications] Capacitor local notification failed:", err);
    }
  } else if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(title, {
        body: trimmedBody,
        icon: "/fpi-logo.png",
        badge: "/fpi-logo.png",
        tag,
        requireInteraction: urgent,
      });
    } catch (err) {
      console.warn("[Notifications] Browser notification failed:", err);
    }
  }
}

// ── Public notification triggers ────────────────────────────────

/** Notify: a new notice was posted. */
export async function showNoticeNotification(notice: NoticePayload): Promise<void> {
  const title = notice.important ? `⚠️ ${notice.title}` : `📢 ${notice.title}`;
  await dispatchNotification(title, notice.description, `notice-${notice.id}`, notice.important);
}

/** Notify: a new assignment was given. */
export async function showAssignmentNotification(assignment: AssignmentPayload): Promise<void> {
  const dueStr = formatDateShort(assignment.due_date);
  const title = `📝 New Assignment: ${assignment.title}`;
  const body = `${assignment.subject} — Due: ${dueStr}. ${assignment.description}`;
  await dispatchNotification(title, body, `assignment-new-${assignment.id}`);
}

/** Notify: an assignment is due soon (within 24 hours). */
export async function showAssignmentDueReminder(assignment: AssignmentPayload): Promise<void> {
  const dueStr = formatDateShort(assignment.due_date);
  const title = `⏰ Assignment Due Tomorrow!`;
  const body = `"${assignment.title}" (${assignment.subject}) is due on ${dueStr}. Submit soon!`;
  await dispatchNotification(title, body, `assignment-due-${assignment.id}-${assignment.due_date}`, true);
}

/** Notify: a new exam was scheduled. */
export async function showExamNotification(exam: ExamPayload): Promise<void> {
  const dateStr = formatDateShort(exam.date);
  const title = `📋 New ${exam.type} Scheduled`;
  const body = `${exam.subject} — ${exam.type} on ${dateStr}. Total marks: ${exam.marks}`;
  await dispatchNotification(title, body, `exam-new-${exam.id}`);
}

/** Notify: an exam is coming up tomorrow. */
export async function showExamReminder(exam: ExamPayload): Promise<void> {
  const dateStr = formatDateShort(exam.date);
  const title = `🔔 Exam Tomorrow!`;
  const body = `${exam.subject} ${exam.type} is on ${dateStr}. Good luck with your preparation!`;
  await dispatchNotification(title, body, `exam-remind-${exam.id}-${exam.date}`, true);
}

// ── Date helper ─────────────────────────────────────────────────

/** Format a date string (YYYY-MM-DD) to a readable short form like "Apr 30, 2026". */
function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Check if a date string (YYYY-MM-DD) is within the next N hours from now.
 * Uses Bangladesh Standard Time (UTC+6).
 */
export function isWithinHours(dateStr: string, hours: number): boolean {
  try {
    // Parse as BST midnight
    const target = new Date(dateStr + "T00:00:00+06:00").getTime();
    const now = Date.now();
    const diff = target - now;
    return diff > 0 && diff <= hours * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/**
 * Check if a date string (YYYY-MM-DD) is today in BST.
 */
export function isToday(dateStr: string): boolean {
  try {
    const nowBST = new Date(Date.now() + 6 * 60 * 60 * 1000);
    const todayStr = nowBST.toISOString().slice(0, 10);
    return dateStr === todayStr;
  } catch {
    return false;
  }
}
