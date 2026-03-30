import { useState, useCallback, useEffect, useReducer } from 'react';
import { htmlToMarkdown } from '../libs/turndown';
import { useDebounce } from './useDebounce';
import { DEFAULT_CONVERSION_OPTIONS } from '../types';
import type { ConversionOptions } from '../types';

const MAX_HISTORY = 50;

interface HistoryState {
  entries: string[];
  index: number;
}

type HistoryAction =
  | { type: 'PUSH'; value: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'PUSH': {
      if (action.value === state.entries[state.index]) return state;
      const newEntries = [...state.entries.slice(0, state.index + 1), action.value];
      const trimmed = newEntries.length > MAX_HISTORY ? newEntries.slice(-MAX_HISTORY) : newEntries;
      return { entries: trimmed, index: trimmed.length - 1 };
    }
    case 'UNDO':
      return state.index > 0 ? { ...state, index: state.index - 1 } : state;
    case 'REDO':
      return state.index < state.entries.length - 1 ? { ...state, index: state.index + 1 } : state;
    case 'RESET':
      return { entries: [''], index: 0 };
  }
}

export function useConverter() {
  const [htmlInput, setHtmlInput] = useState('');
  const [options, setOptions] = useState<ConversionOptions>(DEFAULT_CONVERSION_OPTIONS);
  const [history, dispatch] = useReducer(historyReducer, { entries: [''], index: 0 });

  const markdownOutput = history.entries[history.index];
  const debouncedHtml = useDebounce(htmlInput, 200);

  // Auto-convert when debounced HTML or options change
  useEffect(() => {
    const md = htmlToMarkdown(debouncedHtml, options);
    dispatch({ type: 'PUSH', value: md });
  }, [debouncedHtml, options]);

  const updateMarkdown = useCallback((newMd: string) => {
    dispatch({ type: 'PUSH', value: newMd });
  }, []);

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const redo = useCallback(() => dispatch({ type: 'REDO' }), []);

  const clear = useCallback(() => {
    setHtmlInput('');
    dispatch({ type: 'RESET' });
  }, []);

  return {
    htmlInput,
    setHtmlInput,
    markdownOutput,
    updateMarkdown,
    options,
    setOptions,
    undo,
    redo,
    canUndo: history.index > 0,
    canRedo: history.index < history.entries.length - 1,
    clear,
  };
}
