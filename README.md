# HTMLtoMD

A fast, client-side HTML-to-Markdown converter. Paste HTML, get clean Markdown — zero backend, zero accounts, zero tracking.

## Features

- **Instant Conversion** — Live HTML → Markdown as you type (200ms debounce)
- **GitHub Flavored Markdown** — Tables, strikethrough (`~~text~~`) and task lists
- **Clean Output** — `<script>`, `<style>`, `<head>` and other non-content elements are dropped
- **Paste Rendered Content** — Copy from any web page, doc or email and paste; its HTML is used automatically (pasting HTML source still works as plain text)
- **Drag & Drop** — Drop `.html` / `.htm` files directly into the editor
- **Split View** — Side-by-side HTML input and Markdown output
- **Preview Mode** — Rendered Markdown preview, including GFM tables
- **Copy & Download** — One-click copy, or download as `.md` named after the source file
- **Find & Replace** — Search and replace in Markdown output
- **Conversion Options** — Heading style, bullet markers, code blocks, bold and italic delimiters, horizontal rule, link style — remembered between visits
- **Undo / Redo** — History for Markdown edits (up to 50 steps); typing is grouped into one step per pause
- **Dark Mode** — Follows the system theme until you pick one; your choice is remembered, with no flash on load
- **Keyboard Shortcuts** — Copy `⌥⇧C` (`Alt+Shift+C`), undo `⌘Z` (`Ctrl+Z`), redo `⌘⇧Z` (`Ctrl+Y`)
- **Installable & Offline** — PWA; works without a connection once loaded
- **Accessibility** — ARIA labels, keyboard navigation, skip links, `prefers-reduced-motion` support
- **Fully Client-Side** — No data leaves your browser

## Tech Stack

- [React 19](https://react.dev) + TypeScript
- [Vite](https://vite.dev) for bundling, [vite-plugin-pwa](https://vite-pwa-org.netlify.app) for offline support
- [Tailwind CSS v4](https://tailwindcss.com)
- [Turndown](https://github.com/mixmark-io/turndown) + [turndown-plugin-gfm](https://github.com/mixmark-io/turndown-plugin-gfm) for HTML → Markdown conversion
- [react-markdown](https://github.com/remarkjs/react-markdown) + [remark-gfm](https://github.com/remarkjs/remark-gfm) for the preview
- [Vitest](https://vitest.dev) for tests
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

# Preview production build (service worker active here, not in dev)
npm run preview

# Lint
npm run lint

# Tests
npm test            # single run
npm run test:watch  # watch mode

# Regenerate PWA icons after editing public/favicon.svg
npm run generate-pwa-assets
```

## Architecture

```
src/
├── App.tsx                    # Root — orchestrates hooks, layout, global shortcuts, toasts
├── types.ts                   # Shared TypeScript types and defaults
├── index.css                  # Tailwind + design tokens (light/dark)
├── turndown-plugin-gfm.d.ts   # Type declarations for the GFM plugin
├── components/
│   ├── Header.tsx             # Logo, settings toggle, theme switch
│   ├── EditorPanels.tsx       # Split editor with drag & drop and rich paste
│   ├── Toolbar.tsx            # Find/replace, emoji removal
│   ├── ConversionOptions.tsx  # Turndown configuration panel
│   └── Toast.tsx              # Success / error notification toasts
├── hooks/
│   ├── useTheme.ts            # System-following theme with persisted override
│   ├── useConverter.ts        # Conversion, persisted options, undo/redo wiring
│   └── useDebounce.ts         # Generic debounce hook
└── libs/
    ├── turndown.ts            # Turndown + GFM, element removal, instance caching
    ├── history.ts             # Undo/redo reducer with grouped edits
    ├── shortcuts.ts           # Keyboard shortcut matching and platform labels
    ├── storage.ts             # Safe localStorage helpers
    ├── text-utils.ts          # Find/replace, emoji removal, paste handling
    ├── download.ts            # File download utility
    └── __tests__/             # Vitest unit tests
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
<table>
  <tr><th>Name</th><th>Status</th></tr>
  <tr><td>Docs</td><td><del>draft</del> done</td></tr>
</table>
```

Output:

```markdown
# Hello World

This is a **bold** paragraph with a [link](https://example.com).

-   Item one
-   Item two

| Name | Status |
| --- | --- |
| Docs | ~~draft~~ done |
```

## Design Principles

- **Private** — No accounts, no backend; only your theme and conversion options are kept, in your browser's localStorage
- **Fast** — Debounced conversion, cached Turndown instance, lightweight bundle
- **Accessible** — Keyboard-first, ARIA roles, prefers-reduced-motion
- **Minimal** — Clean interface, zero friction workflow

## License

MIT
