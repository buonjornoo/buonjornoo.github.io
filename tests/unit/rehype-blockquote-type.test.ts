import { describe, expect, it } from 'vitest';
import type { Element, Root, Text } from 'hast';
import { isInterviewQuote, rehypeBlockquoteType } from '../../src/lib/rehype-blockquote-type';

function textNode(value: string): Text {
  return { type: 'text', value };
}

function paragraph(...children: (Text | Element)[]): Element {
  return { type: 'element', tagName: 'p', properties: {}, children };
}

/**
 * Seam: the blockquote-type decision core (src/lib/rehype-blockquote-type.ts).
 * Spec source: DESIGNSYSTEM.md "Blockquote types" — an interview quote is
 * detected by its LAST CHILD paragraph starting with an em dash; everything
 * else is a callout. "Last child" means the last paragraph (a blank line in
 * the source), matching the CSS spec's `.bq-interview > p:last-child` target
 * for the grey attribution line — not the last line of merged text within a
 * single paragraph.
 */
describe('isInterviewQuote', () => {
  it('is a callout when there is only one paragraph and it has no em dash', () => {
    expect(isInterviewQuote([paragraph(textNode('Key learning: ship it.'))])).toBe(false);
  });

  it('is an interview quote when the last paragraph starts with an em dash', () => {
    const children = [paragraph(textNode('Great feature.')), paragraph(textNode('— Head of Marketing, Bikemap'))];
    expect(isInterviewQuote(children)).toBe(true);
  });

  it('is a callout when the last paragraph exists but does not start with an em dash', () => {
    const children = [paragraph(textNode('Great feature.')), paragraph(textNode('Still not an attribution.'))];
    expect(isInterviewQuote(children)).toBe(false);
  });

  it('tolerates leading whitespace before the em dash', () => {
    const children = [paragraph(textNode('Quote.')), paragraph(textNode('  — Attribution'))];
    expect(isInterviewQuote(children)).toBe(true);
  });

  it('reads text across nested inline elements in the last paragraph', () => {
    const children = [
      paragraph(textNode('Quote.')),
      paragraph({ type: 'element', tagName: 'strong', properties: {}, children: [textNode('—')] }, textNode(' Attribution')),
    ];
    expect(isInterviewQuote(children)).toBe(true);
  });

  it('is a callout when there are no element children at all', () => {
    expect(isInterviewQuote([textNode('stray text, no paragraph')])).toBe(false);
  });

  it('does not misclassify a single paragraph merging quote and attribution with no blank line', () => {
    // Known, accepted gap: without a blank line before the attribution,
    // there's no structural boundary in the rendered tree to detect —
    // documented on the plugin itself, not silently wrong.
    expect(isInterviewQuote([paragraph(textNode('Quote text — Attribution'))])).toBe(false);
  });
});

/**
 * Seam: the hast tree walk (rehypeBlockquoteType), which assigns the class
 * without touching anything else in the tree.
 */
describe('rehypeBlockquoteType (hast transform)', () => {
  it('classifies a single-paragraph blockquote as bq-callout', () => {
    const tree: Root = {
      type: 'root',
      children: [
        { type: 'element', tagName: 'blockquote', properties: {}, children: [paragraph(textNode('Key learning: ship it.'))] },
      ],
    };
    rehypeBlockquoteType()(tree);
    const blockquote = tree.children[0] as Element;
    expect(blockquote.properties.className).toEqual(['bq-callout']);
  });

  it('classifies a two-paragraph em-dash-attributed blockquote as bq-interview', () => {
    const tree: Root = {
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'blockquote',
          properties: {},
          children: [paragraph(textNode('Great feature.')), paragraph(textNode('— Head of Marketing, Bikemap'))],
        },
      ],
    };
    rehypeBlockquoteType()(tree);
    const blockquote = tree.children[0] as Element;
    expect(blockquote.properties.className).toEqual(['bq-interview']);
  });

  it('leaves non-blockquote elements untouched', () => {
    const tree: Root = {
      type: 'root',
      children: [{ type: 'element', tagName: 'p', properties: {}, children: [textNode('plain paragraph')] }],
    };
    rehypeBlockquoteType()(tree);
    const p = tree.children[0] as Element;
    expect(p.properties.className).toBeUndefined();
  });
});
