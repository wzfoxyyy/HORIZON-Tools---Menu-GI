import React, { useEffect, useRef, useState } from 'react';
import { ModuleItemConfig } from '../types';

interface KeybindModalProps {
  item: ModuleItemConfig | null;
  position: { x: number; y: number } | null;
  currentKey: string | undefined;
  onSaveKeybind: (moduleId: string, key: string | null) => void;
  onClose: () => void;
}

export const KeybindModal: React.FC<KeybindModalProps> = ({
  item,
  position,
  currentKey,
  onSaveKeybind,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Position calculation to avoid overflowing viewport
  const getStyle = () => {
    if (!position) return {};
    const width = 260;
    const height = 160;
    let x = position.x;
    let y = position.y;

    if (x + width > window.innerWidth - 16) {
      x = window.innerWidth - width - 16;
    }
    if (y + height > window.innerHeight - 16) {
      y = position.y - height - 10;
    } else {
      y = y + 10;
    }

    return {
      left: `${Math.max(16, x)}px`,
      top: `${Math.max(16, y)}px`,
    };
  };

  // Keyboard capture while listening
  useEffect(() => {
    if (!isListening || !item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Escape cancels keybinding
      if (e.key === 'Escape') {
        setIsListening(false);
        return;
      }

      // Format key name nicely
      let keyName = e.key.toUpperCase();
      if (e.code === 'Space') keyName = 'SPACE';
      else if (e.code === 'Insert') keyName = 'INS';
      else if (e.code === 'Delete') keyName = 'DEL';
      else if (e.key === 'Control') keyName = 'CTRL';
      else if (e.key === 'Shift') keyName = 'SHIFT';
      else if (e.key === 'Alt') keyName = 'ALT';

      onSaveKeybind(item.id, keyName);
      setIsListening(false);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isListening, item, onSaveKeybind]);

  if (!item || !position) return null;

  return (
    <>
      {/* Click outside to close */}
      <div
        className="fixed inset-0 z-50 bg-transparent"
        onClick={onClose}
        onContextMenu={(e) => {
          e.preventDefault();
          onClose();
        }}
      />

      <div
        ref={cardRef}
        style={getStyle()}
        onClick={(e) => e.stopPropagation()}
        className="fixed z-50 w-[260px] p-3.5 rounded-xl bg-[#0e0f17]/98 border border-white/15 border-l-[3px] border-l-[var(--accent)] shadow-2xl text-xs select-none animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 min-w-0">
            <i className="fas fa-keyboard text-[var(--accent)] text-xs" />
            <span className="font-bold text-[#d8dceb] truncate">
              Bind: {item.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center rounded text-[#7d8299] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer text-sm leading-none"
          >
            ×
          </button>
        </div>

        {/* Keybind Status Display */}
        <div className="flex flex-col items-center gap-2 py-2">
          <span className="text-[11px] text-[#7d8299]">Tecla configurada:</span>

          {currentKey ? (
            <kbd className="px-3.5 py-1.5 rounded-lg bg-[#161724] border border-white/20 text-[#e6e8f4] font-mono font-bold text-sm shadow-sm">
              [{currentKey}]
            </kbd>
          ) : (
            <span className="text-xs text-[#5f637a] italic">Nenhuma tecla vinculada</span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center gap-2">
          <button
            onClick={() => setIsListening(true)}
            className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isListening
                ? 'bg-[var(--accent)] text-[#07070a] animate-pulse font-bold'
                : 'bg-[#181a28] hover:bg-[#202235] text-[#d8dceb] border border-white/15'
            }`}
          >
            {isListening ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                Pressione a tecla...
              </>
            ) : (
              'Definir Tecla'
            )}
          </button>

          {currentKey && (
            <button
              onClick={() => {
                onSaveKeybind(item.id, null);
                setIsListening(false);
              }}
              title="Remover tecla vinculada"
              className="py-1.5 px-2.5 rounded-lg bg-[#1a1215] hover:bg-[#2b161c] text-rose-300 border border-rose-500/30 text-xs font-semibold transition-colors cursor-pointer"
            >
              Limpar
            </button>
          )}
        </div>

        <p className="mt-2 text-[10px] text-[#55586d] text-center">
          Pressione a tecla no teclado para ligar/desligar
        </p>
      </div>
    </>
  );
};
