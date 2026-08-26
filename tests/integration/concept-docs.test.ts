import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..', '..');

/**
 * Seam: the repo's concept documents.
 * Spec source: issues/07 — CONCEPT.md states what this site IS (first time
 * in writing); CONTEXT.md seeds the shared vocabulary.
 */
describe('CONCEPT.md', () => {
  const path = join(root, 'CONCEPT.md');

  it('exists', () => {
    expect(existsSync(path)).toBe(true);
  });

  it('declares the site a Ceefax simulator, not a retro-styled portfolio', () => {
    const md = readFileSync(path, 'utf-8');
    expect(md).toContain('Ceefax simulator');
    expect(md.toLowerCase()).toContain('not a retro-styled portfolio');
  });

  it('states the prime rule verbatim', () => {
    const md = readFileSync(path, 'utf-8');
    expect(md).toContain('chrome may be maximalist');
    expect(md).toContain('content must get out of the way');
  });

  it('names the page-number system as the navigation model', () => {
    const md = readFileSync(path, 'utf-8').toLowerCase();
    expect(md).toContain('page-number');
    expect(md).toContain('navigation');
  });
});

describe('CONTEXT.md glossary seed', () => {
  const TERMS = [
    'Fastext',
    'page number',
    'magazine',
    'chrome',
    'content',
    'curated',
    'archived',
    'directory',
    'buffer',
    'roll',
  ] as const;

  it('defines every seed term', () => {
    const md = readFileSync(join(root, 'CONTEXT.md'), 'utf-8').toLowerCase();
    for (const term of TERMS) {
      expect(md, `missing glossary term: ${term}`).toContain(term.toLowerCase());
    }
  });
});
