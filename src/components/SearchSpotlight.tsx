import React, { useEffect, useRef, useState } from 'react';
import { ModuleItemConfig } from '../types';

interface SearchSpotlightProps {
  isOpen: boolean;
  onClose: () => void;
  modules: ModuleItemConfig[];
  moduleStates: Record<string, boolean>;
  onSelectModule: (module: ModuleItemConfig) => void;
}

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const SearchSpotlight: React.FC<SearchSpotlightProps> = ({
  isOpen,
  onClose,
  modules,
  moduleStates,
  onSelectModule,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  const tokens = normalize(query.trim()).split(/\s+/).filter(Boolean);

  const filteredModules = modules.filter((m) => {
    if (tokens.length === 0) return true;
    const searchable = `${normalize(m.page)} ${normalize(m.subLabel || '')} ${normalize(m.card)} ${normalize(m.label)} ${normalize(m.key)}`;
    return tokens.every((token) => searchable.includes(token));
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (filteredModules.length > 0 ? (prev + 1) % filteredModules.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        filteredModules.length > 0 ? (prev - 1 + filteredModules.length) % filteredModules.length : 0
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredModules[selectedIndex]) {
        onSelectModule(filteredModules[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const highlightMatch = (text: string) => {
    if (tokens.length === 0) return text;
    const lower = text.toLowerCase();
    let highlighted = text;
    tokens.forEach((t) => {
      const idx = lower.indexOf(t);
      if (idx !== -1) {
        highlighted =
          text.slice(0, idx) +
          `<mark class="bg-transparent text-[var(--accent)] font-bold underline">${text.slice(idx, idx + t.length)}</mark>` +
          text.slice(idx + t.length);
      }
    });
    return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[540px] bg-[#0c0d14] border border-white/15 rounded-xl shadow-2xl overflow-hidden text-xs"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 h-14 px-4 border-b border-white/[0.07] text-[#797e96]">
          <i className="fas fa-magnifying-glass text-sm" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search modules, commands, or tags..."
            className="flex-1 bg-transparent text-[#d8dceb] text-sm outline-none placeholder:text-[#55586d]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#797e96] hover:text-white text-xs px-1.5 py-0.5 rounded bg-white/[0.05] cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="max-h-[300px] overflow-y-auto p-2 custom-scroll flex flex-col gap-1"
        >
          {filteredModules.length > 0 ? (
            filteredModules.map((m, idx) => {
              const isSel = idx === selectedIndex;
              const isEnabled = !!moduleStates[m.id];
              const path = [m.page, m.subLabel, m.label].filter(Boolean).join(' / ');

              return (
                <div
                  key={m.id}
                  onClick={() => onSelectModule(m)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`relative flex items-center gap-3 h-10 px-3.5 rounded-lg cursor-pointer transition-colors ${
                    isSel ? 'bg-[#151724] text-white' : 'text-[#797e96] hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Left indicator line (solid) */}
                  {isSel && (
                    <span className="absolute left-1 top-2.5 bottom-2.5 w-[3px] rounded bg-[var(--accent)]" />
                  )}

                  <div className="flex-1 min-w-0 flex items-center gap-2">
                    <span className="font-semibold text-[#d8dceb] truncate">
                      {highlightMatch(path)}
                    </span>
                    <span className="text-[#4e5166]">-</span>
                    <span className="text-[var(--accent)] font-mono text-[11px] truncate opacity-90">
                      "{m.key}"
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {m.ban && (
                      <span className="text-[9px] font-bold text-amber-300 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                        Risky
                      </span>
                    )}
                    {m.risky && (
                      <span className="text-[9px] font-bold text-rose-300 bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-500/20">
                        Unsafe
                      </span>
                    )}
                    {isEnabled && (
                      <span
                        className="w-2 h-2 rounded-full bg-[var(--accent)]"
                        title="Ativo"
                      />
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-[#797e96]">
              Nenhum módulo encontrado para "{query}"
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center gap-4 px-4 h-9 border-t border-white/[0.07] text-[11px] text-[#5d6075]">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8e93ac] mr-1">↑↓</kbd>
            navigate
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8e93ac] mr-1">↵</kbd>
            select
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8e93ac] mr-1">ESC</kbd>
            close
          </span>
          <span className="ml-auto text-[10px] text-[#797e96]">
            {filteredModules.length} module{filteredModules.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </div>
  );
};
