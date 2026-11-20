import { Moon, Sun, Code2, Settings2, Keyboard } from 'lucide-react';
import type { Theme } from '../types';
import { SHORTCUT_LABELS } from '../libs/shortcuts';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  onToggleOptions: () => void;
  showOptions: boolean;
}

export default function Header({ theme, onThemeToggle, onToggleOptions, showOptions }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-bg-surface border-b border-border-main" role="banner">
      <div className="flex items-center gap-2.5">
        <Code2 size={24} className="text-accent" />
        <h1 className="text-lg font-bold tracking-tight">
          HTML<span className="text-accent font-normal">to</span>MD
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onToggleOptions}
          className={`p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer ${showOptions ? 'bg-bg-hover text-text-primary' : ''}`}
          aria-label="Conversion settings"
          aria-pressed={showOptions}
          title="Conversion Settings"
        >
          <Settings2 size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-bg-toolbar text-text-muted text-xs font-mono">
          <Keyboard size={12} />
          <span>{SHORTCUT_LABELS.copy} copy</span>
        </div>

        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
