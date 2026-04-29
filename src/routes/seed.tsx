import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { signUp } from "@/lib/auth";
import { Loader2, CheckCircle2, XCircle, Rocket } from "lucide-react";

export const Route = createFileRoute("/seed")({
  component: SeedPage,
});

const TEACHER_USERS = [
  { userId: "admin", password: "admin279", profile: { name: "Admin", role: "teacher" as const } },
];

const ALL_USERS = [...TEACHER_USERS];

function SeedPage() {
  const [results, setResults] = useState<
    { userId: string; status: "pending" | "success" | "error"; message?: string }[]
  >([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const createUser = async (u: (typeof ALL_USERS)[number], retries = 3): Promise<{ success: boolean; message?: string }> => {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await signUp(u.userId, u.password, u.profile);
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed";
        if (message.includes("rate limit") || message.includes("Rate limit")) {
          // Wait longer on each retry: 8s, 16s, 32s
          const waitTime = Math.pow(2, attempt + 3) * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
        return { success: false, message };
      }
    }
    return { success: false, message: "Rate limit — max retries exceeded" };
  };

  const runSeed = async (onlyFailed = false) => {
    setRunning(true);
    setDone(false);

    const usersToProcess = onlyFailed
      ? ALL_USERS.filter((_, i) => results[i]?.status === "error")
      : ALL_USERS;

    if (!onlyFailed) {
      setResults(ALL_USERS.map((u) => ({ userId: u.userId, status: "pending" })));
    } else {
      // Reset failed ones to pending
      setResults((prev) =>
        prev.map((r) => (r.status === "error" ? { ...r, status: "pending", message: undefined } : r)),
      );
    }

    setProgress({ current: 0, total: usersToProcess.length });

    for (let k = 0; k < usersToProcess.length; k++) {
      const u = usersToProcess[k];
      const i = ALL_USERS.findIndex((au) => au.userId === u.userId);

      const result = await createUser(u);
      setResults((prev) =>
        prev.map((r, j) =>
          j === i
            ? { ...r, status: result.success ? "success" : "error", message: result.message }
            : r,
        ),
      );
      setProgress({ current: k + 1, total: usersToProcess.length });

      // 4-second delay between each signup to avoid rate limits
      if (k < usersToProcess.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 4000));
      }
    }

    setRunning(false);
    setDone(true);
  };

  const failedCount = results.filter((r) => r.status === "error").length;
  const successCount = results.filter((r) => r.status === "success").length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <Rocket className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Seed Student Data</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            This will create {ALL_USERS.length} user accounts in Supabase
          </p>
        </div>

        {results.length === 0 ? (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
              <h3 className="font-semibold text-sm mb-2">Users to create:</h3>
              <div className="space-y-1.5">
                {ALL_USERS.map((u) => (
                  <div key={u.userId} className="flex items-center justify-between text-xs">
                    <span className="font-mono">{u.userId}</span>
                    <span className="text-muted-foreground">
                      {u.profile.name} ({u.profile.role})
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3">
              <p className="text-xs text-yellow-800">
                <strong>Important:</strong> Make sure you've disabled "Confirm email" in Supabase →
                Authentication → Providers → Email before running this.
              </p>
            </div>

            <div className="rounded-xl border border-blue-300 bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> This will take ~4 minutes due to Supabase rate limits
                (4 seconds between each signup). Failed signups will auto-retry up to 3 times.
              </p>
            </div>

            <button
              onClick={() => runSeed(false)}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create All Users
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Progress bar */}
            {running && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress: {progress.current}/{progress.total}</span>
                  <span>{successCount} created, {failedCount} failed</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}

            <div className="rounded-xl border bg-card p-4 space-y-2" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {results.map((r) => (
                <div key={r.userId} className="flex items-center justify-between">
                  <span className="text-sm font-mono">{r.userId}</span>
                  <div className="flex items-center gap-1.5">
                    {r.status === "pending" && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {r.status === "success" && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    {r.status === "error" && (
                      <span className="flex items-center gap-1 text-xs text-destructive">
                        <XCircle className="h-4 w-4" />
                        {r.message}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {done && (
              <div className="space-y-3">
                {failedCount > 0 ? (
                  <>
                    <div className="rounded-xl border border-yellow-300 bg-yellow-50 p-3">
                      <p className="text-xs text-yellow-800">
                        <strong>{successCount} created, {failedCount} failed.</strong> Click
                        "Retry Failed" to try the failed ones again.
                      </p>
                    </div>
                    <button
                      onClick={() => runSeed(true)}
                      className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Retry Failed ({failedCount})
                    </button>
                  </>
                ) : (
                  <div className="rounded-xl border border-green-300 bg-green-50 p-3">
                    <p className="text-xs text-green-800">
                      <strong>All done!</strong> All {successCount} accounts created successfully.
                      You can now log in with Board Roll + password.
                    </p>
                  </div>
                )}
                <a
                  href="/"
                  className="block w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground text-center transition-opacity hover:opacity-90"
                >
                  Go to Login
                </a>
              </div>
            )}

            {running && (
              <p className="text-xs text-muted-foreground text-center">
                Creating users... ~4s per user, please wait
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
