import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Root, Text } from 'hast';
import { linkifyPageNumbers, rehypePageLinks } from '../../src/lib/rehype-page-links';

/**
 * Seam: the page-link decision core (src/lib/rehype-page-links.ts).
 * Spec source: issues/12 — "page 205" and "P205" become real links against
 * pageRoutes.json; bare numbers and unregistered numbers never link.
 */
describe('linkifyPageNumbers', () => {
  // Independent source of truth: the shipped route table, not a hand copy.
  const routes = JSON.parse(readFileSync('src/data/pageRoutes.json', 'utf-8')) as Record<
    string,
    string
  >;

  it('links the "page 205" form', () => {
    const segments = linkifyPageNumbers('See page 205 for details.', routes);
    const link = segments.find((s) => s.type === 'link');
    expect(link?.href).toBe('/projects/do24-teal-ui/');
    expect(link?.value).toBe('page 205');
  });

  it('links the "P205" form identically', () => {
    const segments = linkifyPageNumbers('See P205 for details.', routes);
    const link = segments.find((s) => s.type === 'link');
    expect(link?.href).toBe('/projects/do24-teal-ui/');
    expect(link?.value).toBe('P205');
  });

  it('accepts a capitalised "Page" at sentence start', () => {
    const segments = linkifyPageNumbers('Page 205 covers the rest.', routes);
    expect(segments.some((s) => s.type === 'link' && s.href === '/projects/do24-teal-ui/')).toBe(
      true,
    );
  });

  it('never links a bare number with no page/P prefix', () => {
    const segments = linkifyPageNumbers('Type 100 anywhere on the site.', routes);
    expect(segments.every((s) => s.type === 'text')).toBe(true);
  });

  it('leaves an unregistered page number as plain text', () => {
    const segments = linkifyPageNumbers('See page 999 for nothing.', routes);
    expect(segments.every((s) => s.type === 'text')).toBe(true);
    expect(segments.map((s) => s.value).join('')).toBe('See page 999 for nothing.');
  });

  it('never links "p205" (lowercase p, no space)', () => {
    const segments = linkifyPageNumbers('the p205 variable', routes);
    expect(segments.every((s) => s.type === 'text')).toBe(true);
  });

  it('handles multiple references in the same text node', () => {
    const segments = linkifyPageNumbers('page 100 and page 200 both exist.', routes);
    const links = segments.filter((s) => s.type === 'link');
    expect(links.map((l) => l.href)).toEqual(['/', '/projects/']);
  });

  it('preserves surrounding text exactly when reassembled', () => {
    const text = 'Before page 205 middle P400 after.';
    const segments = linkifyPageNumbers(text, routes);
    expect(segments.map((s) => s.value).join('')).toBe(text);
  });
});

/**
 * Seam: the hast tree walk (rehypePageLinks), which turns matched text
 * nodes into real <a> elements while leaving everything else untouched.
 */
describe('rehypePageLinks (hast transform)', () => {
  const routes = JSON.parse(readFileSync('src/data/pageRoutes.json', 'utf-8')) as Record<
    string,
    string
  >;

  function textNode(value: string): Text {
    return { type: 'text', value };
  }

  it('replaces a matched text node with text + <a> + text', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [textNode('go to page 205 now')],
        },
      ],
    };
    rehypePageLinks(routes)(tree);
    const p = tree.children[0] as any;
    expect(p.children).toHaveLength(3);
    expect(p.children[0]).toEqual({ type: 'text', value: 'go to ' });
    expect(p.children[1]).toMatchObject({
      type: 'element',
      tagName: 'a',
      properties: { href: '/projects/do24-teal-ui/' },
      children: [{ type: 'text', value: 'page 205' }],
    });
    expect(p.children[2]).toEqual({ type: 'text', value: ' now' });
  });

  it('leaves a paragraph with no page reference untouched', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [textNode('nothing to see here')],
        },
      ],
    };
    rehypePageLinks(routes)(tree);
    const p = tree.children[0] as any;
    expect(p.children).toEqual([{ type: 'text', value: 'nothing to see here' }]);
  });

  it('does not linkify text already inside an <a>', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'a',
          properties: { href: 'https://example.com' },
          children: [textNode('page 205')],
        },
      ],
    };
    rehypePageLinks(routes)(tree);
    const a = tree.children[0] as any;
    expect(a.children).toEqual([{ type: 'text', value: 'page 205' }]);
  });

  it('does not linkify text inside <code>', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'code',
          properties: {},
          children: [textNode('page 205')],
        },
      ],
    };
    rehypePageLinks(routes)(tree);
    const code = tree.children[0] as any;
    expect(code.children).toEqual([{ type: 'text', value: 'page 205' }]);
  });
});
