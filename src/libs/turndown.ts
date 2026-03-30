import TurndownService from 'turndown';
import type { ConversionOptions } from '../types';

let cachedService: TurndownService | null = null;
let cachedOptionsKey = '';

/**
 * Converts raw HTML string to clean Markdown.
 * Caches the TurndownService instance for repeated calls with the same options.
 */
export const htmlToMarkdown = (html: string, options: ConversionOptions): string => {
  if (!html?.trim()) return '';

  const key = JSON.stringify(options);
  if (key !== cachedOptionsKey || !cachedService) {
    cachedService = new TurndownService(options);
    cachedOptionsKey = key;
  }

  try {
    return cachedService.turndown(html);
  } catch {
    return '';
  }
};
