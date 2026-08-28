import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import pageRoutes from '../../src/data/pageRoutes.json';

const root = join(import.meta.dirname, '..', '..');
const dist = join(root, 'dist');

/**
 * Seam: the route map (pageRoutes.json) and the rendered About page
 * (dist/about/index.html) — the static site's public interfaces.
 * Spec source: JOR-75 acceptance criteria (homepage/About split).
 */
describe('About page route registration', () => {
  // Literal copied from the pre-ticket map — additions only, nothing moves (N8).
  const PRE_EXISTING_ROUTES: Record<string, string> = {
    '100': '/',
    '101': '/directory/',
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

  it('registers 103 → /about/', () => {
    expect(pageRoutes['103']).toBe('/about/');
  });

  it('moves no existing number (additions only)', () => {
    const routes = pageRoutes as Record<string, string>;
    for (const [number, url] of Object.entries(PRE_EXISTING_ROUTES)) {
      expect(routes[number], `page ${number}`).toBe(url);
    }
  });

  it('adds no numbers beyond 103', () => {
    const added = Object.keys(pageRoutes).filter((k) => !(k in PRE_EXISTING_ROUTES));
    expect(added).toEqual(['103']);
  });
});

describe('rendered About page (103)', () => {
  const html = readFileSync(join(dist, 'about', 'index.html'), 'utf-8');

  /** The nav payload ships as BaseLayout's entity-escaped data-routes attribute. */
  function shippedRoutes(): Record<string, string> {
    const attr = html.match(/data-routes="([^"]*)"/)?.[1] ?? '';
    return JSON.parse(attr.replaceAll('&#34;', '"')) as Record<string, string>;
  }

  it('ships in the nav payload so typing 103 can navigate', () => {
    expect(shippedRoutes()['103']).toBe('/about/');
  });

  it('shows its page number in the header', () => {
    const headerBlock = html.slice(
      html.indexOf('id="page-number-btn"'),
      html.indexOf('</header>'),
    );
    expect(headerBlock).toMatch(/id="page-number-display"[^>]*>\s*103\s*</);
  });

  it('opens with the "Jorne" hero heading, double-height white', () => {
    const heading = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '';
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('text-teletext-white');
    expect(heading).toContain('Jorne');
  });
});

describe('About page — moved bio content', () => {
  const html = readFileSync(join(dist, 'about', 'index.html'), 'utf-8');

  it('carries the at-a-glance highlights moved from the homepage', () => {
    expect(html).toContain('ONE PERSON, MANY HATS');
    expect(html).toContain('CONSUMER SCALE');
  });

  it('carries the "How I Work" section, all six subsections', () => {
    expect(html).toContain('How I Work');
    expect(html).toContain('Business and UX are a single equation');
    expect(html).toContain('Designing the System, Not the Screen');
  });

  it('carries the colleague testimonials', () => {
    expect(html).toContain('What my colleagues say about me');
    expect(html).toContain('Head of Marketing, Bikemap');
  });

  it('styles testimonials as interview-quote blocks (cyan border, cyan quote, grey attribution)', () => {
    const section = html.slice(
      html.indexOf('What my colleagues say about me'),
      html.indexOf('END OF PAGE'),
    );
    const figures = section.match(/<figure[^>]*>[\s\S]*?<\/figure>/g) ?? [];
    expect(figures.length).toBe(3);
    for (const figure of figures) {
      expect(figure).toContain('border-teletext-cyan');
      expect(figure).toMatch(/<blockquote class="[^"]*text-teletext-cyan/);
      expect(figure).toMatch(/<figcaption class="[^"]*text-teletext-grey/);
    }
  });

  it('renders no avatar image — it was removed entirely, not moved here', () => {
    expect(html).not.toContain('Avatar.png');
  });

  it('carries the site-wide end-of-page marker', () => {
    expect(html).toContain('END OF PAGE');
  });
});
