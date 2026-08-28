import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import experienceData from '../../src/data/experience.json';
import pageRoutes from '../../src/data/pageRoutes.json';

const root = join(import.meta.dirname, '..', '..');
const dist = join(root, 'dist');

/**
 * Seam: the route map (pageRoutes.json) and the rendered experience page
 * (dist/experience/index.html) — the static site's public interfaces.
 * Spec source: issues/08 acceptance criteria.
 */
describe('experience matrix route registration', () => {
  // Literal copied from the pre-ticket map — additions only, nothing moves (N8).
  const PRE_EXISTING_ROUTES: Record<string, string> = {
    '100': '/',
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

  it('registers 102 → /experience/', () => {
    expect(pageRoutes['102']).toBe('/experience/');
  });

  it('moves no existing number (additions only)', () => {
    const routes = pageRoutes as Record<string, string>;
    for (const [number, url] of Object.entries(PRE_EXISTING_ROUTES)) {
      expect(routes[number], `page ${number}`).toBe(url);
    }
  });

  it('adds no numbers beyond 102, 101 (issue 09) and 103 (JOR-75)', () => {
    const added = Object.keys(pageRoutes).filter((k) => !(k in PRE_EXISTING_ROUTES));
    expect(added.sort()).toEqual(['101', '102', '103']);
  });
});

describe('rendered experience page (102)', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');

  /** The nav payload ships as BaseLayout's entity-escaped data-routes attribute. */
  function shippedRoutes(): Record<string, string> {
    const attr = html.match(/data-routes="([^"]*)"/)?.[1] ?? '';
    return JSON.parse(attr.replaceAll('&#34;', '"')) as Record<string, string>;
  }

  it('ships in the nav payload so typing 102 can navigate', () => {
    expect(shippedRoutes()['102']).toBe('/experience/');
  });

  it('shows its page number in the header', () => {
    const headerBlock = html.slice(
      html.indexOf('id="page-number-btn"'),
      html.indexOf('</header>'),
    );
    expect(headerBlock).toMatch(/id="page-number-display"[^>]*>\s*102\s*</);
  });

  it('opens with a double-height white Experience heading (white since issues/22)', () => {
    const heading = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/)?.[0] ?? '';
    expect(heading).toContain('teletext-double-height');
    expect(heading).toContain('text-teletext-white');
    expect(heading).toContain('Experience');
  });
});

describe('experience matrix — employment', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');

  /** Each employment entry is an <li>; the row naming the employer must
   *  carry its role and years (CV-verified data, issues/08). */
  function rowFor(employer: string): string {
    const rows = html.match(/<li(?:\s[^>]*)?>[\s\S]*?<\/li>/g) ?? [];
    return rows.find((row) => row.includes(employer)) ?? '';
  }

  it('lists digital office 24 with the merged promotion arc, 2024–2026', () => {
    const row = rowFor('digital office 24');
    expect(row).toContain('Product Designer');
    expect(row).toContain('Product Manager');
    expect(row).toContain('2024–2026');
  });

  it('lists Bikemap with the merged promotion arc, 2021–2023', () => {
    const row = rowFor('Bikemap');
    expect(row).toContain('Product Designer');
    expect(row).toContain('Product Manager');
    expect(row).toContain('2021–2023');
  });

  it('names KION Group | Digital Campus with the dated UX stint, Nov 2019 – Jun 2021', () => {
    const row = rowFor('KION Group');
    expect(row).toContain('Digital Campus');
    expect(row).toContain('UX Designer');
    expect(row).toContain('Nov 2019 – Jun 2021');
  });

  it('properly names Cheil Germany | Samsung as UX Designer, 2018–2019 (closes Q16)', () => {
    const row = rowFor('Cheil Germany');
    expect(row).toContain('Samsung');
    expect(row).toContain('UX Designer');
    expect(row).toContain('2018–2019');
  });
});

