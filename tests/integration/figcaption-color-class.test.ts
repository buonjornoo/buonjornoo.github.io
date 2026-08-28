import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const projectsDir = join(import.meta.dirname, '..', '..', 'src', 'data', 'projects');

/**
 * Seam: markdown source under src/data/projects/ — the hand-written
 * class="..." string on each <figcaption>, not the rendered HTML.
 * Spec source: JOR-74 — JOR-67 recolored figcaptions grey via a
 * higher-specificity shared CSS rule, leaving this per-figcaption class
 * stale (inert, but misleading about the actual rendered color).
 */
describe('figcaption color class (JOR-74)', () => {
  it('carries no stale text-teletext-green class under src/data/projects/', () => {
    const files = globSync(join(projectsDir, '*.md'));
    const offenders = files.filter((file) => readFileSync(file, 'utf-8').includes('text-teletext-green'));
    expect(offenders).toEqual([]);
  });

  it('uses text-teletext-grey on every figcaption instead', () => {
    const files = globSync(join(projectsDir, '*.md'));
    const figcaptionClasses = files.flatMap((file) => {
      const md = readFileSync(file, 'utf-8');
      return [...md.matchAll(/<figcaption class="([^"]*)"/g)].map((m) => m[1]);
    });
    expect(figcaptionClasses.length).toBeGreaterThan(0);
    for (const cls of figcaptionClasses) {
      expect(cls).toContain('text-teletext-grey');
    }
  });
});
