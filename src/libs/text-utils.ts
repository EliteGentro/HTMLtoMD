/**
 * Removes all emojis from the given text string.
 * This utilizes a Unicode range regular expression that targets most emojis.
 */
export const removeEmojis = (text: string): string => {
  if (!text) return '';
  // Unicode property escapes for emojis
  return text.replace(/\p{Extended_Pictographic}/gu, '');
};

/**
 * Performs a simple find and replace all instances of a pattern in the text.
 */
export const findAndReplaceText = (
  text: string,
  find: string,
  replace: string
): string => {
  if (!text || !find) return text;
  
  // Escape the find string so that regex characters are treated as literals
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapeRegExp(find), 'g');
  
  return text.replace(regex, replace);
};

/**
 * Decides what to insert when something is pasted into the HTML input.
 *
 * Returns the rich `text/html` clipboard payload when the user copied rendered
 * content (a web page, Google Doc, email), or `null` to keep the browser's default
 * plain-text paste, e.g. when the plain text is itself HTML source copied from an
 * editor (editors also put syntax-highlighted HTML on the clipboard).
 */
export const pickPastedHtml = (plain: string, html: string): string | null => {
  if (!html.trim()) return null;
  if (/^\s*</.test(plain) && /<\/?[a-z][^>]*>/i.test(plain)) return null;

  // Browsers wrap copied selections in StartFragment/EndFragment markers
  const fragment = html.match(/<!--StartFragment-->([\s\S]*?)<!--EndFragment-->/);
  return (fragment ? fragment[1] : html).trim();
};

/** True for file names ending in .html / .htm (any case). */
export const isHtmlFileName = (name: string): boolean => /\.html?$/i.test(name);
