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
