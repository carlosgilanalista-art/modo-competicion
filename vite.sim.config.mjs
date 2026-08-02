// Config temporal SOLO para el script de validación por consola (Fase 3/5).
// No se usa en el build de producción (npm run build usa vite.config.js).
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist-sim",
    lib: {
      entry: path.resolve(__dirname, "src/App.jsx"),
      formats: ["es"],
      fileName: () => "App.js",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
    },
    minify: false,
  },
});
