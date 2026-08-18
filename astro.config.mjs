// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
    rehypePlugins: [rehypeNewTabLinks],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});