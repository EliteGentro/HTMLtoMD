import React from 'react';
import { Search, Replace, XCircle } from 'lucide-react';

interface ToolbarProps {
    findValue: string;
    replaceValue: string;
    onFindChange: (val: string) => void;
    onReplaceChange: (val: string) => void;
    onApplyReplace: () => void;
    onRemoveEmojis: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
    findValue,
    replaceValue,
    onFindChange,
    onReplaceChange,
    onApplyReplace,
    onRemoveEmojis,
}) => {
    return (
        <div className="bg-bg-toolbar border-t border-border-color p-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Find and Replace Section */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-auto flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-text-secondary" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-bg-surface border border-border-color text-text-primary rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 placeholder-text-secondary transition-colors"
                        placeholder="Find in Markdown..."
                        value={findValue}
                        onChange={(e) => onFindChange(e.target.value)}
                    />
                </div>

                <div className="relative w-full sm:w-auto flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Replace size={16} className="text-text-secondary" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-bg-surface border border-border-color text-text-primary rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 placeholder-text-secondary transition-colors"
                        placeholder="Replace with..."
                        value={replaceValue}
                        onChange={(e) => onReplaceChange(e.target.value)}
                    />
                </div>

                <button
                    onClick={onApplyReplace}
                    disabled={!findValue}
                    className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 dark:focus:ring-offset-bg-main"
                >
                    Replace All
                </button>
            </div>

            {/* Utilities Section */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <button
                    onClick={onRemoveEmojis}
                    className="px-4 py-2 flex items-center justify-center gap-2 bg-bg-surface border border-border-color hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 dark:hover:bg-bg-main dark:hover:border-brand-700 dark:hover:text-brand-400 text-text-secondary text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    <XCircle size={16} />
                    Remove Emojis
                </button>
            </div>
        </div>
    );
};

export default Toolbar;