describe('experience matrix — education', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');

  function blockContaining(text: string): string {
    const blocks = html.match(/<li(?:\s[^>]*)?>[\s\S]*?<\/li>/g) ?? [];
    return blocks.find((block) => block.includes(text)) ?? '';
  }

  it('records the MA with distinction at Darmstadt, 2018', () => {
    const ma = blockContaining('Leadership in the Creative Industries');
    expect(ma).toContain('MA');
    expect(ma).toContain('with distinction');
    expect(ma).toContain('Darmstadt');
    expect(ma).toContain('2018');
  });

  it('links the thesis to its case study, page 203', () => {
    const ma = blockContaining('Leadership in the Creative Industries');
    const link = ma.match(/<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<\/a>/);
    expect(link?.[1]).toBe('/projects/ar-city-exploration/');
    expect(link?.[0]).toContain('Story-Driven City Exploration');
  });

  it('records the BA in Sound and Music Production, 2017', () => {
    const ba = blockContaining('Sound and Music Production');
    expect(ba).toContain('BA');
    expect(ba).toContain('2017');
  });

  /** Both degrees are from one school, named in English by the EN CV
   *  (public/cv/jorne-siebrands-cv-en.pdf) — review findings F1 and F3. */
  const CV_SCHOOL = 'Darmstadt University of Applied Sciences';

  it('names the MA school exactly as the EN CV does (F3)', () => {
    expect(blockContaining('Leadership in the Creative Industries')).toContain(CV_SCHOOL);
  });

  it('names the BA school exactly as the EN CV does (F1)', () => {
    expect(blockContaining('Sound and Music Production')).toContain(CV_SCHOOL);
  });

  it('attributes no degree to a school the CV does not name', () => {
    expect(html).not.toContain('SAE');
    expect(html).not.toContain('Hochschule Darmstadt');
  });
});

describe('experience matrix — personal projects as page-number refs', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');

  function refFor(url: string): string {
    const anchors = html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? [];
    return anchors.find((anchor) => anchor.includes(`href="${url}"`)) ?? '';
  }

  it('points Cycling Coach at its case study via page number 207', () => {
    const ref = refFor('/projects/cycling-coach/');
    expect(ref).toContain('207');
  });

  it('points Table Hunter at its case study via page number 206', () => {
    const ref = refFor('/projects/table-hunter/');
    expect(ref).toContain('206');
  });
});

describe('experience matrix — content lives in src/data (F6)', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');
  const source = readFileSync(join(root, 'src', 'pages', 'experience.astro'), 'utf-8');

  it('renders its section headings from experience.json, in page order', () => {
    const rendered = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/g) ?? []).map((h2) =>
      h2.replace(/<[^>]+>/g, '').trim(),
    );
    expect(rendered).toEqual([
      experienceData.headings.employment,
      experienceData.headings.personalProjects,
      experienceData.headings.education,
      experienceData.headings.skills,
    ]);
  });

  /** CLAUDE.md: "All content lives in src/data/". The template holds structure
   *  and classes only — no sentence a reader sees. */
  it.each([
    'Employment',
    'Personal projects',
    'Education',
    'Skills',
    'Thesis',
    'full case study',
    'now page',
  ])('does not hardcode the copy "%s" in the template', (copy) => {
    expect(source).not.toContain(copy);
  });
});

