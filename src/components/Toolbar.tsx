import { useState } from 'react';
import { Search, Replace, XCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { findAndReplaceText, removeEmojis } from '../libs/text-utils';

interface ToolbarProps {
  markdownOutput: string;
  onMarkdownChange: (md: string) => void;
  onToast: (message: string) => void;
}

export default function Toolbar({ markdownOutput, onMarkdownChange, onToast }: ToolbarProps) {
  const [expanded, setExpanded] = useState(false);
  const [findValue, setFindValue] = useState('');
  const [replaceValue, setReplaceValue] = useState('');

  const handleReplace = () => {
    if (!findValue || !markdownOutput) return;
    const result = findAndReplaceText(markdownOutput, findValue, replaceValue);
    if (result !== markdownOutput) {
      onMarkdownChange(result);
      onToast('Replaced all occurrences');
    }
  };

  const handleRemoveEmojis = () => {
    if (!markdownOutput) return;
    const result = removeEmojis(markdownOutput);
    if (result !== markdownOutput) {
      onMarkdownChange(result);
      onToast('Emojis removed');
    }
  };

  return (
    <div className="bg-bg-surface border-t border-border-main">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-2 flex items-center justify-between text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
        aria-expanded={expanded}
        aria-controls="toolbar-content"
      >
        <span className="font-medium uppercase tracking-wider">Tools</span>
        {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {expanded && (
        <div id="toolbar-content" className="px-4 pb-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                className="w-full bg-bg-toolbar border border-border-main rounded-md pl-8 pr-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-border-focus transition-colors"
                placeholder="Find..."
                value={findValue}
                onChange={(e) => setFindValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReplace()}
              />
            </div>
            <div className="relative flex-1">
              <Replace size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                className="w-full bg-bg-toolbar border border-border-main rounded-md pl-8 pr-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-border-focus focus:border-border-focus transition-colors"
                placeholder="Replace with..."
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReplace()}
              />
            </div>
            <button
              onClick={handleReplace}
              disabled={!findValue || !markdownOutput}
              className="px-3 py-1.5 bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-1"
            >
              Replace All
            </button>
          </div>

          <div className="w-px h-6 bg-border-main hidden sm:block" aria-hidden="true" />

          <button
            onClick={handleRemoveEmojis}
            disabled={!markdownOutput}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-bg-toolbar border border-border-main hover:bg-bg-hover text-text-secondary text-sm rounded-md transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-border-focus"
          >
            <XCircle size={14} />
            Remove Emojis
          </button>
        </div>
      )}
    </div>
  );
}
