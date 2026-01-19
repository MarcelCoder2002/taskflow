import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**.config.**',
        '.next/',
        'zenstack/',
      ],
    },
    projects: [
      {
        test: {
          include: [
            'tests/unit/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.unit.{test,spec}.{ts,tsx}',
          ],
          name: 'unit',
          environment: 'jsdom',
        },
      },
      {
        test: {
          include: [
            'tests/browser/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.browser.{test,spec}.{ts,tsx}',
          ],
          name: 'browser',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
