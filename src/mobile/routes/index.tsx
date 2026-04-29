import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "ET 23-24 — Login" },
      { name: "description", content: "Sign in to ET 23-24 College Academic Management System" },
    ],
  }),
});

function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading: authLoading, login } = useAuth();
  const loginAbortRef = useRef(false);

  // Auto-redirect if already logged in (persisted session)
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      if (user.role === "teacher" || user.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/dashboard" });
      }
    }
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent double-submit
    setError("");
    setLoading(true);
    loginAbortRef.current = false;

    // Safety timeout: if login takes more than 15s, unblock the button
    const safetyTimer = setTimeout(() => {
      loginAbortRef.current = true;
      setLoading(false);
      setError("Login is taking too long. Please check your connection and try again.");
    }, 15000);

    try {
      const profile = await login(id, password);
      queryClient.clear(); // Clear cached [] arrays from auth transition states
      clearTimeout(safetyTimer);
      if (loginAbortRef.current) return;

      if (profile.role === "teacher" || profile.role === "admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      clearTimeout(safetyTimer);
      if (loginAbortRef.current) return;
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      clearTimeout(safetyTimer);
      if (!loginAbortRef.current) {
        setLoading(false);
      }
    }
  };



  // Show a loading spinner while checking for existing session
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If already logged in, show nothing while redirecting
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary mb-4 overflow-hidden">
            <img src="/fpi-logo.png" alt="Logo" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold">Electrial 23-24</h1>
          <p className="text-sm text-muted-foreground">College Academic Management</p>
        </div>



        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Board Roll (e.g. 842943)"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setError("");
            }}
            className="w-full rounded-xl border bg-card px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
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
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Forgot password? Contact your admin.
        </p>



        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2026 Electrial, FPI - Built for academic excellence.
        </p>
      </div>
    </div>
  );
}
