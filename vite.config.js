import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { apiDevServer } from "./scripts/api-dev-server.js";

export default defineConfig(({ mode }) => {
  // expose .env.local to the local API handlers (never to the browser bundle)
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    server: { port: 5173, host: true },
    preview: { port: 4173, host: true },
    build: { chunkSizeWarningLimit: 1500 },
    plugins: [
      apiDevServer(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["icons/*.png", "packs/*.json"],
        manifest: {
          name: "Scrollege",
          short_name: "Scrollege",
          description: "Doomscrolling, but you actually pass. Your notes become a feed that fits your brain.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          orientation: "any",
          background_color: "#cfe6f7",
          theme_color: "#cfe6f7",
          categories: ["education"],
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,png,svg,woff2,json}"],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            { urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, handler: "StaleWhileRevalidate",
              options: { cacheName: "fonts", expiration: { maxEntries: 30 } } },
          ],
        },
        devOptions: { enabled: false },
      }),
    ],
  };
});
