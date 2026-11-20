import { describe, expect, it } from 'vitest';
import { htmlToMarkdown } from '../turndown';
import { DEFAULT_CONVERSION_OPTIONS } from '../../types';

const convert = (html: string, overrides = {}) =>
  htmlToMarkdown(html, { ...DEFAULT_CONVERSION_OPTIONS, ...overrides });

describe('htmlToMarkdown', () => {
  it('returns empty string for blank input', () => {
    expect(convert('   ')).toBe('');
  });

  it('converts basic markup', () => {
    expect(convert('<h1>Title</h1><p>Some <strong>bold</strong> and <em>italic</em></p>'))
      .toBe('# Title\n\nSome **bold** and *italic*');
  });

  it('drops script, style and head contents', () => {
    const md = convert(
      '<html><head><title>T</title><style>.a{color:red}</style></head>' +
      '<body><script>alert(1)</script><noscript>no js</noscript><p>Body</p></body></html>'
    );
    expect(md).toBe('Body');
  });

  it('converts tables to GFM', () => {
    const md = convert('<table><thead><tr><th>A</th><th>B</th></tr></thead><tbody><tr><td>1</td><td>2</td></tr></tbody></table>');
    expect(md).toBe('| A | B |\n| --- | --- |\n| 1 | 2 |');
  });

  it('converts strikethrough with double tildes', () => {
    expect(convert('<p><del>gone</del> <s>old</s></p>')).toBe('~~gone~~ ~~old~~');
  });

  it('converts task list items', () => {
    expect(convert('<ul><li><input type="checkbox" checked> done</li></ul>')).toMatch(/^-\s+\[x\]\s+done$/);
  });

  it('applies conversion options', () => {
    expect(convert('<p><em>a</em></p><hr><ul><li>x</li></ul>', { emDelimiter: '_', hr: '***', bulletListMarker: '*' }))
      .toMatch(/^_a_\n\n\*\*\*\n\n\*\s+x$/);
  });
});
