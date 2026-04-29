import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

// Mobile SPA build — used by Capacitor.
// Shares components, hooks, and lib code from src/ with the web app.
// Does NOT use TanStack Start (no SSR) — purely client-side.
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "./src/mobile/routes",
      generatedRouteTree: "./src/mobile/routeTree.gen.ts",
      quoteStyle: "double",
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-query"],
  },
  build: {
    outDir: "dist-mobile",
    emptyOutDir: true,
    sourcemap: false,
    // Target modern browsers for smaller bundle size
    target: "es2020",
    // Optimize chunk splitting for faster initial load
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-router": ["@tanstack/react-router"],
          "vendor-query": ["@tanstack/react-query"],
          "vendor-supabase": ["@supabase/supabase-js"],
          "vendor-ui": ["lucide-react", "sonner"],
        },
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
    cssMinify: true,
    minify: "esbuild",
  },
  server: {
    port: 5174,
  },
});
