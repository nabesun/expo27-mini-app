import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/*.png", "icons/*.svg"],
      manifest: {
        name: "GREEN×EXPO 2027 らくらくガイド",
        short_name: "花博ガイド",
        description: "来場時に必要な情報だけを集約した軽量ガイド",
        theme_color: "#2d7a4f",
        background_color: "#f0f7f0",
        display: "standalone",
        start_url: "/",
        lang: "ja",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            // MT生成JSON: NetworkFirst（5秒タイムアウト後はキャッシュ）
            urlPattern: /\/api\/.*\.json$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "mt-json-cache",
              networkTimeoutSeconds: 5,
              expiration: { maxAgeSeconds: 60 * 60 * 2 }, // 2時間
            },
          },
          {
            // モックJSON: CacheFirst（開発用）
            urlPattern: /\/mock\/.*\.json$/,
            handler: "CacheFirst",
            options: {
              cacheName: "mock-json-cache",
              expiration: { maxAgeSeconds: 60 * 60 }, // 1時間
            },
          },
          {
            // Open-Meteo天気: StaleWhileRevalidate（30分TTL）
            urlPattern: /^https:\/\/api\.open-meteo\.com\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "weather-cache",
              expiration: { maxAgeSeconds: 60 * 30 },
            },
          },
        ],
        globPatterns: ["**/*.{js,css,html,ico,png,svg}", "mock/*.json"],
      },
    }),
  ],
});
