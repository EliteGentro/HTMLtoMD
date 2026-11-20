export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

/** Human-readable shortcut labels for the current platform. */
export const SHORTCUT_LABELS = isMac
  ? { copy: '⌥⇧C', undo: '⌘Z', redo: '⌘⇧Z' }
  : { copy: 'Alt+Shift+C', undo: 'Ctrl+Z', redo: 'Ctrl+Y' };

type Key = Pick<KeyboardEvent, 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'key' | 'code'>;

const mod = (e: Key) => e.metaKey || e.ctrlKey;

// Alt+Shift+C — Ctrl/Cmd+Shift+C opens the DevTools element picker in Chrome/Firefox.
// Match on `code` because Option+Shift+C types "Ç" on macOS.
export const isCopyShortcut = (e: Key) => e.altKey && e.shiftKey && !mod(e) && e.code === 'KeyC';

export const isUndoShortcut = (e: Key) => mod(e) && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'z';

export const isRedoShortcut = (e: Key) =>
  mod(e) && !e.altKey && ((e.shiftKey && e.key.toLowerCase() === 'z') || (!e.shiftKey && e.key.toLowerCase() === 'y'));
