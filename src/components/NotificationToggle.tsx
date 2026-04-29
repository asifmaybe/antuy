/**
 * NotificationToggle — A small bell icon button for the dashboard header.
 * Shows bell-ring when notifications are enabled, bell-off when disabled.
 * Tapping it requests permission (if needed) and toggles the preference.
 */

import { Bell, BellOff } from "lucide-react";
import { useNotifications } from "@/hooks/use-notifications";

export function NotificationToggle() {
  const { enabled, supported, toggle } = useNotifications();

  if (!supported) return null;

  return (
    <button
      onClick={toggle}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
        enabled
          ? "bg-primary/10 text-primary hover:bg-primary/20"
          : "bg-muted text-muted-foreground hover:bg-accent"
      }`}
      title={enabled ? "Notifications enabled" : "Enable notifications"}
      aria-label={enabled ? "Disable notifications" : "Enable notifications"}
    >
      {enabled ? (
        <Bell className="h-4.5 w-4.5" />
      ) : (
        <BellOff className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
