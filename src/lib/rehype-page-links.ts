/**
 * Decision core for inline page-number links in markdown prose.
 *
 * Kept as a pure function so the matching rules are testable directly
 * (tests/unit/rehype-page-links.test.ts); rehypePageLinks wires it into the
 * hast tree that Astro's markdown pipeline hands to rehype plugins.
 */

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
  let match: RegExpExecArray | null;

  PAGE_REF_PATTERN.lastIndex = 0;
  while ((match = PAGE_REF_PATTERN.exec(text)) !== null) {
    const number = match[1] ?? match[2];
    const href = routes[number];
    // Unregistered number (e.g. "page 999"): leave as plain text, keep
    // scanning from the current position — do not advance lastIndex.
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
 * prose into real links, modelled on rehypeNewTabLinks in astro.config.mjs.
 * Applies only to content prose — chrome markup never runs through the
 * markdown rehype pipeline.
 */
export function rehypePageLinks(routes: Record<string, string>) {
  /** @param {any} tree */
  return (tree: any) => {
    const walk = (node: any) => {
      if (!node.children) return;
      if (node.type === 'element' && SKIP_TAGS.has(node.tagName)) return;

      const newChildren: any[] = [];
      for (const child of node.children) {
        if (child.type === 'text') {
          const segments = linkifyPageNumbers(child.value, routes);
          const hasLink = segments.some((s) => s.type === 'link');
          if (!hasLink) {
            newChildren.push(child);
            continue;
          }
          for (const seg of segments) {
            if (seg.type === 'text') {
              if (seg.value) newChildren.push({ type: 'text', value: seg.value });
            } else {
              newChildren.push({
                type: 'element',
                tagName: 'a',
                properties: { href: seg.href },
                children: [{ type: 'text', value: seg.value }],
              });
            }
          }
        } else {
          walk(child);
          newChildren.push(child);
        }
      }
      node.children = newChildren;
    };
    walk(tree);
  };
}
