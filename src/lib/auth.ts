import { supabase, markLoginTimestamp, clearLoginTimestamp } from "./supabase";

export type UserRole = "student" | "teacher" | "cr";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  student_id?: string | null;
  subject?: string | null;
  roll_number?: number | null;
  attendance_percent?: number;
}

// ── Convert custom ID to a Supabase-compatible email ──
function idToEmail(userId: string): string {
  return `${userId.toLowerCase()}@eduportal.local`;
}

// ── Helper: wrap a promise with a timeout ──
function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms)
    ),
  ]);
}

// ── Sign in with custom ID + password ─────────────────
export async function signIn(userId: string, password: string): Promise<UserProfile> {
  const email = idToEmail(userId);

  const { data, error } = await withTimeout(
    supabase.auth.signInWithPassword({ email, password }),
    10000,
    "Sign in"
  );

  if (error) throw new Error(`Login failed`);

  const { data: profile, error: profileError } = await withTimeout(
    supabase.from("profiles").select("*").eq("id", data.user.id).single(),
    8000,
    "Fetching profile"
  );

  if (profileError) {
    throw new Error(
      `Signed in but profile not found. Please run the seed page (/seed) to create profiles.`
    );
  }

  // Mark the login timestamp for 15-day session tracking
  markLoginTimestamp();

  return profile;
}

// ── Sign up a new user ────────────────────────────────
export async function signUp(userId: string, password: string, profileData: {
  name: string;
  role: UserRole;
  student_id?: string;
  roll_number?: number;
  subject?: string;
}): Promise<UserProfile> {
  const email = idToEmail(userId);

  // Step 1: Try to create auth user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  let authUserId: string;

  if (error) {
    // If user already exists, sign in instead
    if (error.message.includes("already registered") || error.message.includes("already been registered")) {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) throw new Error(`User exists but sign-in failed: ${signInError.message}`);
      authUserId = signInData.user.id;
    } else {
      throw new Error(`Auth signup failed: ${error.message}`);
    }
  } else {
    if (!data.user) throw new Error("Signup returned no user");
    authUserId = data.user.id;

    // If user was created but session is null (email confirmation required),
    // we still have the user ID. Try to sign in to get a session.
    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        throw new Error(
          `User created but can't sign in. Please disable "Confirm email" in Supabase → Authentication → Providers → Email. Error: ${signInError.message}`
        );
      }
    }
  }

  // Step 2: Upsert profile (insert or update if exists)
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: authUserId,
      ...profileData,
    })
    .select()
    .single();

  if (profileError) {
    throw new Error(`Profile upsert failed: ${profileError.message}. You may need to run this SQL in Supabase SQL Editor: CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);`);
  }

  markLoginTimestamp();
  return profile;
}

// ── Sign out ──────────────────────────────────────────
export async function signOut() {
  clearLoginTimestamp();
  try {
    const { error } = await withTimeout(
      supabase.auth.signOut(),
      5000,
      "Sign out"
    );
    if (error) {
      // If signOut fails on the server, still clear local state
      console.warn("Supabase signOut error (local session cleared):", error.message);
    }
  } catch (err) {
    // Timeout or network error — still consider logged out locally
    console.warn("Sign out failed, clearing local session:", err);
  }
}

// ── Get current user profile ──────────────────────────
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    // First try getSession (reads from local storage, fast)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    // Then verify with getUser (hits server, slower) — with timeout
    const { data: { user }, error } = await withTimeout(
      supabase.auth.getUser(),
      5000,
      "Get user"
    );

    if (error || !user) return null;

    const { data: profile } = await withTimeout(
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      5000,
      "Get profile"
    );

    return profile;
  } catch {
    // If anything fails (timeout, network), try session-only fallback
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return null;

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      return profile;
    } catch {
      return null;
    }
  }
}

// ── Listen to auth state changes ──────────────────────
export function onAuthStateChange(
  callback: (user: UserProfile | null) => void
) {
  return supabase.auth.onAuthStateChange(async (_event, session) => {
    if (session?.user) {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        callback(profile);
      } catch {
        // Don't crash if profile fetch fails during state change
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}

// ── Demo users shown on login page ────────────────────
export interface DemoUser {
  id: string;
  password: string;
  name: string;
  role: UserRole;
  subject?: string;
}

export const demoUsers: DemoUser[] = [
  {
    id: "STU001",
    password: "student123",
    name: "Ananya Das",
    role: "student",
  },
  {
    id: "TCH001",
    password: "teacher123",
    name: "Mosharof Hosen",
    role: "teacher",
    subject: "Physics",
  },
  {
    id: "843016",
    password: "hamza3016",
    name: "Amir Hamza",
    role: "cr",
  },
];
