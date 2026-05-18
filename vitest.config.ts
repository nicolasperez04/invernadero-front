/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig(({ mode }) => ({
  plugins: [angular()],
  test: {
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    reporters: mode === 'ci' ? ['junit'] : ['default'],
    outputFile: {
      junit: 'target/test-results/junit.xml',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: 'target/coverage',
      include: ['src/app/**/*.ts'],
      exclude: [
        'src/app/**/*.spec.ts',
        'src/app/**/*.module.ts',
        'src/app/**/*.routes.ts',
        'src/main.ts',
        'src/test-setup.ts',
      ],
    },
    pool: 'forks',
    hookTimeout: 30000,
    testTimeout: 30000,
  },
}));
