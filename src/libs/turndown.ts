import TurndownService from 'turndown';

// We instantiate Turndown once to avoid recreating it on every render.
const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced'
});

/**
 * Converts raw HTML string to clean Markdown.
 */
export const htmlToMarkdown = (html: string): string => {
  if (!html || !html.trim()) return '';
  try {
    return turndownService.turndown(html);
  } catch (error) {
    console.error("Error converting HTML to Markdown", error);
    return "";
  }
};
