import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/lib/auth";

interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

/**
 * Protects routes based on user role.
 * - If not logged in → redirects to login page
 * - If wrong role → redirects to proper dashboard
 */
export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    // Not logged in → go to login
    if (!user) {
      navigate({ to: "/" });
      return;
    }

    // Wrong role → redirect to correct dashboard
    if (!allowedRoles.includes(user.role)) {
      if (user.role === "student") {
        navigate({ to: "/dashboard" });
      } else {
        navigate({ to: "/admin" });
      }
    }
  }, [user, loading, allowedRoles, navigate]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authorized — render nothing while redirecting
  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
