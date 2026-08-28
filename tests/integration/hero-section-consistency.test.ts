import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const dist = join(import.meta.dirname, '..', '..', 'dist');

/**
 * Seam: the rendered site (dist/) — the static site's public interface.
 * Spec source: JOR-83 acceptance criteria (every page gets a big title +
 * frontmatter-readout), plus a direct visual-QA follow-up pass (2026-08-28)
 * that: (a) drops the redundant `title:` readout line everywhere since the
 * big <h1> already shows it, (b) inserts a separator between the title and
 * the readout on every page including Home (which also gained a big title,
 * reversing JOR-75/JOR-83's readout-only exception), (c) removes a few
 * paragraphs that duplicated their page's readout description word-for-word,
 * (d) wraps the site-wide END OF PAGE marker in separators, and (e) fixes
 * missing separators on the Projects index and a hero-image-glued-to-readout
 * issue on project pages with a heroImage (p203).
 */
function readoutBlock(html: string): string {
  const match = html.match(/<div class="frontmatter-readout"[^>]*>[\s\S]*?<\/div>/);
  if (!match) throw new Error('readoutBlock: no .frontmatter-readout div found');
  return match[0];
}

function h1Block(html: string): string {
  return html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '';
}

const SEPARATOR = /<div class="w-full overflow-hidden[^"]*"[^>]*role="separator"[^>]*>\s*[━]+\s*<\/div>/;

function immediatelyPrecededBySeparator(html: string, needle: string): boolean {
  const idx = html.indexOf(needle);
  if (idx === -1) throw new Error(`immediatelyPrecededBySeparator: needle not found: ${needle}`);
  return new RegExp(SEPARATOR.source + '\\s*$').test(html.slice(0, idx));
}

function immediatelyFollowedBySeparator(html: string, needle: string): boolean {
  const idx = html.indexOf(needle);
  if (idx === -1) throw new Error(`immediatelyFollowedBySeparator: needle not found: ${needle}`);
  return new RegExp('^\\s*' + SEPARATOR.source).test(html.slice(idx + needle.length));
}

function countOccurrences(html: string, needle: string): number {
  return html.split(needle).length - 1;
}

describe('Home (100): big title added, readout-only exception reversed', () => {
  const html = readFileSync(join(dist, 'index.html'), 'utf-8');

  it('now has a big double-height white "Jorne Marc Siebrands" title', () => {
    const heading = h1Block(html);
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('text-teletext-white');
    expect(heading).toContain('Jorne Marc Siebrands');
  });

  it('separates the title from the readout', () => {
    expect(immediatelyFollowedBySeparator(html, h1Block(html))).toBe(true);
  });

  it('readout has description/pageNumber but no title line', () => {
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>description:/);
    expect(readout).toMatch(/fr-key[^>]*>pageNumber:/);
    expect(readout).not.toMatch(/fr-key[^>]*>title:/);
  });
});

describe('About page (103): retitled, redundant hero prose removed', () => {
  const html = readFileSync(join(dist, 'about', 'index.html'), 'utf-8');

  it('has the "About Jorne" heading (was just "Jorne")', () => {
    const heading = h1Block(html);
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('About Jorne');
  });

  it('separates the title from the readout', () => {
    expect(immediatelyFollowedBySeparator(html, h1Block(html))).toBe(true);
  });

  it('readout has the new short description and pageNumber, no title line', () => {
    const readout = readoutBlock(html);
    expect(readout).toContain('&quot;My background, career highlights, how I work, and what colleagues say.&quot;');
    expect(readout).toContain('&quot;103&quot;');
    expect(readout).not.toMatch(/fr-key[^>]*>title:/);
  });

  it('removes the redundant dual-title/location hero paragraphs entirely', () => {
    expect(html).not.toContain('structural problem nobody has named');
    expect(html).not.toContain('Frankfurt am Main, Germany and remote. Available now.');
  });
});

describe.each([
  ['directory', 'Directory'],
  ['experience', 'Experience'],
  ['contact', 'Contact'],
  ['blog', 'Blog'],
])('%s page (structural): title hidden from readout, separator added', (dir, headingText) => {
  const html = readFileSync(join(dist, dir, 'index.html'), 'utf-8');

  it('separates the title from the readout', () => {
    expect(immediatelyFollowedBySeparator(html, h1Block(html))).toBe(true);
  });

  it('readout has description/pageNumber, no title line', () => {
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>description:/);
    expect(readout).toMatch(/fr-key[^>]*>pageNumber:/);
    expect(readout).not.toMatch(/fr-key[^>]*>title:/);
  });

  it('keeps the existing double-height white title', () => {
    const heading = h1Block(html);
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('text-teletext-white');
    expect(heading).toContain(headingText);
  });
});

describe('Directory page (101): redundant intro paragraph removed', () => {
  const html = readFileSync(join(dist, 'directory', 'index.html'), 'utf-8');

  it('drops the standalone <p> duplicating the readout description — the sentence survives only in <meta> tags and the readout', () => {
    // Every occurrence is meta/og/twitter description tags (3) + the
    // .frontmatter-readout's own fr-value (1) = 4. A 5th would mean the old
    // standalone <p class="text-teletext-cyan..."> paragraph is still there.
    expect(countOccurrences(html, 'Every page on this site, by number.')).toBe(4);
    expect(html).not.toMatch(/<p class="text-teletext-cyan[^"]*">\s*Every page on this site, by number\./);
  });
});

