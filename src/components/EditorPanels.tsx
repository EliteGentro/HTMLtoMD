import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit3, Copy, Check } from 'lucide-react';

interface EditorPanelsProps {
    htmlInput: string;
    markdownOutput: string;
    isPreviewMode: boolean;
    onHtmlChange: (html: string) => void;
    onMarkdownChange: (md: string) => void;
    onPreviewToggle: () => void;
}

const EditorPanels: React.FC<EditorPanelsProps> = ({
    htmlInput,
    markdownOutput,
    isPreviewMode,
    onHtmlChange,
    onMarkdownChange,
    onPreviewToggle,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!markdownOutput) return;
        try {
            await navigator.clipboard.writeText(markdownOutput);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">

            {/* HTML Input Panel */}
            <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-border-color min-h-[40vh] md:min-h-0">
                <div className="bg-bg-surface border-b border-border-color px-4 py-2 flex items-center justify-between shadow-sm z-10">
                    <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">HTML Input</h2>
                </div>
                <textarea
                    className="flex-1 w-full bg-bg-main text-text-primary p-4 resize-none focus:outline-none focus:ring-1 focus:ring-inset focus:ring-brand-500 font-mono text-sm leading-relaxed"
                    placeholder="Paste your raw HTML here..."
                    value={htmlInput}
                    onChange={(e) => onHtmlChange(e.target.value)}
                    spellCheck="false"
                />
            </div>

            {/* Markdown Output Panel */}
            <div className="flex-1 flex flex-col min-h-[40vh] md:min-h-0 relative bg-bg-main">
                <div className="bg-bg-surface border-b border-border-color px-4 py-2 flex items-center justify-between shadow-sm z-10 w-full">
                    <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Markdown Output</h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onPreviewToggle}
                            className="flex items-center space-x-1 px-3 py-1.5 rounded-md bg-bg-toolbar hover:bg-border-color text-text-secondary hover:text-text-primary text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {isPreviewMode ? (
                                <>
                                    <Edit3 size={14} className="mr-1" /> Edit
                                </>
                            ) : (
                                <>
                                    <Eye size={14} className="mr-1" /> Preview
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${copied
                                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-700 dark:text-brand-50'
                                    : 'bg-bg-toolbar hover:bg-border-color text-text-secondary hover:text-text-primary'
                                }`}
                            disabled={!markdownOutput}
                        >
                            {copied ? (
                                <>
                                    <Check size={14} className="mr-1" /> Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={14} className="mr-1" /> Copy MD
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto relative">
                    {isPreviewMode ? (
                        <div className="p-6 prose prose-sm md:prose-base dark:prose-invert max-w-none prose-a:text-brand-600 dark:prose-a:text-brand-400">
                            <ReactMarkdown>{markdownOutput}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            className="absolute inset-0 w-full h-full bg-bg-main text-text-primary p-4 resize-none focus:outline-none focus:ring-1 focus:ring-inset focus:ring-brand-500 font-mono text-sm leading-relaxed"
                            value={markdownOutput}
                            onChange={(e) => onMarkdownChange(e.target.value)}
                            placeholder="Converted Markdown will appear here..."
                            spellCheck="false"
                        />
                    )}
                </div>
            </div>

        </div>
    );
};

export default EditorPanels;
