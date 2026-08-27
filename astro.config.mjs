// @ts-check
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { visit } from 'unist-util-visit';
import { rehypePageLinks } from './src/lib/rehype-page-links.ts';
import { rehypeBlockquoteType } from './src/lib/rehype-blockquote-type.ts';
import { findPageNumberDrift, parseFrontmatterString } from './src/lib/page-number-drift.ts';

const pageRoutes = JSON.parse(readFileSync(new URL('./src/data/pageRoutes.json', import.meta.url), 'utf-8'));

/**
 * pageNumber is hand-written in front matter across the content collections
 * *and* independently maintained in pageRoutes.json, with nothing checking
 * they agree (issues/17). Fails the build — not just dev — the moment a
 * document's declared number stops matching the URL pageRoutes.json says it
 * owns, naming both sides of the disagreement.
 * @returns {import('astro').AstroIntegration}
 */
function pageNumberDriftGuard() {
  const collectionDirs = /** @type {const} */ ([
    ['blog', './src/data/blog'],
    ['projects', './src/data/projects'],
    ['pages', './src/data/pages'],
  ]);

  return {
    name: 'page-number-drift-guard',
    hooks: {
      'astro:build:start': () => {
        const docs = collectionDirs.flatMap(([collection, dir]) =>
          readdirSync(new URL(dir, import.meta.url))
            .filter((name) => name.endsWith('.md'))
            .map((name) => {
              const raw = readFileSync(new URL(`${dir}/${name}`, import.meta.url), 'utf-8');
              return {
                collection,
                id: name.replace(/\.md$/, ''),
                slug: parseFrontmatterString(raw, 'slug') ?? undefined,
                pageNumber: parseFrontmatterString(raw, 'pageNumber'),
              };
            }),
        );

        const drift = findPageNumberDrift(docs, pageRoutes);
        if (drift.length === 0) return;

        const details = drift
          .map(
            (entry) =>
              `  ${entry.doc}: declares pageNumber "${entry.declaredNumber}" (→ ${entry.expectedUrl}), ` +
              `but pageRoutes.json["${entry.declaredNumber}"] is ${
                entry.routeEntry ? `"${entry.routeEntry}"` : 'undefined'
              }`,
          )
          .join('\n');
        throw new Error(`Page-number drift detected between front matter and pageRoutes.json:\n${details}`);
      },
    },
  };
}

/**
 * Dev parity for public/ directory URLs: `astro dev` serves public/ files by
 * exact path, so a URL like /game/arin-und-der-drache/ 404s even though the
 * production build (and `astro preview`, and GitHub Pages) resolves it to
 * index.html. Rewrites trailing-slash URLs to their index.html when that file
 * exists in public/, and only in the dev server (apply: 'serve') — production
 * behaviour is untouched.
 * @returns {import('vite').Plugin}
 */
function publicDirectoryIndex() {
  return {
    name: 'dev-public-directory-index',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const rawUrl = req.url ?? '';
        const queryIndex = rawUrl.indexOf('?');
        const pathname = queryIndex === -1 ? rawUrl : rawUrl.slice(0, queryIndex);
        const search = queryIndex === -1 ? '' : rawUrl.slice(queryIndex);
        const normalized = posix.normalize(pathname);
        if (
          normalized.endsWith('/') &&
          normalized.startsWith('/') &&
          !normalized.includes('..') &&
          normalized !== '/'
        ) {
          const filePath = new URL(`./public${normalized}index.html`, import.meta.url);
          if (existsSync(filePath)) {
            req.url = `${normalized}index.html${search}`;
          }
        }
        next();
      });
    },
  };
}

/**
 * Open external links and PDF downloads in a new tab, so a visitor never loses
 * the portfolio page. Internal links and mailto: are left alone.
 */
function rehypeNewTabLinks() {
  /** @param {import('hast').Root} tree */
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'a') return;
      const href = node.properties?.href;
      if (typeof href === 'string' && (/^https?:\/\//i.test(href) || /\.pdf$/i.test(href))) {
        node.properties.target = '_blank';
        node.properties.rel = ['noopener', 'noreferrer'];
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://siebrands.com',
  integrations: [sitemap(), pageNumberDriftGuard()],
  redirects: {
    '/projects/pingpong-map/': '/projects/table-hunter/',
  },
  markdown: {
    rehypePlugins: [rehypeNewTabLinks, rehypePageLinks(pageRoutes), rehypeBlockquoteType()],
  },
  vite: {
    plugins: [tailwindcss(), publicDirectoryIndex()],
  },
});