describe('experience matrix — pageRoutes.json is the one number→URL map (F7)', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');
  const source = readFileSync(join(root, 'src', 'pages', 'experience.astro'), 'utf-8');
  const routes = pageRoutes as Record<string, string>;

  it('hardcodes no page number in the template beyond its own', () => {
    const withoutOwnNumber = source.replace(/pageNumber="\d{3}"/, '');
    expect(withoutOwnNumber).not.toMatch(/\b\d{3}\b/);
  });

  it('restates no route URL in experience.json', () => {
    const json = readFileSync(join(root, 'src', 'data', 'experience.json'), 'utf-8');
    // '/' (page 100) is skipped: it matches any path, so it cannot indicate
    // a restated route.
    for (const url of Object.values(routes).filter((url) => url !== '/')) {
      expect(json, `duplicated route: ${url}`).not.toContain(url);
    }
  });

  /** Every "page NNN" a reader can follow must land on the URL the map gives
   *  for NNN — the invariant issue 17's drift guard generalises. */
  it('resolves every page reference through the map', () => {
    const content = html.slice(html.indexOf('<main'), html.indexOf('</main>'));
    const refs = content.match(/<a[^>]+href="[^"]+"[^>]*>[\s\S]*?<\/a>/g) ?? [];
    const numbered = refs
      .map((anchor) => ({
        href: anchor.match(/href="([^"]+)"/)?.[1] ?? '',
        number: anchor.replace(/<[^>]+>/g, '').match(/\b(\d{3})\b/)?.[1],
      }))
      .filter((ref) => ref.number);
    expect(numbered.length).toBeGreaterThan(0);
    for (const ref of numbered) {
      expect(ref.href, `page ${ref.number}`).toBe(routes[ref.number!]);
    }
  });
});

describe('experience matrix — no PDF escape hatch (F4)', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');

  /** The page's whole premise is the career readable on-site; CV PDFs are
   *  explicitly out of this ticket's boundaries (issues/08). Page 400 keeps
   *  the downloads. */
  it('offers no CV download', () => {
    expect(html).not.toContain('/cv/');
    expect(html).not.toContain('Download PDF');
  });
});

describe('experience matrix — skills', () => {
  const html = readFileSync(join(dist, 'experience', 'index.html'), 'utf-8');

  /** The skills block is a definition list: one dt per category label,
   *  each followed by a non-empty dd value (issues/08 acceptance criteria). */
  function valueFor(labelText: string): string {
    const dt = html.match(
      new RegExp(`<dt\\b[^>]*>\\s*${labelText}\\s*</dt>\\s*<dd\\b[^>]*>([\\s\\S]*?)</dd>`),
    );
    return dt?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
  }

  const LABELS = [
    'Design &amp; execution',
    'AI',
    'Requirements &amp; process',
    'Workshops',
    'Tools',
    'Languages',
  ];

  it.each(LABELS)('has a "%s" entry with a non-empty value', (label) => {
    expect(valueFor(label)).not.toBe('');
  });

  it('states languages truthfully against the CV (German native, English fluent)', () => {
    const languages = valueFor('Languages');
    expect(languages).toContain('German');
    expect(languages).toContain('English');
  });

  /** Every value is the CV's own wording, transcribed from the Skills block of
   *  public/cv/jorne-siebrands-cv-en.pdf — review finding F2. */
  const CV_SKILLS: Record<string, string> = {
    'Design &amp; execution':
      'Figma (component libraries, design systems, design tokens), interaction design, information architecture, user research, accessibility (WCAG/BITV), prototyping in code (HTML/CSS)',
    AI: 'designing AI into products responsibly (anonymized-data matching agent, consulting chat bot), curious about and hands-on with AI-assisted design; building with AI daily',
    'Requirements &amp; process':
      'requirements analysis and prioritization, process analysis and modeling, specifications the engineering team can build from with minimal overhead',
    Workshops:
      'preparing and running workshops and interviews, close coordination with engineering, internal and external stakeholders',
    Tools: 'Figma, FigJam/Miro, Jira/Linear, Confluence, Notion, GitHub, VS Code, Claude Code with MCPs',
    Languages: 'German (native), English (fluent)',
  };

  it.each(Object.entries(CV_SKILLS))('renders "%s" in the CV\'s own wording (F2)', (label, value) => {
    expect(valueFor(label)).toBe(value);
  });

  it('claims no skill the CV does not list', () => {
    const block = html.slice(html.indexOf('<dl'), html.indexOf('</dl>'));
    for (const invented of [
      'Vercel',
      'Astro',
      'Tailwind',
      'ChatGPT',
      'custom GPTs',
      'Scrum',
      'Kanban',
      'roadmapping',
      'backlog ownership',
      'usability testing',
      'design sprints',
    ]) {
      expect(block, `invented skill: ${invented}`).not.toContain(invented);
    }
  });
});
