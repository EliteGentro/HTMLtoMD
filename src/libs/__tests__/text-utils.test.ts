import { describe, expect, it } from 'vitest';
import { findAndReplaceText, isHtmlFileName, pickPastedHtml, removeEmojis } from '../text-utils';

describe('removeEmojis', () => {
  it('strips pictographic emojis', () => {
    expect(removeEmojis('Hi 🎉 there ✅')).toBe('Hi  there ');
  });
});

describe('findAndReplaceText', () => {
  it('replaces all literal occurrences, including regex characters', () => {
    expect(findAndReplaceText('a.b a.b axb', 'a.b', 'X')).toBe('X X axb');
  });

  it('returns text unchanged for an empty search', () => {
    expect(findAndReplaceText('abc', '', 'X')).toBe('abc');
  });
});

describe('pickPastedHtml', () => {
  it('uses rich HTML when rendered content was copied', () => {
    expect(pickPastedHtml('Hello world', '<p>Hello <b>world</b></p>')).toBe('<p>Hello <b>world</b></p>');
  });

  it('extracts the clipboard fragment', () => {
    const html = '<html><body><!--StartFragment--><p>Hi</p><!--EndFragment--></body></html>';
    expect(pickPastedHtml('Hi', html)).toBe('<p>Hi</p>');
  });

  it('keeps plain paste when HTML source was copied from an editor', () => {
    expect(pickPastedHtml('<div class="a">x</div>', '<span style="color:red">&lt;div</span>')).toBeNull();
  });

  it('keeps plain paste when there is no HTML on the clipboard', () => {
    expect(pickPastedHtml('just text', '')).toBeNull();
  });
});

describe('isHtmlFileName', () => {
  it.each(['a.html', 'B.HTML', 'c.htm', 'd.HtM'])('accepts %s', (name) => {
    expect(isHtmlFileName(name)).toBe(true);
  });

  it.each(['a.md', 'html', 'a.html.txt'])('rejects %s', (name) => {
    expect(isHtmlFileName(name)).toBe(false);
  });
});
