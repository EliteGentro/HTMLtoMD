import { describe, expect, it } from 'vitest';
import { MAX_HISTORY, canRedo, canUndo, historyReducer, initialHistory, type HistoryAction, type HistoryState } from '../history';

const run = (...actions: HistoryAction[]): HistoryState => actions.reduce(historyReducer, initialHistory);

describe('historyReducer', () => {
  it('groups typing into one undo step until committed', () => {
    const state = run(
      { type: 'PUSH', value: 'base' },
      { type: 'EDIT', value: 'base a' },
      { type: 'EDIT', value: 'base ab' },
      { type: 'EDIT', value: 'base abc' },
      { type: 'COMMIT' },
    );
    expect(state.entries).toEqual(['', 'base', 'base abc']);
    expect(historyReducer(state, { type: 'UNDO' }).live).toBe('base');
  });

  it('undo commits a pending edit so redo restores it', () => {
    const edited = run({ type: 'PUSH', value: 'base' }, { type: 'EDIT', value: 'typed' });
    expect(canUndo(edited)).toBe(true);
    expect(canRedo(edited)).toBe(false);

    const undone = historyReducer(edited, { type: 'UNDO' });
    expect(undone.live).toBe('base');
    expect(historyReducer(undone, { type: 'REDO' }).live).toBe('typed');
  });

  it('push after undo discards the redo branch', () => {
    const state = run(
      { type: 'PUSH', value: 'a' },
      { type: 'PUSH', value: 'b' },
      { type: 'UNDO' },
      { type: 'PUSH', value: 'c' },
    );
    expect(state.entries).toEqual(['', 'a', 'c']);
    expect(canRedo(state)).toBe(false);
  });

  it('ignores duplicate pushes', () => {
    const state = run({ type: 'PUSH', value: 'a' }, { type: 'PUSH', value: 'a' });
    expect(state.entries).toEqual(['', 'a']);
  });

  it(`caps history at ${MAX_HISTORY} entries`, () => {
    const pushes = Array.from({ length: MAX_HISTORY + 10 }, (_, i): HistoryAction => ({ type: 'PUSH', value: `v${i}` }));
    const state = run(...pushes);
    expect(state.entries).toHaveLength(MAX_HISTORY);
    expect(state.live).toBe(`v${MAX_HISTORY + 9}`);
  });

  it('reset clears everything', () => {
    expect(run({ type: 'PUSH', value: 'a' }, { type: 'RESET' })).toEqual(initialHistory);
  });
});
