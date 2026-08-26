import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Builds the site once so integration specs can assert against real
    // dist/ output — the rendered HTML is the site's public interface.
    globalSetup: './tests/global-setup.ts',
  },
});
