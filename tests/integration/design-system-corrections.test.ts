import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..', '..');
const dist = join(root, 'dist');

/**
 * Seam: src/styles/global.css — the remote control's border color is a
 * plain CSS custom-property selector rule, not an inline Tailwind class on
 * the rendered element, so the source stylesheet is the real seam here
 * (same reasoning as figcaption-color-class.test.ts, which also asserts
 * against source rather than dist output for a CSS-driven color).
 * Spec source: JOR-75 / docs/adr/0005-remote-control-cyan-border.md.
 */
describe('remote control border color (JOR-75, ADR 0005)', () => {
  const css = readFileSync(join(root, 'src', 'styles', 'global.css'), 'utf-8');

  function ruleFor(selector: string): string {
    const start = css.indexOf(`${selector} {`);
    expect(start, `no ${selector} rule found`).toBeGreaterThan(-1);
    const end = css.indexOf('}', start);
    return css.slice(start, end);
  }

  it('borders the desktop rail in cyan, not yellow', () => {
    const rule = ruleFor('.remote-rail');
    expect(rule).toContain('--color-teletext-cyan');
    expect(rule).not.toContain('--color-teletext-yellow');
  });

  it('borders the mobile/mid-width dialog in cyan, not yellow — matches the rail 1:1', () => {
    const rule = ruleFor('.remote-dialog');
    expect(rule).toContain('--color-teletext-cyan');
    expect(rule).not.toContain('--color-teletext-yellow');
  });
});

describe('ProjectCard featured border — solid magenta, not opacity-based white (JOR-75)', () => {
  const source = readFileSync(
    join(root, 'src', 'components', 'projects', 'ProjectCard.astro'),
    'utf-8',
  );

  it('drives the featured border off a solid teletext-magenta class, never an opacity fraction', () => {
    // Non-featured cards keep their existing opacity-based white/30 border —
    // that's a separate, out-of-scope violation (DESIGNSYSTEM.md); only the
    // featured branch is touched by this change.
    expect(source).toMatch(/featured \? 'border-teletext-magenta' : 'border-teletext-white\/30'/);
  });

  it('actually renders that solid magenta border on the one real featured card (curated case studies)', () => {
    const html = readFileSync(join(dist, 'index.html'), 'utf-8');
    const section = html.slice(html.indexOf('Curated Case Studies'), html.indexOf('Get in Touch'));
    expect(section).toContain('border-teletext-magenta');
    expect(section).not.toMatch(/border-teletext-magenta[^"]*border-teletext-white\/30/);
  });
});

describe('PostCard featured treatment — mirrors ProjectCard (JOR-75)', () => {
  const source = readFileSync(join(root, 'src', 'components', 'blog', 'PostCard.astro'), 'utf-8');

  it('accepts an optional featured prop, defaulting to false', () => {
    expect(source).toMatch(/featured\?:\s*boolean/);
    expect(source).toMatch(/featured\s*=\s*false/);
  });

  it('renders a solid magenta border and a FEATURED label when featured', () => {
    expect(source).toContain('border-teletext-magenta');
    expect(source).toContain('FEATURED');
  });
});
