# HTMLtoMD

A fast, client-side HTML-to-Markdown converter. Paste HTML, get clean Markdown — zero backend, zero accounts, zero tracking.

## Features

- **Instant Conversion** — Live HTML → Markdown as you type (200ms debounce)
- **Drag & Drop** — Drop `.html` files directly into the editor
- **Split View** — Side-by-side HTML input and Markdown output
- **Preview Mode** — Rendered Markdown preview
- **Copy & Download** — One-click copy or download as `.md`
- **Find & Replace** — Search and replace in Markdown output
- **Conversion Options** — Customize heading style, bullet markers, code blocks, bold delimiters, and link style
- **Undo / Redo** — Ephemeral history for Markdown edits (up to 50 steps)
- **Dark Mode** — System-aware with manual toggle
- **Keyboard Shortcuts** — `⌘⇧C` copy, `⌘Z` undo, `⌘⇧Z` redo
- **Accessibility** — ARIA labels, keyboard navigation, skip links, `prefers-reduced-motion` support
- **Fully Client-Side** — No data leaves your browser

## Tech Stack

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev) for bundling
- [Tailwind CSS v4](https://tailwindcss.com)
- [Turndown](https://github.com/mixmark-io/turndown) for HTML → Markdown conversion
- [Lucide React](https://lucide.dev) for icons
- [IBM Plex Sans](https://fonts.google.com/specimen/IBM+Plex+Sans) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) typography

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Architecture

```
src/
├── App.tsx                    # Root — orchestrates hooks and layout
├── types.ts                   # Shared TypeScript types and defaults
├── index.css                  # Tailwind + design tokens (light/dark)
├── components/
│   ├── Header.tsx             # Logo, settings toggle, theme switch
│   ├── EditorPanels.tsx       # Split editor with drag & drop
│   ├── Toolbar.tsx            # Find/replace, emoji removal
│   ├── ConversionOptions.tsx  # Turndown configuration panel
│   └── Toast.tsx              # Notification toasts
├── hooks/
│   ├── useTheme.ts            # Theme management + system preference
│   ├── useConverter.ts        # Conversion engine + undo/redo (useReducer)
│   └── useDebounce.ts         # Generic debounce hook
└── libs/
    ├── turndown.ts            # Turndown wrapper with instance caching
    ├── text-utils.ts          # Find/replace, emoji removal
    └── download.ts            # File download utility
```

## Example

Paste this into the HTML panel:

```html
<h1>Hello World</h1>
<p>This is a <strong>bold</strong> paragraph with a <a href="https://example.com">link</a>.</p>
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>
```

Output:

```markdown
# Hello World

This is a **bold** paragraph with a [link](https://example.com).

- Item one
- Item two
```

## Design Principles

- **Stateless** — No accounts, no backend, no persistent storage
- **Fast** — Debounced conversion, cached Turndown instance, lightweight bundle
- **Accessible** — Keyboard-first, ARIA roles, prefers-reduced-motion
- **Minimal** — Clean interface, zero friction workflow

## License

MIT
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
