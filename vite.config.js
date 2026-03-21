import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './app'),
            '@ui': path.resolve(__dirname, './app/components/ui'),
        },
    },
    server: {
        port: 5173,
        open: true,
    },
});
