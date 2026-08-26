import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import pageRoutes from '../../src/data/pageRoutes.json';

const root = join(import.meta.dirname, '..', '..');
const dist = join(root, 'dist');

/**
 * Seam: the route map (pageRoutes.json) and the two rendered mounts
 * (dist/directory/index.html, dist/404.html) — the static site's public
 * interfaces. Spec source: issues/09 acceptance criteria.
 */
describe('directory route registration', () => {
  // Literal copied from the pre-ticket map — additions only, nothing moves (N8).
  const PRE_EXISTING_ROUTES: Record<string, string> = {
    '100': '/',
    '102': '/experience/',
    '200': '/projects/',
    '201': '/projects/bikemap-route-planner/',
    '202': '/projects/bikemap-pause-mode/',
    '203': '/projects/ar-city-exploration/',
    '204': '/projects/do24-workflow-evolution/',
    '205': '/projects/do24-teal-ui/',
    '206': '/projects/table-hunter/',
    '207': '/projects/cycling-coach/',
    '208': '/projects/this-site/',
    '209': '/projects/arin-und-der-drache/',
    '210': '/game/arin-und-der-drache/',
    '300': '/blog/',
    '301': '/blog/hello-world/',
    '302': '/blog/five-facts-in-one-day/',
    '400': '/contact/',
  };

  it('registers 101 → /directory/', () => {
    expect(pageRoutes['101']).toBe('/directory/');
  });

  it('moves no existing number (additions only)', () => {
    const routes = pageRoutes as Record<string, string>;
    for (const [number, url] of Object.entries(PRE_EXISTING_ROUTES)) {
      expect(routes[number], `page ${number}`).toBe(url);
    }
  });

  it('adds no numbers beyond 101', () => {
    const added = Object.keys(pageRoutes).filter((k) => !(k in PRE_EXISTING_ROUTES));
    expect(added).toEqual(['101']);
  });
});

describe('directory listing — one component, two mounts', () => {
  const routes = pageRoutes as Record<string, string>;
  const directoryHtml = readFileSync(join(dist, 'directory', 'index.html'), 'utf-8');
  const notFoundHtml = readFileSync(join(dist, '404.html'), 'utf-8');

  function listingBlock(html: string): string {
    const start = html.indexOf('id="page-directory"');
    const openTagStart = html.lastIndexOf('<div', start);
    // Balanced-tag scan rather than "next </div>": correct even if the
    // listing's markup grows nested <div>s later.
    const tagPattern = /<div\b[^>]*>|<\/div>/g;
    tagPattern.lastIndex = openTagStart;
    let depth = 0;
    let end = -1;
    let match: RegExpExecArray | null;
    while ((match = tagPattern.exec(html))) {
      if (match[0].startsWith('</')) {
        depth--;
        if (depth === 0) {
          end = match.index + match[0].length;
          break;
        }
      } else {
        depth++;
      }
    }
    return html.slice(openTagStart, end);
  }

  it('renders a #page-directory block on /directory/', () => {
    expect(directoryHtml).toContain('id="page-directory"');
  });

  it('renders a #page-directory block on /404', () => {
    expect(notFoundHtml).toContain('id="page-directory"');
  });

  it('renders byte-identical listings on both mounts', () => {
    expect(listingBlock(directoryHtml)).toBe(listingBlock(notFoundHtml));
  });

  it('lists exactly 18 anchors, one per pageRoutes.json entry', () => {
    const block = listingBlock(directoryHtml);
    const anchors = block.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? [];
    expect(anchors).toHaveLength(Object.keys(routes).length);
    expect(anchors).toHaveLength(18);
  });

  it('resolves every anchor href through pageRoutes.json (no dead entries)', () => {
    const block = listingBlock(directoryHtml);
    const anchors = block.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? [];
    for (const anchor of anchors) {
      const href = anchor.match(/href="([^"]+)"/)?.[1] ?? '';
      const number = anchor.replace(/<[^>]+>/g, '').match(/\b(\d{3})\b/)?.[1];
      expect(number, `anchor missing a 3-digit number: ${anchor}`).toBeTruthy();
      expect(href, `page ${number}`).toBe(routes[number!]);
    }
  });
});

describe('rendered directory page (101)', () => {
  const html = readFileSync(join(dist, 'directory', 'index.html'), 'utf-8');

  /** The nav payload ships as BaseLayout's entity-escaped data-routes attribute. */
  function shippedRoutes(): Record<string, string> {
    const attr = html.match(/data-routes="([^"]*)"/)?.[1] ?? '';
    return JSON.parse(attr.replaceAll('&#34;', '"')) as Record<string, string>;
  }

  it('ships in the nav payload so typing 101 can navigate', () => {
    expect(shippedRoutes()['101']).toBe('/directory/');
  });

  it('shows its page number in the header', () => {
    const headerBlock = html.slice(
      html.indexOf('id="page-number-btn"'),
      html.indexOf('</header>'),
    );
    expect(headerBlock).toMatch(/id="page-number-display"[^>]*>\s*101\s*</);
  });

  it('opens with a double-height yellow Directory heading', () => {
    const heading = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '';
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('text-teletext-yellow');
    expect(heading).toContain('Directory');
  });
});

describe('404 page otherwise unchanged', () => {
  const html = readFileSync(join(dist, '404.html'), 'utf-8');

  it('keeps the PAGE NOT FOUND / Error 404 messaging', () => {
    expect(html).toContain('PAGE NOT FOUND');
    expect(html).toContain('Error 404');
  });

  it('keeps the explanatory copy', () => {
    expect(html).toContain('The page you requested is not available.');
  });

  it('keeps the footer hint to type a page number', () => {
    expect(html).toContain('Type a 3-digit page number to navigate.');
  });

  it('keeps the "Available pages:" label', () => {
    expect(html).toContain('Available pages:');
  });

  it('keeps page 100 labeled "Home + About", not just "Home"', () => {
    expect(html).toContain('Home + About');
  });
});
