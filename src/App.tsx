import { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useConverter } from './hooks/useConverter';
import { isCopyShortcut, isRedoShortcut, isUndoShortcut } from './libs/shortcuts';
import Header from './components/Header';
import EditorPanels from './components/EditorPanels';
import Toolbar from './components/Toolbar';
import ConversionOptionsPanel from './components/ConversionOptions';
import Toast from './components/Toast';
import type { ShowToast, ToastType } from './types';

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const {
    htmlInput, setHtmlInput, loadFile, downloadName,
    markdownOutput, editMarkdown, updateMarkdown,
    options, setOptions,
    undo, redo, canUndo, canRedo,
    clear,
  } = useConverter();

  const [showOptions, setShowOptions] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastId = useRef(0);

  // A fresh id per call restarts the toast even when the message repeats
  const showToast: ShowToast = useCallback((message, type = 'success') => {
    setToast({ id: ++toastId.current, message, type });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isCopyShortcut(e)) {
        e.preventDefault();
        if (markdownOutput) {
          navigator.clipboard.writeText(markdownOutput).then(
            () => showToast('Copied to clipboard'),
            () => showToast('Failed to copy', 'error'),
          );
        }
        return;
      }

      // Outside text fields only — textareas handle their own undo/redo
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;

      if (isUndoShortcut(e)) {
        e.preventDefault();
        undo();
      } else if (isRedoShortcut(e)) {
        e.preventDefault();
        redo();
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
          downloadName={downloadName}
          onHtmlChange={setHtmlInput}
          onFileLoad={loadFile}
          onMarkdownEdit={editMarkdown}
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

      {toast && (
        <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={dismissToast} />
      )}
    </div>
  );
}

export default App;
