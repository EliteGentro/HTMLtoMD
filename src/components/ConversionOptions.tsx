import type { ConversionOptions } from '../types';

interface ConversionOptionsPanelProps {
  options: ConversionOptions;
  onChange: (options: ConversionOptions) => void;
}

export default function ConversionOptionsPanel({ options, onChange }: ConversionOptionsPanelProps) {
  const update = <K extends keyof ConversionOptions>(key: K, value: ConversionOptions[K]) => {
    onChange({ ...options, [key]: value });
  };

  const selectClass =
    'bg-bg-toolbar border border-border-main rounded-md px-2 py-1 text-text-primary text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-border-focus';

  return (
    <div className="bg-bg-surface border-b border-border-main px-4 md:px-6 py-3">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <label className="flex items-center gap-2">
          <span className="text-text-secondary whitespace-nowrap text-xs">Headings</span>
          <select
            value={options.headingStyle}
            onChange={(e) => update('headingStyle', e.target.value as 'atx' | 'setext')}
            className={selectClass}
          >
            <option value="atx"># ATX</option>
            <option value="setext">Setext</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-text-secondary whitespace-nowrap text-xs">Bullets</span>
          <select
            value={options.bulletListMarker}
            onChange={(e) => update('bulletListMarker', e.target.value as '-' | '*' | '+')}
            className={selectClass}
          >
            <option value="-">- Dash</option>
            <option value="*">* Asterisk</option>
            <option value="+">+ Plus</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-text-secondary whitespace-nowrap text-xs">Code Blocks</span>
          <select
            value={options.codeBlockStyle}
            onChange={(e) => update('codeBlockStyle', e.target.value as 'fenced' | 'indented')}
            className={selectClass}
          >
            <option value="fenced">``` Fenced</option>
            <option value="indented">  Indented</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-text-secondary whitespace-nowrap text-xs">Bold</span>
          <select
            value={options.strongDelimiter}
            onChange={(e) => update('strongDelimiter', e.target.value as '**' | '__')}
            className={selectClass}
          >
            <option value="**">** Asterisks</option>
            <option value="__">__ Underscores</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span className="text-text-secondary whitespace-nowrap text-xs">Links</span>
          <select
            value={options.linkStyle}
            onChange={(e) => update('linkStyle', e.target.value as 'inlined' | 'referenced')}
            className={selectClass}
          >
            <option value="inlined">[](url) Inline</option>
            <option value="referenced">[1] Referenced</option>
          </select>
        </label>
      </div>
    </div>
  );
}
