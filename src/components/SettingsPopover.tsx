import React, { useEffect, useState } from 'react';
import { ACCENTS } from '../menuData';
import { AccentColor } from '../types';

interface SettingsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccent: string;
  onSelectAccent: (accent: AccentColor) => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  menuKey: string;
  onSetMenuKey: (key: string) => void;
}

export const SettingsPopover: React.FC<SettingsPopoverProps> = ({
  isOpen,
  onClose,
  currentAccent,
  onSelectAccent,
  animationsEnabled,
  onToggleAnimations,
  soundEnabled,
  onToggleSound,
  menuKey,
  onSetMenuKey,
}) => {
  const [isListeningMenuKey, setIsListeningMenuKey] = useState(false);

  // Capture next key for menu toggle
  useEffect(() => {
    if (!isListeningMenuKey) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.key === 'Escape') {
        setIsListeningMenuKey(false);
        return;
      }

      let keyName = e.key.toUpperCase();
      if (e.code === 'Insert') keyName = 'Insert';
      else if (e.code === 'Delete') keyName = 'Delete';
      else if (e.code === 'Home') keyName = 'Home';
      else if (e.code === 'End') keyName = 'End';
      else if (e.code === 'PageUp') keyName = 'PageUp';
      else if (e.code === 'PageDown') keyName = 'PageDown';
      else if (e.key.length === 1) keyName = e.key.toUpperCase();

      onSetMenuKey(keyName);
      setIsListeningMenuKey(false);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isListeningMenuKey, onSetMenuKey]);

  if (!isOpen) return null;

  return (
    <>
      {/* Click outside backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div
        className="absolute top-16 right-4 z-50 w-72 p-4 rounded-xl bg-[#0e0f17]/98 border border-white/15 shadow-2xl text-xs select-none animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent Color Selection (Black Hole / Event Horizon palette) */}
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[#8e93ac]">Esquema Cósmico</span>
            <span className="text-[10px] text-[#7d8299] font-mono">
              {ACCENTS.find((a) => a.c.toLowerCase() === currentAccent.toLowerCase())?.n || 'Custom'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {ACCENTS.map((accent) => {
              const isSelected = accent.c.toLowerCase() === currentAccent.toLowerCase();
              return (
                <button
                  key={accent.c}
                  onClick={() => onSelectAccent(accent)}
                  title={accent.n}
                  style={{ backgroundColor: accent.c }}
                  className={`w-5 h-5 rounded-md rotate-45 transition-transform border cursor-pointer ${
                    isSelected
                      ? 'scale-115 border-white ring-2 ring-white/20'
                      : 'border-white/20 hover:scale-105 opacity-75 hover:opacity-100'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-white/[0.07] my-3" />

        {/* Menu Keybind Section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5 text-[#8e93ac]">
            <span className="font-semibold flex items-center gap-1.5">
              <i className="fas fa-keyboard text-[11px]" />
              Tecla do Menu
            </span>
            <kbd className="px-2 py-0.5 rounded bg-[#161724] border border-white/15 text-[#e6e8f4] font-mono font-bold text-[11px]">
              [{menuKey}]
            </kbd>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={() => setIsListeningMenuKey(true)}
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isListeningMenuKey
                  ? 'bg-[var(--accent)] text-[#07070a] animate-pulse font-bold'
                  : 'bg-[#151724] hover:bg-[#1d2030] text-[#d8dceb] border border-white/15'
              }`}
            >
              {isListeningMenuKey ? 'Pressione a tecla...' : 'Alterar tecla do menu'}
            </button>

            {menuKey !== 'Insert' && (
              <button
                onClick={() => onSetMenuKey('Insert')}
                title="Restaurar tecla padrão (INSERT)"
                className="py-1.5 px-2 rounded-lg bg-[#141620] hover:bg-[#1c1e2b] text-[#7d8299] hover:text-white border border-white/10 text-[10px] cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <p className="mt-1 text-[10px] text-[#55586d]">
            Pressione para ocultar ou exibir o painel completo
          </p>
        </div>

        {/* Separator */}
        <div className="h-px bg-white/[0.07] my-3" />

        {/* Animations Toggle */}
        <div
          onClick={onToggleAnimations}
          className="flex items-center justify-between py-1.5 cursor-pointer text-[#d8dceb] hover:text-white"
        >
          <span className="font-medium">Animações de Interface</span>
          <span className={`sw ${animationsEnabled ? 'on' : ''}`} />
        </div>

        {/* Audio feedback */}
        <div
          onClick={onToggleSound}
          className="flex items-center justify-between py-1.5 cursor-pointer text-[#d8dceb] hover:text-white"
        >
          <span className="font-medium">Sons de Feedback</span>
          <span className={`sw ${soundEnabled ? 'on' : ''}`} />
        </div>
      </div>
    </>
  );
};
