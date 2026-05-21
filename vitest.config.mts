import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      'next/server': resolve('./node_modules/next/server.js'),
    },
  },
  test: {
    server: {
      deps: {
        inline: ['next-auth'],
      },
    },
    environment: 'jsdom',
    pool: 'threads',
    include: ['tests/**/*.test.{ts,tsx}'], //descomentar
    // include: ['tests/page.test.tsx'], //Solo borrar
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'], //descomentar
      exclude: [
        // 'src/**/*.{ts,tsx}', //borrar solo esta linea
        'src/**/*.d.ts',
        'src/**/*.css',
        'src/**/index.ts',
        'src/generated/**',
        'src/lib/**',
        'src/seed/**',
        'src/app/globals.css',
        'src/app/favicon.ico',
      ],
    },
  },
});
