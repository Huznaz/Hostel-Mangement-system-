import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { Plugin } from "vite";

/** In admin-only dev, serve admin.html at `/` instead of `/admin.html`. */
function adminRootPlugin(enabled: boolean): Plugin {
  return {
    name: "admin-root",
    configureServer(server) {
      if (!enabled) return;
      server.middlewares.use((req, _res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (
          url === "/" ||
          (url.startsWith("/") &&
            !url.includes(".") &&
            url !== "/admin.html" &&
            !url.startsWith("/src") &&
            !url.startsWith("/@") &&
            !url.startsWith("/node_modules"))
        ) {
          req.url = "/admin.html";
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isUserMode = mode === "user";
  const isAdminMode = mode === "admin";

  const rollupInput = isUserMode
    ? { main: path.resolve(__dirname, "index.html") }
    : isAdminMode
      ? { admin: path.resolve(__dirname, "admin.html") }
      : {
          main: path.resolve(__dirname, "index.html"),
          admin: path.resolve(__dirname, "admin.html"),
        };

  return {
    server: {
      host: "::",
      port: isAdminMode ? 8081 : 8080,
      open: isAdminMode ? "/" : true,
    },
    plugins: [
      react(),
      adminRootPlugin(isAdminMode),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: rollupInput,
      },
    },
  };
});