describe('Experience page (102): redundant intro paragraph removed entirely', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');

  it('no longer renders the old intro line anywhere (dropped from experience.json, not just hidden)', () => {
    expect(html).not.toContain('The shape of a career in product');
  });
});

describe('Contact page (400): intro paragraph removed (visual QA follow-up, 2026-08-28 — redundant with the readout description)', () => {
  const html = readFileSync(join(dist, 'contact', 'index.html'), 'utf-8');

  it('no longer renders the old intro paragraph', () => {
    expect(html).not.toContain('always happy to chat about design');
  });
});

describe('Projects index (200): was missing separators entirely', () => {
  const html = readFileSync(join(dist, 'projects', 'index.html'), 'utf-8');

  it('separates the title from the readout', () => {
    expect(immediatelyFollowedBySeparator(html, h1Block(html))).toBe(true);
  });

  it('readout has no title line', () => {
    expect(readoutBlock(html)).not.toMatch(/fr-key[^>]*>title:/);
  });

  it('renders the tagline as a heading, below the frontmatter section, not as a cyan paragraph inside it (visual QA follow-up)', () => {
    const tagline = 'A selection of projects in Product Design and Product Management.';
    const taglineTag = html.match(new RegExp(`<h2[^>]*>\\s*${tagline}\\s*</h2>`))?.[0];
    expect(taglineTag, 'expected the tagline to render as an <h2>').toBeTruthy();
    expect(immediatelyPrecededBySeparator(html, taglineTag!)).toBe(true);

    const readout = readoutBlock(html);
    expect(html.indexOf(readout) + readout.length).toBeLessThan(html.indexOf(taglineTag!));
  });
});

describe('Blog post hero (JOR-83, title line dropped in visual QA)', () => {
  const html = readFileSync(join(dist, 'blog', 'hello-world', 'index.html'), 'utf-8');

  it('separates the title from the readout', () => {
    expect(immediatelyFollowedBySeparator(html, h1Block(html))).toBe(true);
  });

  it('readout has pubDate/tags/pageNumber but no title line', () => {
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>pubDate:/);
    expect(readout).toMatch(/fr-key[^>]*>tags:/);
    expect(readout).toMatch(/fr-key[^>]*>pageNumber:/);
    expect(readout).not.toMatch(/fr-key[^>]*>title:/);
  });
});

describe('Project page readout: title line dropped in visual QA', () => {
  it('a project page (204) keeps subtitle/tags, drops title', () => {
    const html = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    const readout = readoutBlock(html);
    expect(readout).toMatch(/fr-key[^>]*>subtitle:/);
    expect(readout).toMatch(/fr-key[^>]*>tags:/);
    expect(readout).not.toMatch(/fr-key[^>]*>title:/);
  });

  it('still separates the title from the readout', () => {
    const html = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    expect(immediatelyFollowedBySeparator(html, h1Block(html))).toBe(true);
  });
});

describe('Project page hero image: separated from the frontmatter block (visual QA, p203)', () => {
  const html = readFileSync(join(dist, 'projects', 'ar-city-exploration', 'index.html'), 'utf-8');

  it('renders the GIF preceded by its own separator, not glued to the readout', () => {
    const imgTag = html.match(/<img[^>]*raubkunst_cover\.gif[^>]*>/)?.[0];
    expect(imgTag, 'expected the AR City Exploration hero GIF <img> to be present').toBeTruthy();
    expect(immediatelyPrecededBySeparator(html, imgTag!)).toBe(true);
  });

  it('the GIF is not inside the .frontmatter-readout block', () => {
    expect(readoutBlock(html)).not.toContain('raubkunst_cover.gif');
  });

  it('a project page with no heroImage gets no extra/doubled separator (204 has none)', () => {
    const noImageHtml = readFileSync(
      join(dist, 'projects', 'do24-workflow-evolution', 'index.html'),
      'utf-8',
    );
    // Two adjacent separators with nothing between them would mean the
    // conditional heroImage separator leaked out even with no image.
    expect(noImageHtml).not.toMatch(new RegExp(SEPARATOR.source + '\\s*' + SEPARATOR.source));
  });
});

describe.each([
  ['index.html', 'Home'],
  ['about/index.html', 'About'],
  ['directory/index.html', 'Directory'],
])('End-of-page marker on %s: wrapped in separators (visual QA)', (relPath, _label) => {
  const html = readFileSync(join(dist, relPath), 'utf-8');
  const marker = '<p class="end-of-page" aria-hidden="true">— END OF PAGE —</p>';

  it('has a separator immediately before the marker', () => {
    expect(immediatelyPrecededBySeparator(html, marker)).toBe(true);
  });

  it('has a separator immediately after the marker', () => {
    expect(immediatelyFollowedBySeparator(html, marker)).toBe(true);
  });
});
