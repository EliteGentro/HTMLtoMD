import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import type { ConversionOptions } from '../types';

let cachedService: TurndownService | null = null;
let cachedOptionsKey = '';

function createService(options: ConversionOptions): TurndownService {
  const service = new TurndownService(options);
  // Tables, strikethrough, task lists
  service.use(gfm);
  // The gfm plugin emits single tildes; double tildes render in more Markdown flavors
  service.addRule('strikethrough', {
    filter: ['del', 's', 'strike'] as TurndownService.Filter,
    replacement: (content) => `~~${content}~~`,
  });
  // Non-content elements whose text would otherwise leak into the output
  // (input is parsed inside a wrapper element, so <head> children like <title> arrive on their own)
  service.remove(['script', 'style', 'noscript', 'head', 'title', 'meta', 'link', 'template', 'iframe']);
  return service;
}

/**
 * Converts raw HTML string to clean Markdown.
 * Caches the TurndownService instance for repeated calls with the same options.
 */
export const htmlToMarkdown = (html: string, options: ConversionOptions): string => {
  if (!html?.trim()) return '';

  const key = JSON.stringify(options);
  if (key !== cachedOptionsKey || !cachedService) {
    cachedService = createService(options);
    cachedOptionsKey = key;
  }

  try {
    return cachedService.turndown(html);
  } catch {
    return '';
  }
};
