import { spawn } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';

const PORT = 4399;
const BASE = `http://localhost:${PORT}`;

/**
 * Seam: the astro dev server — the environment contributors actually run
 * (`npm run dev`). Regression lock for the dev/prod mismatch where public/
 * directory URLs like /game/arin-und-der-drache/ (what typing 210 navigates
 * to) 404ed under `astro dev`, although the production build, `astro preview`
 * and GitHub Pages all resolve them to index.html. Fixed by the dev-only
 * publicDirectoryIndex vite plugin in astro.config.mjs — these tests are red
 * without it and green with it.
 */

let child: ReturnType<typeof spawn> | undefined;

async function waitForServer(timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {
      // server not up yet — keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`astro dev did not start on :${PORT} within ${timeoutMs}ms`);
}

async function get(path: string): Promise<{ status: number; body: string }> {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, body: await res.text() };
}

afterAll(() => {
  child?.kill('SIGTERM');
});

describe('astro dev serves public/ directory URLs like production does', () => {
  it(
    'boots',
    async () => {
      child = spawn('npx', ['astro', 'dev', '--port', String(PORT)], { stdio: 'ignore' });
      child.on('error', () => {});
      await waitForServer(30_000);
    },
    35_000,
  );

  it(
    'serves the game page at its canonical directory URL (page 210)',
    async () => {
      const { status, body } = await get('/game/arin-und-der-drache/');
      expect(status).toBe(200);
      expect(body).toContain('Arin und der Drache');
      expect(body).toContain('kaboom');
    },
    15_000,
  );

  it(
    'still 404s for directories that genuinely do not exist',
    async () => {
      const { status } = await get('/game/nonexistent-page/');
      expect(status).toBe(404);
    },
    15_000,
  );
});
