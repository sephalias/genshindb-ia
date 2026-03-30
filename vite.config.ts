import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
const defaultConfig = {
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
      // avoid generating a global .d.ts file during build to reduce plugin work
      dts: false,
    }),
    Components({
      // limit scanning to the project's components folder and only .vue files
      dirs: ["src/components"],
      extensions: ["vue"],
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [NaiveUiResolver()],
      // disable generating declaration file to reduce build time
      dts: false,
    }),
  ],
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
