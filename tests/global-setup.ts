import { execSync } from 'node:child_process';

/**
 * Integration specs assert against the production build in dist/, so every
 * test run starts from a fresh build. Unit specs pay the same cost but stay
 * simple and always see output that matches the current source.
 */
export default function globalSetup() {
  execSync('npx astro build', { stdio: 'inherit' });
}
