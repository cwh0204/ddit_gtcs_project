// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    host: "0.0.0.0",
    port: 5173,
    proxy: {
      "/rest": {
        target: "http://localhost:80", // ← 그대로 유지
        changeOrigin: true,
        secure: false,
      },
      "/api": {
        target: "http://localhost:80", // ← 그대로 유지
        changeOrigin: true,
        secure: false,
      },
      "/download": {
        target: "http://localhost",
        changeOrigin: true,
      },
      "/member": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
});
