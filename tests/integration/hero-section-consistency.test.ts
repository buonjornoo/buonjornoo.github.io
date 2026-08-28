import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '..', '..', 'dist');

/**
 * Seam: the rendered site (dist/) — the static site's public interface.
 * Spec source: JOR-83 acceptance criteria (every page gets a big title +
 * frontmatter-readout, except Home which stays readout-only, and project
 * pages which already had both).
 */
function readoutBlock(html: string): string {
  const match = html.match(/<div class="frontmatter-readout"[^>]*>[\s\S]*?<\/div>/);
  if (!match) throw new Error('readoutBlock: no .frontmatter-readout div found');
  return match[0];
}

function h1Block(html: string): string {
  return html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '';
}

describe('Blog post hero: title + frontmatter-readout (JOR-83)', () => {
  const html = readFileSync(join(dist, 'blog', 'hello-world', 'index.html'), 'utf-8');

  it('keeps the existing double-height white title', () => {
    const heading = h1Block(html);
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('text-teletext-white');
    expect(heading).toContain('Hello World');
  });

  it('adds a frontmatter-readout with title/pubDate/tags/pageNumber', () => {
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>title:/);
    expect(readout).toMatch(/fr-key[^>]*>pubDate:/);
    expect(readout).toMatch(/fr-key[^>]*>tags:/);
    expect(readout).toMatch(/fr-key[^>]*>pageNumber:/);
  });

  it('carries no subtitle/context lines (blog posts have neither field)', () => {
    const readout = readoutBlock(html);
    expect(readout).not.toMatch(/fr-key[^>]*>subtitle:/);
    expect(readout).not.toMatch(/fr-key[^>]*>context:/);
  });

  it('renders real frontmatter values, not placeholders', () => {
    const readout = readoutBlock(html);
    expect(readout).toContain('&quot;Hello World&quot;');
    expect(readout).toContain('2026-02-14');
    expect(readout).toContain('&quot;meta&quot;');
    expect(readout).toContain('&quot;301&quot;');
  });
});

describe('About page hero: frontmatter-readout added (JOR-83)', () => {
  const html = readFileSync(join(dist, 'about', 'index.html'), 'utf-8');

  it('adds a frontmatter-readout with title/description/pageNumber', () => {
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>title:/);
    expect(readout).toMatch(/fr-key[^>]*>description:/);
    expect(readout).toMatch(/fr-key[^>]*>pageNumber:/);
  });

  it('renders the real About page frontmatter values', () => {
    const readout = readoutBlock(html);
    expect(readout).toContain('&quot;About Jorne Marc Siebrands&quot;');
    expect(readout).toContain('&quot;103&quot;');
  });

  it('keeps the existing "Jorne" hero heading unchanged', () => {
    const heading = h1Block(html);
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('Jorne');
  });
});

describe.each([
  ['Directory', 'directory', '101', 'Every page on this site, by number.'],
  ['Experience', 'experience', '102', 'career at a glance — product design'],
  ['Contact', 'contact', '400', 'Get in touch with Jorne Marc Siebrands'],
  ['Projects', 'projects', '200', 'Explore Product Design and Product Management projects'],
  ['Blog', 'blog', '300', 'Thoughts on UX design, product management, and technology'],
])('%s page hero: frontmatter-readout added (JOR-83)', (title, dir, pageNumber, descriptionSnippet) => {
  const html = readFileSync(join(dist, dir, 'index.html'), 'utf-8');

  it('keeps the existing double-height white title', () => {
    const heading = h1Block(html);
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('text-teletext-white');
  });

  it('adds a frontmatter-readout with title/description/pageNumber', () => {
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>title:/);
    expect(readout).toMatch(/fr-key[^>]*>description:/);
    expect(readout).toMatch(/fr-key[^>]*>pageNumber:/);
  });

  it('renders the real title/pageNumber values, not placeholders', () => {
    const readout = readoutBlock(html);
    expect(readout).toContain(`&quot;${title}&quot;`);
    expect(readout).toContain(`&quot;${pageNumber}&quot;`);
  });

  it('renders a description value matching the page\'s real meta description', () => {
    const readout = readoutBlock(html);
    expect(readout).toContain(descriptionSnippet);
  });
});

describe('Home and project pages unaffected by JOR-83', () => {
  it('Home (100) stays readout-only — no big title added', () => {
    const html = readFileSync(join(dist, 'index.html'), 'utf-8');
    expect(html.match(/<h1[^>]*>/)).toBeNull();
    expect(readoutBlock(html)).toMatch(/fr-key[^>]*>title:/);
  });

  it('a project page (204) keeps its existing subtitle/tags readout untouched', () => {
    const html = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>subtitle:/);
    expect(readout).toMatch(/fr-key[^>]*>tags:/);
  });
});
