import { useState, useEffect, useCallback } from 'react';
import { useTheme } from './hooks/useTheme';
import { useConverter } from './hooks/useConverter';
import Header from './components/Header';
import EditorPanels from './components/EditorPanels';
import Toolbar from './components/Toolbar';
import ConversionOptionsPanel from './components/ConversionOptions';
import Toast from './components/Toast';

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    htmlInput, setHtmlInput,
    markdownOutput, updateMarkdown,
    options, setOptions,
    undo, redo, canUndo, canRedo,
    clear,
  } = useConverter();

  const [showOptions, setShowOptions] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => setToast(message), []);
  const dismissToast = useCallback(() => setToast(null), []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;

      // Copy markdown: Cmd+Shift+C
      if (mod && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        if (markdownOutput) {
          navigator.clipboard.writeText(markdownOutput).then(() => showToast('Copied to clipboard'));
        }
      }

      // Undo: Cmd+Z (only when not in textarea)
      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          undo();
        }
      }

      // Redo: Cmd+Shift+Z (only when not in textarea)
      if (mod && e.shiftKey && e.key.toLowerCase() === 'z') {
        if (document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [markdownOutput, undo, redo, showToast]);

  return (
    <div className="flex flex-col h-screen bg-bg-main text-text-primary overflow-hidden">
      <a
        href="#editor"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md"
      >
        Skip to editor
      </a>

      <Header
        theme={theme}
        onThemeToggle={toggleTheme}
        onToggleOptions={() => setShowOptions(prev => !prev)}
        showOptions={showOptions}
      />

      {showOptions && (
        <ConversionOptionsPanel options={options} onChange={setOptions} />
      )}

      <main id="editor" className="flex-1 flex flex-col min-h-0">
        <EditorPanels
          htmlInput={htmlInput}
          markdownOutput={markdownOutput}
          onHtmlChange={setHtmlInput}
          onMarkdownChange={updateMarkdown}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onClear={clear}
          onToast={showToast}
        />

        <Toolbar
          markdownOutput={markdownOutput}
          onMarkdownChange={updateMarkdown}
          onToast={showToast}
        />
      </main>

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  );
}

export default App;
