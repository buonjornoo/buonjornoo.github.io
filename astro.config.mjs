// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { posix } from 'node:path';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { rehypePageLinks } from './src/lib/rehype-page-links.ts';

const pageRoutes = JSON.parse(readFileSync(new URL('./src/data/pageRoutes.json', import.meta.url), 'utf-8'));

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
  /** @param {any} tree */
  return (tree) => {
    /** @param {any} node */
    const walk = (node) => {
      if (node.type === 'element' && node.tagName === 'a') {
        const href = node.properties?.href;
        if (typeof href === 'string' && (/^https?:\/\//i.test(href) || /\.pdf$/i.test(href))) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }
      if (node.children) node.children.forEach(walk);
    };
    walk(tree);
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://siebrands.com',
  integrations: [react(), sitemap()],
  redirects: {
    '/projects/pingpong-map/': '/projects/table-hunter/',
  },
  markdown: {
    rehypePlugins: [rehypeNewTabLinks, rehypePageLinks(pageRoutes)],
  },
  vite: {
    plugins: [tailwindcss(), publicDirectoryIndex()],
  },
});