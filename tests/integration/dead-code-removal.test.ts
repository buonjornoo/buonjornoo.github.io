import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..', '..');
const dist = join(root, 'dist');

/**
 * Seam: the repo's own dependency and source-file surface, plus the
 * rendered site — the public interfaces this cleanup touches or must not
 * touch. Spec source: issues/16 — the repo carries React for exactly one
 * consumer (BlinkingText.tsx) nothing imports; PageNumber.astro is also
 * unused; the CRT scanline overlay must survive as proof it's a separate
 * mechanism from the unused `teletext-scanline` utility.
 */
describe('dead code removal (issues/16)', () => {
  it('deletes BlinkingText.tsx — it has zero consumers', () => {
    expect(existsSync(join(root, 'src/components/teletext/BlinkingText.tsx'))).toBe(false);
  });

  it('deletes PageNumber.astro — it has zero consumers', () => {
    expect(existsSync(join(root, 'src/components/teletext/PageNumber.astro'))).toBe(false);
  });

  it('removes all React packages from package.json (runtime + types)', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
    for (const name of ['@astrojs/react', 'react', 'react-dom', '@types/react', '@types/react-dom']) {
      expect(allDeps).not.toHaveProperty(name);
    }
  });

  it('drops the react() integration from astro.config.mjs, keeping the others', () => {
    const config = readFileSync(join(root, 'astro.config.mjs'), 'utf-8');
    expect(config).not.toMatch(/@astrojs\/react/);
    expect(config).not.toMatch(/\breact\(\)/);
    expect(config).toMatch(/sitemap\(\)/);
    expect(config).toMatch(/pageNumberDriftGuard\(\)/);
  });

  it('removes the unused teletext-scanline utility and its now-orphaned animate-blink keyframe var', () => {
    const css = readFileSync(join(root, 'src/styles/global.css'), 'utf-8');
    expect(css).not.toMatch(/@utility teletext-scanline/);
    expect(css).not.toMatch(/--animate-blink/);
  });

  it('still renders the real CRT scanline overlay — a separate, still-live mechanism', () => {
    const html = readFileSync(join(dist, 'index.html'), 'utf-8');
    expect(html).toContain('crt-scanlines');
  });

  it('corrects CLAUDE.md: no React in the stack description, no stale mobile-dialog wording', () => {
    const claudeMd = readFileSync(join(root, 'CLAUDE.md'), 'utf-8');
    expect(claudeMd).not.toMatch(/React 19/);
    expect(claudeMd).not.toMatch(/BlinkingText/);
    expect(claudeMd).not.toMatch(/number input/);
  });
});
