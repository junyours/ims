import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineConfig({
    base: "./", 
    plugins: [react(), tailwindcss()],
    build: {
        outDir: "dist", // <-- force output to `dist/`
        emptyOutDir: true, // clear old files automatically
    },
    resolve: {
        alias: {
            "react-map-gl": "react-map-gl/dist/esm/index.js",
        },
    },
});
