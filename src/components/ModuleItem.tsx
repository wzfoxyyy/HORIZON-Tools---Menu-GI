import React, { useRef } from 'react';
import { ModuleControl, ModuleItemConfig } from '../types';

interface ModuleItemProps {
  item: ModuleItemConfig;
  isOn: boolean;
  isOpen: boolean;
  controlValues: Record<string, any>;
  boundKey?: string;
  onToggle: (id: string, e?: React.MouseEvent) => void;
  onToggleOpen: (id: string) => void;
  onControlChange: (controlId: string, value: any) => void;
  onShowInfo: (item: ModuleItemConfig, rect: DOMRect) => void;
  onHideInfo: () => void;
  onActionClick?: (item: ModuleItemConfig) => void;
  onOpenKeybind?: (item: ModuleItemConfig, pos: { x: number; y: number }) => void;
}

export const ModuleItem: React.FC<ModuleItemProps> = ({
  item,
  isOn,
  isOpen,
  controlValues,
  boundKey,
  onToggle,
  onToggleOpen,
  onControlChange,
  onShowInfo,
  onHideInfo,
  onActionClick,
  onOpenKeybind,
}) => {
  const headRef = useRef<HTMLDivElement>(null);
  const infoBtnRef = useRef<HTMLButtonElement>(null);

  const handleHeadClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If clicked on chevron, info button, or action button, do not toggle module switch
    const target = e.target as HTMLElement;
    if (target.closest('.no-header-toggle')) return;

    if (item.on !== undefined) {
      onToggle(item.id, e);
    } else if (item.body) {
      onToggleOpen(item.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenKeybind) {
      onOpenKeybind(item, { x: e.clientX, y: e.clientY });
    }
  };

  const handleInfoHover = () => {
    if (infoBtnRef.current) {
      onShowInfo(item, infoBtnRef.current.getBoundingClientRect());
    }
  };

  const renderControl = (ctrl: ModuleControl, idx: number) => {
    const val = controlValues[ctrl.id] ?? (ctrl.type === 'toggle' ? ctrl.on : (ctrl as any).value);

    return (
      <div
        key={ctrl.id}
        style={{ animationDelay: `${idx * 40}ms` }}
        className="flex items-center gap-3 px-3.5 py-2.5 min-h-[48px] border-t border-white/[0.05] text-xs font-medium"
      >
        <span className={`text-[#797e96] shrink-0 ${ctrl.type === 'toggle' ? 'flex-1' : 'w-[110px]'}`}>
          {ctrl.label}
        </span>

        {ctrl.type === 'slider' && (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {ctrl.min === ctrl.max ? (
              <span className="ml-auto inline-flex items-center gap-1.5 h-7 px-2.5 rounded bg-[#13151f] text-[#797e96] text-xs font-semibold">
                {Number(val).toFixed(ctrl.dec ?? 0)}
                <i className="fas fa-lock text-[10px] opacity-60" title="Fixed value" />
              </span>
            ) : (
              <>
                <input
                  type="range"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.dec !== undefined ? Math.pow(10, -ctrl.dec) : 1}
                  value={val}
                  style={{
                    ['--p' as any]: `${((Number(val) - ctrl.min) / (ctrl.max - ctrl.min || 1)) * 100}%`,
                  }}
                  onChange={(e) => onControlChange(ctrl.id, parseFloat(e.target.value))}
                  className="custom-slider"
                />
                <input
                  type="number"
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.dec !== undefined ? Math.pow(10, -ctrl.dec) : 1}
                  value={Number(val).toFixed(ctrl.dec ?? 0)}
                  onChange={(e) => {
                    const parsed = parseFloat(e.target.value);
                    if (!isNaN(parsed)) {
                      const clamped = Math.min(ctrl.max, Math.max(ctrl.min, parsed));
                      onControlChange(ctrl.id, clamped);
                    }
                  }}
                  className="w-14 h-7 text-center rounded bg-[#13151f] border border-white/[0.08] focus:border-[var(--accent)] text-[#d4d8ea] text-xs outline-none transition-colors"
                />
              </>
            )}
          </div>
        )}

        {ctrl.type === 'input' && (
          <input
            type="text"
            value={val || ''}
            placeholder={ctrl.placeholder || ''}
            onChange={(e) => onControlChange(ctrl.id, e.target.value)}
            className="flex-1 h-7 px-2.5 rounded bg-[#13151f] border border-white/[0.08] focus:border-[var(--accent)] text-[#d4d8ea] text-xs outline-none transition-colors placeholder:text-[#50546c]"
          />
        )}

        {ctrl.type === 'toggle' && (
          <span
            onClick={() => onControlChange(ctrl.id, !val)}
            className={`sw ${val ? 'on' : ''}`}
          />
        )}

        {ctrl.type === 'button' && (
          <button
            onClick={() => ctrl.onClick?.()}
            className="ml-auto h-7 px-3 rounded border border-white/20 hover:bg-white/10 text-[#d8dceb] text-xs font-semibold transition-colors cursor-pointer"
          >
            {ctrl.text || ctrl.label}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      id={`module-${item.id}`}
      onContextMenu={handleContextMenu}
      className={`relative bg-[#111219] border rounded-lg overflow-hidden transition-all duration-200 ${
        isOn ? 'border-white/20 bg-[#131520]' : 'border-white/[0.06] hover:border-white/[0.12]'
      }`}
    >
      {/* Left Active Solid Bar */}
      <span
        className={`absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--accent)] z-10 transition-all duration-200 ${
          isOn ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
        }`}
      />

      {/* Module Header */}
      <div
        ref={headRef}
        onClick={handleHeadClick}
        className="relative overflow-hidden h-[46px] px-3.5 flex items-center justify-between cursor-pointer select-none group"
      >
        {/* Label & Badges */}
        <div className="flex items-center gap-2 min-w-0 z-10">
          <span className="font-semibold text-xs sm:text-[13px] text-[#d8dceb] truncate group-hover:text-white transition-colors">
            {item.label}
          </span>

          {/* Bound Key Badge */}
          {boundKey && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenKeybind) {
                  const rect = (e.target as HTMLElement).getBoundingClientRect();
                  onOpenKeybind(item, { x: rect.left, y: rect.bottom });
                }
              }}
              title={`Atalho configurado: [${boundKey}] (Clique com botão direito no módulo para alterar)`}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#181a28] text-[var(--accent)] border border-white/20 text-[10px] font-mono font-bold shadow-sm shrink-0 hover:bg-white/10 transition-colors"
            >
              [{boundKey}]
            </span>
          )}

          {/* Info Button */}
          {item.info && (
            <button
              ref={infoBtnRef}
              type="button"
              onMouseEnter={handleInfoHover}
              onMouseLeave={onHideInfo}
              onClick={(e) => {
                e.stopPropagation();
                handleInfoHover();
              }}
              className={`no-header-toggle w-5 h-5 flex items-center justify-center rounded-full transition-transform hover:scale-110 cursor-pointer ${
                item.info.type === 'danger'
                  ? 'text-rose-400'
                  : item.info.type === 'warn'
                  ? 'text-amber-400'
                  : 'text-[#6a6e87] hover:text-[#cacede]'
              }`}
              title="Informações do módulo"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="8" cy="8" r="6.6" />
                <path d="M8 7.3v3.9M8 4.8v.01" />
              </svg>
            </button>
          )}

          {/* Risky Badge (Matte) */}
          {item.ban && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-tight text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded px-1.5 py-0.5 shrink-0">
              <i className="fas fa-triangle-exclamation text-[9px]" />
              Risky
            </span>
          )}

          {/* Unsafe Badge (Matte) */}
          {item.risky && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-tight text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded px-1.5 py-0.5 shrink-0">
              <i className="fas fa-skull text-[9px]" />
              Unsafe
            </span>
          )}
        </div>

        {/* Action, Switch & Chevron */}
        <div className="flex items-center gap-2.5 z-10 shrink-0">
          {item.action && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onActionClick?.(item);
              }}
              className="no-header-toggle h-7 px-3 rounded border border-white/20 text-[#d8dceb] hover:bg-white/10 text-xs font-semibold transition-colors cursor-pointer"
            >
              {item.action}
            </button>
          )}

          {item.on !== undefined && (
            <span className={`sw ${isOn ? 'on' : ''}`} />
          )}

          {item.body && item.body.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleOpen(item.id);
              }}
              aria-label="Expand or collapse"
              className="no-header-toggle w-6 h-6 rounded flex items-center justify-center text-[#797e96] hover:text-[#d8dceb] hover:bg-white/[0.05] transition-colors cursor-pointer"
            >
              <i
                className={`fas fa-chevron-up text-[10px] transition-transform duration-250 ${
                  isOpen ? 'rotate-0' : 'rotate-180'
                }`}
              />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Controls Drawer */}
      {item.body && item.body.length > 0 && (
        <div
          className={`grid transition-[grid-template-rows] duration-250 ease-out ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden bg-[#0e0f17]">
            <div className={`transition-opacity duration-200 ${isOn ? 'opacity-100' : 'opacity-40'}`}>
              {item.body.map((ctrl, i) => renderControl(ctrl, i))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
