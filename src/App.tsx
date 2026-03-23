import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import EditorPanels from './components/EditorPanels';
import Toolbar from './components/Toolbar';
import type { AppState } from './types';
import { htmlToMarkdown } from './libs/turndown';
import { removeEmojis, findAndReplaceText } from './libs/text-utils';

function App() {
  const [state, setState] = useState<AppState>({
    htmlInput: '',
    markdownOutput: '',
    isPreviewMode: false,
    theme: 'light',
    findValue: '',
    replaceValue: '',
  });

  // Apply theme class to document based on state
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const handleThemeToggle = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  // Debounced HTML to Markdown conversion
  useEffect(() => {
    const timer = setTimeout(() => {
      // We only want to one-way sync. We convert when htmlInput changes.
      // Notice: If you want to decouple the textarea completely to prevent loopbacks, 
      // we just do it here. In our app, markdown is derived from HTML, but users can edit markdown.
      // Wait, if the user edits markdown, `htmlInput` does not change, so this effect does not re-run 
      // with the same `htmlInput`. BUT if `htmlInput` changes, we blow away their manual markdown edits.
      // This is expected for "one-way transformation".
      if (state.htmlInput !== undefined) {
        const md = htmlToMarkdown(state.htmlInput);
        setState((prev) => ({
          ...prev,
          markdownOutput: md,
        }));
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [state.htmlInput]);

  const handleHtmlChange = (html: string) => {
    setState((prev) => ({ ...prev, htmlInput: html }));
  };

  const handleMarkdownChange = (md: string) => {
    setState((prev) => ({ ...prev, markdownOutput: md }));
  };

  const handlePreviewToggle = () => {
    setState((prev) => ({ ...prev, isPreviewMode: !prev.isPreviewMode }));
  };

  const handleFindChange = (val: string) => {
    setState((prev) => ({ ...prev, findValue: val }));
  };

  const handleReplaceChange = (val: string) => {
    setState((prev) => ({ ...prev, replaceValue: val }));
  };

  const handleApplyReplace = useCallback(() => {
    if (!state.findValue) return;
    setState((prev) => ({
      ...prev,
      markdownOutput: findAndReplaceText(prev.markdownOutput, prev.findValue, prev.replaceValue),
    }));
  }, [state.findValue, state.replaceValue]);

  const handleRemoveEmojis = useCallback(() => {
    setState((prev) => ({
      ...prev,
      markdownOutput: removeEmojis(prev.markdownOutput),
    }));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-bg-main text-text-primary overflow-hidden font-sans">
      <Header theme={state.theme} onThemeToggle={handleThemeToggle} />

      <main className="flex-1 flex flex-col min-h-0 relative">
        <EditorPanels
          htmlInput={state.htmlInput}
          markdownOutput={state.markdownOutput}
          isPreviewMode={state.isPreviewMode}
          onHtmlChange={handleHtmlChange}
          onMarkdownChange={handleMarkdownChange}
          onPreviewToggle={handlePreviewToggle}
        />

        <Toolbar
          findValue={state.findValue}
          replaceValue={state.replaceValue}
          onFindChange={handleFindChange}
          onReplaceChange={handleReplaceChange}
          onApplyReplace={handleApplyReplace}
          onRemoveEmojis={handleRemoveEmojis}
        />
      </main>
    </div>
  );
}

export default App;
