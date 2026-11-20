export type Theme = 'light' | 'dark';

export type ToastType = 'success' | 'error';

export type ShowToast = (message: string, type?: ToastType) => void;

export interface ConversionOptions {
  headingStyle: 'atx' | 'setext';
  bulletListMarker: '-' | '*' | '+';
  codeBlockStyle: 'fenced' | 'indented';
  hr: '---' | '***' | '___';
  strongDelimiter: '**' | '__';
  emDelimiter: '*' | '_';
  linkStyle: 'inlined' | 'referenced';
}

export const DEFAULT_CONVERSION_OPTIONS: ConversionOptions = {
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  hr: '---',
  strongDelimiter: '**',
  emDelimiter: '*',
  linkStyle: 'inlined',
};
