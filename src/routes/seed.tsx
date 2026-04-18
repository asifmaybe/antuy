import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { signUp } from "@/lib/auth";
import { Loader2, CheckCircle2, XCircle, Rocket } from "lucide-react";

export const Route = createFileRoute("/seed")({
  component: SeedPage,
});

const DEMO_USERS = [
  {
    userId: "STU001",
    password: "student123",
    profile: { name: "Asif Ahmed", role: "student" as const, student_id: "STU001", roll_number: 1 },
  },
  {
    userId: "STU002",
    password: "student123",
    profile: {
      name: "Rahim Ahmed",
      role: "student" as const,
      student_id: "STU002",
      roll_number: 2,
    },
  },
  {
    userId: "STU003",
    password: "student123",
    profile: {
      name: "Fatema Khatun",
      role: "student" as const,
      student_id: "STU003",
      roll_number: 3,
    },
  },
  {
    userId: "STU004",
    password: "student123",
    profile: { name: "Sumon Mia", role: "student" as const, student_id: "STU004", roll_number: 4 },
  },
  {
    userId: "STU005",
    password: "student123",
    profile: {
      name: "Priya Sharma",
      role: "student" as const,
      student_id: "STU005",
      roll_number: 5,
    },
  },
  {
    userId: "STU006",
    password: "student123",
    profile: {
      name: "Kamal Hossain",
      role: "student" as const,
      student_id: "STU006",
      roll_number: 6,
    },
  },
  {
    userId: "STU007",
    password: "student123",
    profile: {
      name: "Nusrat Jahan",
      role: "student" as const,
      student_id: "STU007",
      roll_number: 7,
    },
  },
  {
    userId: "STU008",
    password: "student123",
    profile: { name: "Arif Islam", role: "student" as const, student_id: "STU008", roll_number: 8 },
  },
  {
    userId: "STU009",
    password: "student123",
    profile: {
      name: "Mithila Roy",
      role: "student" as const,
      student_id: "STU009",
      roll_number: 9,
    },
  },
  {
    userId: "STU010",
    password: "student123",
    profile: {
      name: "Tanvir Hasan",
      role: "student" as const,
      student_id: "STU010",
      roll_number: 10,
    },
  },
  {
    userId: "TCH001",
    password: "teacher123",
    profile: { name: "Mosharof Hosen", role: "teacher" as const, subject: "Physics" },
  },
  {
    userId: "843016",
    password: "hamza3016",
    profile: { name: "Amir Hamza", role: "cr" as const },
  },
];

function SeedPage() {
  const [results, setResults] = useState<
    { userId: string; status: "pending" | "success" | "error"; message?: string }[]
  >([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const runSeed = async () => {
    setRunning(true);
    setResults(DEMO_USERS.map((u) => ({ userId: u.userId, status: "pending" })));

    for (let i = 0; i < DEMO_USERS.length; i++) {
      const u = DEMO_USERS[i];
      try {
        await signUp(u.userId, u.password, u.profile);
        setResults((prev) => prev.map((r, j) => (j === i ? { ...r, status: "success" } : r)));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed";
        setResults((prev) =>
          prev.map((r, j) => (j === i ? { ...r, status: "error", message } : r)),
        );
      }
      // Small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setRunning(false);
    setDone(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary mb-4">
            <Rocket className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Seed Demo Data</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            This will create {DEMO_USERS.length} demo user accounts in Supabase
          </p>
        </div>

        {results.length === 0 ? (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4">
              <h3 className="font-semibold text-sm mb-2">Users to create:</h3>
              <div className="space-y-1.5">
                {DEMO_USERS.map((u) => (
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

            <button
              onClick={runSeed}
              className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create All Users
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border bg-card p-4 space-y-2">
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
                <div className="rounded-xl border border-green-300 bg-green-50 p-3">
                  <p className="text-xs text-green-800">
                    <strong>Done!</strong> You can now go to the login page and sign in with any
                    demo account.
                  </p>
                </div>
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
                Creating users... please wait
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
