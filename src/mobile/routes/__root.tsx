import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider } from "@/hooks/use-auth";
import PullToRefresh from "react-simple-pull-to-refresh";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  ),
});

function RootComponent() {
  const handleRefresh = async () => {
    await queryClient.invalidateQueries();
    // A tiny delay makes the animation feel more natural
    await new Promise((resolve) => setTimeout(resolve, 600));
  };

  const RefreshSpinner = () => (
    <div className="flex justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
    </div>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <div className="pt-[env(safe-area-inset-top,2.5rem)] min-h-screen bg-background w-full">
            <PullToRefresh
              onRefresh={handleRefresh}
              pullingContent={""}
              refreshingContent={<RefreshSpinner />}
            >
              <Outlet />
            </PullToRefresh>
          </div>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
