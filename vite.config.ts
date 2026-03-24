import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { intlayer, intlayerProxy } from "vite-intlayer";
import { nitro } from "nitro/vite";

const config = defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@Auth": fileURLToPath(new URL("./src/features/Auth", import.meta.url)),
      "@Properties": fileURLToPath(
        new URL("./src/features/Properties", import.meta.url),
      ),
    },
  },
  plugins: [
    intlayerProxy(),
    devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    intlayer(),
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
});

export default config;
