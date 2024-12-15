import path from "node:path";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

export default defineConfig({
  plugins: [
    electron({
      main: {
        entry: "electron-main.js",
        vite: {
          build: {
            outDir: "dist-electron/main",
            rollupOptions: {
              external: [
                // ...external dependencies...
              ],
            },
          },
        },
      },
      preload: {
        input: {
          preload: path.join(__dirname, "preload.js"),
        },
        vite: {
          build: {
            outDir: "dist-electron/preload",
          },
        },
      },
    }),
  ],
});
