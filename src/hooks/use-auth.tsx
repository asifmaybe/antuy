import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { type UserProfile, getCurrentUser, onAuthStateChange, signIn, signOut } from "@/lib/auth";

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Maximum time (ms) to wait for initial auth check before giving up */
const AUTH_INIT_TIMEOUT_MS = 6000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // Track manual login/logout in progress to avoid race with onAuthStateChange
  const manualActionRef = useRef(false);
  // Prevent double-setting loading to false
  const loadingResolvedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    const resolveLoading = (profile: UserProfile | null) => {
      if (!mounted || loadingResolvedRef.current) return;
      loadingResolvedRef.current = true;
      setUser(profile);
      setLoading(false);
    };

    // Hard safety timeout — if auth check hangs (network, stale token, etc.),
    // force loading to false so the app never stays stuck on a white screen.
    const safetyTimer = setTimeout(() => {
      if (!loadingResolvedRef.current) {
        console.warn("[AuthProvider] Auth init timed out, falling back to logged-out state");
        resolveLoading(null);
      }
    }, AUTH_INIT_TIMEOUT_MS);

    // Fetch current user on mount
    getCurrentUser()
      .then((profile) => {
        resolveLoading(profile);
      })
      .catch((err) => {
        console.warn("[AuthProvider] getCurrentUser failed:", err);
        resolveLoading(null);
      });

    // Listen for auth changes (other tabs, token refresh, etc.)
    const {
      data: { subscription },
    } = onAuthStateChange((profile) => {
      // Skip if a manual login/logout is in progress — it will set state itself
      if (manualActionRef.current) return;
      if (mounted) setUser(profile);
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    manualActionRef.current = true;
    try {
      const profile = await signIn(email, password);
      setUser(profile);
      return profile;
    } finally {
      // Small delay to let onAuthStateChange fire and be ignored
      setTimeout(() => {
        manualActionRef.current = false;
      }, 500);
    }
  }, []);

  const logout = useCallback(async () => {
    manualActionRef.current = true;
    try {
      await signOut();
      setUser(null);
    } catch {
      // signOut should never throw now, but just in case
      setUser(null);
    } finally {
      setTimeout(() => {
        manualActionRef.current = false;
      }, 500);
    }
  }, []);

  return <AuthContext value={{ user, loading, login, logout }}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
