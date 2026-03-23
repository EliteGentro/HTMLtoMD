import React from 'react';
import { Moon, Sun, Code2 } from 'lucide-react';

interface HeaderProps {
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onThemeToggle }) => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-bg-surface border-b border-border-color shadow-sm">
            <div className="flex items-center space-x-3 text-brand-600 dark:text-brand-400">
                <Code2 size={28} />
                <h1 className="text-xl font-bold text-text-primary tracking-wide">
                    HTML<span className="text-brand-500 font-light">to</span>MD
                </h1>
            </div>
            <div>
                <button
                    onClick={onThemeToggle}
                    className="p-2 rounded-full hover:bg-bg-toolbar text-text-secondary hover:text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                    aria-label="Toggle theme"
                    title="Toggle light/dark mode"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>
    );
};

export default Header;
