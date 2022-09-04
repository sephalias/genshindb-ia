import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
const defaultConfig = {
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
};

export default defineConfig(({ command, mode }) => {
  if (command == "serve") {
    const isDev = mode == "development";
    return {
      ...defaultConfig,
      server: {
        proxy: {
          "/api": {
            target: "https://genshin-db-api.vercel.app/api",
            changeOrigin: isDev,
            secure: !isDev,
            rewrite: (path) => path.replace(/^\/api/, ""),
          },
        },
      },
    };
  } else {
    return defaultConfig;
  }
});
