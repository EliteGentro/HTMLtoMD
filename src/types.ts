export interface AppState {
  htmlInput: string;
  markdownOutput: string;
  isPreviewMode: boolean;
  theme: 'light' | 'dark';
  findValue: string;
  replaceValue: string;
}
