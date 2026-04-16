import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Eye, EyeOff, Info } from "lucide-react";
import { authenticateUser, demoUsers } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "EduPortal — Login" },
      { name: "description", content: "Sign in to EduPortal College Academic Management System" },
    ],
  }),
});

function LoginPage() {
  const [tab, setTab] = useState<"student" | "teacher">("student");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = authenticateUser(id, password);
    if (!user) {
      setError("Invalid ID or password. Try a demo account below.");
      return;
    }
    // Store in sessionStorage for now
    sessionStorage.setItem("eduportal_user", JSON.stringify(user));
    if (user.role === "teacher" || user.role === "cr") {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  const fillDemo = (userId: string, pass: string) => {
    setId(userId);
    setPassword(pass);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4">
            <GraduationCap className="h-9 w-9 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">EduPortal</h1>
          <p className="text-sm text-muted-foreground">College Academic Management</p>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-muted p-1 mb-6">
          <button
            onClick={() => setTab("student")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              tab === "student" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Student
          </button>
          <button
            onClick={() => setTab("teacher")}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-colors ${
              tab === "teacher" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Teacher / CR
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder={tab === "student" ? "Student ID (e.g. STU001)" : "Teacher / CR ID"}
            value={id}
            onChange={(e) => { setId(e.target.value); setError(""); }}
            className="w-full rounded-xl border bg-card px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              className="w-full rounded-xl border bg-card px-4 py-3.5 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          {error && <p className="text-xs text-destructive text-center">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Forgot password? Contact your admin.
        </p>

        {/* Demo accounts toggle */}
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="mt-4 flex items-center justify-center gap-1.5 w-full text-xs text-primary font-medium"
        >
          <Info className="h-3.5 w-3.5" />
          {showDemo ? "Hide demo accounts" : "Show demo accounts"}
        </button>

        {showDemo && (
          <div className="mt-3 rounded-xl border bg-card p-3 space-y-2">
            {demoUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => fillDemo(user.id, user.password)}
                className="flex w-full items-center justify-between rounded-lg bg-muted px-3 py-2.5 text-left transition-colors hover:bg-accent active:scale-[0.98]"
              >
                <div>
                  <p className="text-xs font-semibold">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{user.role === "cr" ? "Class Representative" : user.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-foreground">{user.id}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">{user.password}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2025 EduPortal. Built for academic excellence.
        </p>
      </div>
    </div>
  );
}
