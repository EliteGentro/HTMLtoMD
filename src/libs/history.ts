export const MAX_HISTORY = 50;

/**
 * Undo history for the Markdown output.
 *
 * `live` is what the editor shows. Typing only updates `live` (EDIT); the value is
 * committed to `entries` after a pause (COMMIT), so one undo step covers a burst of
 * typing instead of a single keystroke. Conversions are committed immediately (PUSH).
 */
export interface HistoryState {
  entries: string[];
  index: number;
  live: string;
}

export type HistoryAction =
  | { type: 'PUSH'; value: string }
  | { type: 'EDIT'; value: string }
  | { type: 'COMMIT' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'RESET' };

export const initialHistory: HistoryState = { entries: [''], index: 0, live: '' };

function push(state: HistoryState, value: string): HistoryState {
  if (value === state.entries[state.index]) return { ...state, live: value };
  const entries = [...state.entries.slice(0, state.index + 1), value].slice(-MAX_HISTORY);
  return { entries, index: entries.length - 1, live: value };
}

export const hasPendingEdit = (state: HistoryState) => state.live !== state.entries[state.index];

export function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'PUSH':
      return push(state, action.value);
    case 'EDIT':
      return state.live === action.value ? state : { ...state, live: action.value };
    case 'COMMIT':
      return hasPendingEdit(state) ? push(state, state.live) : state;
    case 'UNDO': {
      // Commit an in-progress edit first so redo can bring it back
      const committed = hasPendingEdit(state) ? push(state, state.live) : state;
      if (committed.index === 0) return committed;
      const index = committed.index - 1;
      return { ...committed, index, live: committed.entries[index] };
    }
    case 'REDO': {
      if (hasPendingEdit(state) || state.index >= state.entries.length - 1) return state;
      const index = state.index + 1;
      return { ...state, index, live: state.entries[index] };
    }
    case 'RESET':
      return initialHistory;
  }
}

export const canUndo = (state: HistoryState) => state.index > 0 || hasPendingEdit(state);
export const canRedo = (state: HistoryState) =>
  !hasPendingEdit(state) && state.index < state.entries.length - 1;
