import { defineConfig } from "@tanstack/react-start/config";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  tsr: {
    appDirectory: "src",
    routesDirectory: "src/routes",
    generatedRouteTree: "src/routeTree.gen.ts",
    quoteStyle: "double",
    semicolons: true,
  },
  vite: {
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
    ],
  },
  server: {
    preset: "netlify",
  },
});
