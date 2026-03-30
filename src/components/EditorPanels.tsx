import { useState, useCallback, useRef, type DragEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit3, Copy, Check, Download, Trash2, FileText, Undo2, Redo2 } from 'lucide-react';
import { downloadMarkdown } from '../libs/download';

interface EditorPanelsProps {
  htmlInput: string;
  markdownOutput: string;
  onHtmlChange: (html: string) => void;
  onMarkdownChange: (md: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  onToast: (message: string) => void;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function EditorPanels({
  htmlInput,
  markdownOutput,
  onHtmlChange,
  onMarkdownChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onToast,
}: EditorPanelsProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = async () => {
    if (!markdownOutput) return;
    try {
      await navigator.clipboard.writeText(markdownOutput);
      setCopied(true);
      onToast('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Failed to copy');
    }
  };

  const handleDownload = () => {
    if (!markdownOutput) return;
    downloadMarkdown(markdownOutput);
    onToast('Downloaded converted.md');
  };

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/html' || file.name.endsWith('.html') || file.name.endsWith('.htm'))) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = ev.target?.result;
        if (typeof text === 'string') onHtmlChange(text);
      };
      reader.readAsText(file);
    } else {
      const text = e.dataTransfer.getData('text/html') || e.dataTransfer.getData('text/plain');
      if (text) onHtmlChange(text);
    }
  }, [onHtmlChange]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') onHtmlChange(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [onHtmlChange]);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">

      {/* HTML Input Panel */}
      <div
        className={`flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border-main min-h-[35vh] md:min-h-0 transition-colors ${isDragOver ? 'drop-zone-active' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="bg-bg-surface border-b border-border-main px-4 py-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">HTML Input</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover transition-colors cursor-pointer"
              aria-label="Upload HTML file"
              title="Upload .html file"
            >
              <FileText size={14} />
            </button>
            {htmlInput && (
              <button
                onClick={onClear}
                className="p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger-subtle transition-colors cursor-pointer"
                aria-label="Clear all"
                title="Clear all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".html,.htm"
            onChange={handleFileInput}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        <div className="flex-1 relative">
          {!htmlInput && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted pointer-events-none gap-3 p-8">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-border-main flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div className="text-center">
                <p className="font-medium text-text-secondary">Paste HTML or drop a file</p>
                <p className="text-xs mt-1">Supports .html and .htm files</p>
              </div>
            </div>
          )}
          <textarea
            className="absolute inset-0 w-full h-full bg-transparent text-text-primary p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            value={htmlInput}
            onChange={(e) => onHtmlChange(e.target.value)}
            spellCheck={false}
            aria-label="HTML input editor"
          />
        </div>

        {htmlInput && (
          <div className="px-4 py-1 bg-bg-surface border-t border-border-main text-xs text-text-muted flex justify-end gap-3 font-mono">
            <span>{htmlInput.length.toLocaleString()} chars</span>
          </div>
        )}
      </div>

      {/* Markdown Output Panel */}
      <div className="flex-1 flex flex-col min-h-[35vh] md:min-h-0">
        <div className="bg-bg-surface border-b border-border-main px-4 py-2 flex items-center justify-between">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Markdown Output</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Undo"
              title="Undo (⌘Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Redo"
              title="Redo (⌘⇧Z)"
            >
              <Redo2 size={14} />
            </button>

            <div className="w-px h-4 bg-border-main mx-1" aria-hidden="true" />

            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isPreviewMode
                  ? 'text-accent bg-accent-subtle'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
              }`}
              aria-label={isPreviewMode ? 'Switch to edit mode' : 'Switch to preview mode'}
              title={isPreviewMode ? 'Edit' : 'Preview'}
            >
              {isPreviewMode ? <Edit3 size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={handleCopy}
              disabled={!markdownOutput}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                copied
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary hover:bg-bg-hover'
              } disabled:opacity-30 disabled:cursor-not-allowed`}
              aria-label="Copy markdown"
              title="Copy (⌘⇧C)"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button
              onClick={handleDownload}
              disabled={!markdownOutput}
              className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Download as markdown file"
              title="Download .md"
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative">
          {isPreviewMode ? (
            <div className="p-6 prose prose-sm md:prose-base dark:prose-invert max-w-none">
              {markdownOutput ? (
                <ReactMarkdown>{markdownOutput}</ReactMarkdown>
              ) : (
                <p className="text-text-muted italic">Nothing to preview</p>
              )}
            </div>
          ) : (
            <textarea
              className="absolute inset-0 w-full h-full bg-transparent text-text-primary p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              value={markdownOutput}
              onChange={(e) => onMarkdownChange(e.target.value)}
              placeholder="Converted Markdown appears here..."
              spellCheck={false}
              aria-label="Markdown output editor"
            />
          )}
        </div>

        {markdownOutput && (
          <div className="px-4 py-1 bg-bg-surface border-t border-border-main text-xs text-text-muted flex justify-end gap-3 font-mono">
            <span>{wordCount(markdownOutput).toLocaleString()} words</span>
            <span>{markdownOutput.length.toLocaleString()} chars</span>
          </div>
        )}
      </div>

    </div>
  );
}
