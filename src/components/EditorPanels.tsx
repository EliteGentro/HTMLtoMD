import { useState, useCallback, useEffect, useRef, type DragEvent, type ClipboardEvent, type KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, Edit3, Copy, Check, Download, Trash2, FileText, Undo2, Redo2 } from 'lucide-react';
import { downloadMarkdown } from '../libs/download';
import { isHtmlFileName, pickPastedHtml } from '../libs/text-utils';
import { SHORTCUT_LABELS, isRedoShortcut, isUndoShortcut } from '../libs/shortcuts';
import type { ShowToast } from '../types';

interface EditorPanelsProps {
  htmlInput: string;
  markdownOutput: string;
  downloadName: string;
  onHtmlChange: (html: string) => void;
  onFileLoad: (html: string, fileName: string) => void;
  onMarkdownEdit: (md: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  onToast: ShowToast;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export default function EditorPanels({
  htmlInput,
  markdownOutput,
  downloadName,
  onHtmlChange,
  onFileLoad,
  onMarkdownEdit,
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
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const handleCopy = async () => {
    if (!markdownOutput) return;
    try {
      await navigator.clipboard.writeText(markdownOutput);
      setCopied(true);
      onToast('Copied to clipboard');
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Failed to copy', 'error');
    }
  };

  const handleDownload = () => {
    if (!markdownOutput) return;
    downloadMarkdown(markdownOutput, downloadName);
    onToast(`Downloaded ${downloadName}`);
  };

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') onFileLoad(text, file.name);
    };
    reader.onerror = () => onToast(`Could not read ${file.name}`, 'error');
    reader.readAsText(file);
  }, [onFileLoad, onToast]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type === 'text/html' || isHtmlFileName(file.name)) readFile(file);
      else onToast('Only .html and .htm files are supported', 'error');
      return;
    }
    const text = e.dataTransfer.getData('text/html') || e.dataTransfer.getData('text/plain');
    if (text) onHtmlChange(text);
  }, [onHtmlChange, onToast, readFile]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  // dragleave also fires when moving onto a child element — ignore those
  const handleDragLeave = useCallback((e: DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFile(file);
    e.target.value = '';
  }, [readFile]);

  // Pasting rendered content (web page, doc, email) inserts its HTML instead of plain text
  const handleHtmlPaste = useCallback((e: ClipboardEvent<HTMLTextAreaElement>) => {
    const html = pickPastedHtml(e.clipboardData.getData('text/plain'), e.clipboardData.getData('text/html'));
    if (html === null) return;
    e.preventDefault();
    const { selectionStart, selectionEnd, value } = e.currentTarget;
    onHtmlChange(value.slice(0, selectionStart) + html + value.slice(selectionEnd));
    onToast('Pasted as HTML');
  }, [onHtmlChange, onToast]);

  // Route undo/redo in the Markdown editor through the app history, which also
  // tracks find/replace and re-conversions that the native textarea undo can't see
  const handleMarkdownKeyDown = useCallback((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (isUndoShortcut(e)) {
      e.preventDefault();
      onUndo();
    } else if (isRedoShortcut(e)) {
      e.preventDefault();
      onRedo();
    }
  }, [onUndo, onRedo]);

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
            accept=".html,.htm,text/html"
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
                <p className="text-xs mt-1">Copy from any web page or doc to paste its HTML · .html and .htm files</p>
              </div>
            </div>
          )}
          <textarea
            className="absolute inset-0 w-full h-full bg-transparent text-text-primary p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
            value={htmlInput}
            onChange={(e) => onHtmlChange(e.target.value)}
            onPaste={handleHtmlPaste}
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
              title={`Undo (${SHORTCUT_LABELS.undo})`}
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Redo"
              title={`Redo (${SHORTCUT_LABELS.redo})`}
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
              title={`Copy (${SHORTCUT_LABELS.copy})`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button
              onClick={handleDownload}
              disabled={!markdownOutput}
              className="p-1.5 rounded-md text-text-muted hover:text-text-secondary hover:bg-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Download as markdown file"
              title={`Download ${downloadName}`}
            >
              <Download size={14} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto relative">
          {isPreviewMode ? (
            <div className="p-6 prose prose-sm md:prose-base dark:prose-invert max-w-none">
              {markdownOutput ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownOutput}</ReactMarkdown>
              ) : (
                <p className="text-text-muted italic">Nothing to preview</p>
              )}
            </div>
          ) : (
            <textarea
              className="absolute inset-0 w-full h-full bg-transparent text-text-primary p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              value={markdownOutput}
              onChange={(e) => onMarkdownEdit(e.target.value)}
              onKeyDown={handleMarkdownKeyDown}
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
