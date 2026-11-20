import { useState, useCallback, useEffect, useReducer } from 'react';
import { htmlToMarkdown } from '../libs/turndown';
import { historyReducer, initialHistory, hasPendingEdit, canUndo, canRedo } from '../libs/history';
import { readStorage, writeStorage } from '../libs/storage';
import { useDebounce } from './useDebounce';
import { DEFAULT_CONVERSION_OPTIONS } from '../types';
import type { ConversionOptions } from '../types';

const OPTIONS_STORAGE_KEY = 'htmltomd:options';
const EDIT_COMMIT_DELAY = 500;

function loadOptions(): ConversionOptions {
  // Merge over defaults so options added later still get a value
  return { ...DEFAULT_CONVERSION_OPTIONS, ...readStorage<Partial<ConversionOptions>>(OPTIONS_STORAGE_KEY, {}) };
}

export function useConverter() {
  const [htmlInput, setHtmlInput] = useState('');
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [options, setOptions] = useState<ConversionOptions>(loadOptions);
  const [history, dispatch] = useReducer(historyReducer, initialHistory);

  const debouncedHtml = useDebounce(htmlInput, 200);

  useEffect(() => {
    writeStorage(OPTIONS_STORAGE_KEY, options);
  }, [options]);

  // Auto-convert when debounced HTML or options change
  useEffect(() => {
    const md = htmlToMarkdown(debouncedHtml, options);
    dispatch({ type: 'PUSH', value: md });
  }, [debouncedHtml, options]);

  // Commit manual edits to history once typing pauses
  const pending = hasPendingEdit(history);
  useEffect(() => {
    if (!pending) return;
    const timer = setTimeout(() => dispatch({ type: 'COMMIT' }), EDIT_COMMIT_DELAY);
    return () => clearTimeout(timer);
  }, [pending, history.live]);

  /** Manual typing in the Markdown editor (grouped into undo steps). */
  const editMarkdown = useCallback((newMd: string) => {
    dispatch({ type: 'EDIT', value: newMd });
  }, []);

  /** Whole-document changes (find/replace, emoji removal) — one undo step each. */
  const updateMarkdown = useCallback((newMd: string) => {
    dispatch({ type: 'COMMIT' });
    dispatch({ type: 'PUSH', value: newMd });
  }, []);

  const loadFile = useCallback((html: string, name: string) => {
    setHtmlInput(html);
    setSourceName(name);
  }, []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const clear = useCallback(() => {
    setHtmlInput('');
    setSourceName(null);
    dispatch({ type: 'RESET' });
  }, []);

  const downloadName = sourceName ? sourceName.replace(/\.html?$/i, '') + '.md' : 'converted.md';

  return {
    htmlInput,
    setHtmlInput,
    loadFile,
    downloadName,
    markdownOutput: history.live,
    editMarkdown,
    updateMarkdown,
    options,
    setOptions,
    undo,
    redo,
    canUndo: canUndo(history),
    canRedo: canRedo(history),
    clear,
  };
}
