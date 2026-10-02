import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), react()],
  // three.js is lazily imported by ScrollObject, so its large chunk never blocks first paint.
  build: { chunkSizeWarningLimit: 800 },
});
