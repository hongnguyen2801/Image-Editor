import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/frontend/Main.tsx"],
            refresh: true,
        }),
        react(),
    ],
    build: {
        outDir: "public/build",
        manifest: true,
        rollupOptions: {
            input: "resources/frontend/Main.tsx",
        },
    },
});
