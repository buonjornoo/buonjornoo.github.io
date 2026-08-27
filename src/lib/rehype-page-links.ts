/**
 * Decision core for inline page-number links in markdown prose.
 *
 * Kept as a pure function so the matching rules are testable directly
 * (tests/unit/rehype-page-links.test.ts); rehypePageLinks wires it into the
 * hast tree that Astro's markdown pipeline hands to rehype plugins.
 */

import { SKIP, visit } from 'unist-util-visit';
import type { Element, Root, RootContent, Text } from 'hast';

export interface PageLinkSegment {
  type: 'text' | 'link';
  value: string;
  href?: string;
}

// Explicit forms only: "page 205" / "Page 205" (case-insensitive word,
// required space) or "P205" (capital P, no space). A bare "205" or a
// lowercase "p205" never matches — autolinking bare numbers is out of
// scope (issues/12 boundaries).
const PAGE_REF_PATTERN = /\b(?:[Pp]age\s+(\d{3})|P(\d{3}))\b/g;

export function linkifyPageNumbers(
  text: string,
  routes: Record<string, string>,
): PageLinkSegment[] {
  const segments: PageLinkSegment[] = [];
  let lastIndex = 0;

  // matchAll clones the regex internally, so it never touches a shared
  // lastIndex — safe to call concurrently or re-enter, unlike an exec loop.
  for (const match of text.matchAll(PAGE_REF_PATTERN)) {
    const number = match[1] ?? match[2];
    const href = routes[number];
    // Unregistered number (e.g. "page 999"): leave as plain text, keep
    // scanning from the current position.
    if (!href) continue;

    if (match.index > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: 'link', value: match[0], href });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return segments;
}

// Elements whose text content must never be linkified even when it
// matches: an existing link (avoid nested <a>) or inline/block code.
const SKIP_TAGS = new Set(['a', 'code', 'pre']);

/**
 * Turns validated "page NNN" / "PNNN" references in markdown-rendered
 * prose into real links, modelled on rehypeNewTabLinks in astro.config.mjs
 * — both walk the hast tree via unist-util-visit rather than a hand-rolled
 * recursion. Applies only to content prose — chrome markup never runs
 * through the markdown rehype pipeline.
 */
export function rehypePageLinks(routes: Record<string, string>) {
  return (tree: Root) => {
    visit(tree, ['text', 'element'], (node, index, parent) => {
      if (node.type === 'element') {
        if (SKIP_TAGS.has(node.tagName)) return SKIP;
        return;
      }

      const textNode = node as Text;
      if (!parent || index === undefined) return;

      const segments = linkifyPageNumbers(textNode.value, routes);
      if (!segments.some((s) => s.type === 'link')) return;

      const replacement: RootContent[] = [];
      for (const seg of segments) {
        if (seg.type === 'text') {
          if (seg.value) replacement.push({ type: 'text', value: seg.value });
        } else {
          const link: Element = {
            type: 'element',
            tagName: 'a',
            properties: { href: seg.href },
            children: [{ type: 'text', value: seg.value }],
          };
          replacement.push(link);
        }
      }

      parent.children.splice(index, 1, ...replacement);
      return index + replacement.length;
    });
  };
}
