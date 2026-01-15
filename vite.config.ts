import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss(), svgr()],
  ssr: {
    // 确保 email 相关库只在服务端处理
    external: ["resend", "@react-email/render"],
  },
  build: {
    ssr: true,
    minify: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        format: "esm",
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 将 React 核心拆分（React 19 + DOM）
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("scheduler")
            ) {
              return "react-vendor";
            }
            // 将路由库拆分（React Router 7）
            if (id.includes("react-router") || id.includes("@remix-run")) {
              return "router-vendor";
            }
            // 将图标库单独拆分（避免阻塞核心渲染）
            if (id.includes("lucide-react")) {
              return "icons";
            }
            // 将国际化库拆分
            if (id.includes("i18next")) {
              return "i18n";
            }
            // 其他较大的第三方库
            if (id.includes("dayjs")) {
              return "utils";
            }
          }
        },
      },
    },
  },
});
