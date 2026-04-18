/**
 * Date formatting utilities — locked to Bangladesh Standard Time (BST, UTC+6).
 * All date display in the app flows through these helpers so timezone is consistent.
 */

const BST_TIMEZONE = "Asia/Dhaka";

/** Format a date string as "Apr 18" style (short month + day) */
export function formatShortDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: BST_TIMEZONE,
  });
}

/** Format a date string as "Apr 18, 2026" style (short month + day + year) */
export function formatFullDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: BST_TIMEZONE,
  });
}

/** Format a date string as a full date + time string in BST, e.g. "4/18/2026, 5:18:20 PM" */
export function formatDateTime(d: string): string {
  return new Date(d).toLocaleString("en-US", {
    timeZone: BST_TIMEZONE,
  });
}

/** Get today's date as YYYY-MM-DD in BST */
export function todayBST(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: BST_TIMEZONE,
  }); // en-CA gives YYYY-MM-DD format
}

/** Get the current Date object adjusted for display purposes */
export function nowBST(): Date {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: BST_TIMEZONE })
  );
}

/** Formats a raw time string (e.g. 19:57:48.910923) into 12-hour "7:57 PM" format */
export function formatTime12Hour(timeString: string | null | undefined): string {
  if (!timeString) return "";
  const parts = timeString.split(":");
  if (parts.length < 2) return timeString;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  return `${hours}:${minutes} ${ampm}`;
}
