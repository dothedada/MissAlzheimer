import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';
import { defineConfig as defineVitestConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        createHtmlPlugin({
            minify: true,
            template: './src/index.html',
        }),
    ],
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
