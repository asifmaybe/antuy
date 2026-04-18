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
  },
  server: {
    port: 5174,
  },
});
