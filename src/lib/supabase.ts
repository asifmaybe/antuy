import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables"
  );
}

// 15 days in milliseconds
const SESSION_MAX_AGE_MS = 15 * 24 * 60 * 60 * 1000;
const LOGIN_TIMESTAMP_KEY = "eduportal_login_timestamp";

const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

/**
 * No-op storage for SSR (server-side rendering).
 * On the server, there's no localStorage, so we use an in-memory no-op.
 */
const noopStorage: Storage = {
  get length() { return 0; },
  clear() {},
  key() { return null; },
  getItem() { return null; },
  setItem() {},
  removeItem() {},
};

/**
 * Custom storage wrapper that enforces a 15-day session expiry.
 * When reading the auth token, it checks if the login timestamp
 * has exceeded 15 days — if so, it clears the session.
 */
const sessionAwareStorage: Storage = isBrowser
  ? {
      get length() {
        return localStorage.length;
      },
      clear() {
        localStorage.clear();
      },
      key(index: number) {
        return localStorage.key(index);
      },
      getItem(key: string): string | null {
        // Only check expiry for Supabase auth keys
        if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
          const loginTimestamp = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
          if (loginTimestamp) {
            const elapsed = Date.now() - parseInt(loginTimestamp, 10);
            if (elapsed > SESSION_MAX_AGE_MS) {
              // Session expired — clear it
              localStorage.removeItem(key);
              localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
              return null;
            }
          }
        }
        return localStorage.getItem(key);
      },
      setItem(key: string, value: string) {
        localStorage.setItem(key, value);
      },
      removeItem(key: string) {
        localStorage.removeItem(key);
        // Also clear login timestamp when auth token is removed (logout)
        if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
          localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
        }
      },
    }
  : noopStorage;

/** Mark the current timestamp as the login time (call on successful login). */
export function markLoginTimestamp() {
  if (isBrowser) {
    localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
  }
}

/** Clear the login timestamp (call on logout). */
export function clearLoginTimestamp() {
  if (isBrowser) {
    localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: isBrowser,
    storage: sessionAwareStorage,
    autoRefreshToken: isBrowser,
    detectSessionInUrl: isBrowser,
  },
});
