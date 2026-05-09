import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    hookTimeout: 30000,
    testTimeout: 30000,
    pool: 'forks',
    reporters: ['default'],
  },
});
