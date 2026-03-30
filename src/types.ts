export type Theme = 'light' | 'dark';

export interface ConversionOptions {
  headingStyle: 'atx' | 'setext';
  bulletListMarker: '-' | '*' | '+';
  codeBlockStyle: 'fenced' | 'indented';
  hr: string;
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
