/**
 * Decision core for the blockquote-type split (DESIGNSYSTEM.md "Blockquote
 * types"): every markdown blockquote is either an interview quote (cyan
 * border/text, grey attribution) or a callout (plain white), with no new
 * authoring syntax — the signal is already there in existing prose.
 *
 * Kept as a pure function so the detection rule is testable directly
 * (tests/unit/rehype-blockquote-type.test.ts); rehypeBlockquoteType wires it
 * into the hast tree, same pattern as rehype-page-links.ts.
 */

import { visit } from 'unist-util-visit';
import type { Element, Root, RootContent, Text } from 'hast';

function textContent(node: RootContent): string {
  if (node.type === 'text') return (node as Text).value;
  if ('children' in node) return node.children.map(textContent).join('');
  return '';
}

/**
 * "Last child" means the last paragraph — a blank line in the markdown
 * source — not the last line of text merged into one paragraph. This
 * matches the CSS spec's `.bq-interview > p:last-child` target for the
 * grey attribution line, which only makes sense as its own paragraph.
 * A quote whose attribution shares a paragraph with the quote text (no
 * blank line before it) has no structural boundary to detect here and is
 * classified as a callout — a known, accepted gap, not a silent bug.
 */
export function isInterviewQuote(children: RootContent[]): boolean {
  const lastElement = [...children].reverse().find(
    (child): child is Element => child.type === 'element',
  );
  if (!lastElement) return false;
  return textContent(lastElement).trimStart().startsWith('—');
}

/**
 * Assigns `.bq-interview` or `.bq-callout` to every blockquote in the tree.
 * Applies only to markdown-rendered content prose — chrome markup never
 * runs through the markdown rehype pipeline.
 */
export function rehypeBlockquoteType() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return;
      const className = isInterviewQuote(node.children) ? 'bq-interview' : 'bq-callout';
      node.properties = { ...node.properties, className: [className] };
    });
  };
}
