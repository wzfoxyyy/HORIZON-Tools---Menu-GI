import { motion } from 'motion/react';
import React from 'react';
import { APP_INFO } from '../menuData';
import { SubPageConfig } from '../types';
import { HorizonLogo } from './HorizonLogo';

interface HeaderProps {
  currentTab: string;
  subPages: SubPageConfig[];
  activeSubId: string;
  onSelectSub: (subId: string) => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
  isSettingsOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  subPages,
  activeSubId,
  onSelectSub,
  onOpenSettings,
  onOpenSearch,
  isSettingsOpen = false,
}) => {
  const showSubtabs = subPages.length > 1;

  return (
    <header className="flex items-center gap-4 px-5 h-[60px] border-b border-white/[0.07] bg-[#07070a] select-none shrink-0">
      {/* Brand area with Recreated Black Hole SVG Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <HorizonLogo size={34} />
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-[15.5px] tracking-tight text-[#d8dceb] font-sans">
            {APP_INFO.name}
          </span>
          <span className="text-[10px] font-bold tracking-wider text-[#9aa0b8] bg-[#12131c] border border-white/10 rounded px-1.5 py-0.5 uppercase">
            {APP_INFO.badge}
          </span>
        </div>
      </div>

      {/* Status Indicators with smooth pulsing dots */}
      <div className="hidden sm:flex items-center gap-2.5 pl-3.5 border-l border-white/[0.07] text-xs font-medium text-[#797e96]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>Updating to v.7.2</span>
      </div>

      {/* Static "Not Connected*" Indicator with breathing amber pulse */}
      <div
        className="hidden md:flex items-center gap-2.5 pl-3 border-l border-white/[0.07] text-xs font-medium text-[#797e96] cursor-default"
        title="Status de Conexão com o Jogo (Modo Automático)"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
        </span>
        <span>Not Connected*</span>
      </div>

      {/* Subtabs Bar with fluid sliding pill animation */}
      {showSubtabs && (
        <div className="flex items-center pl-3.5 border-l border-white/[0.07]">
          <nav
            className="relative flex items-center gap-0.5 bg-[#0b0c13] p-0.5 rounded-lg border border-white/[0.08]"
            aria-label="Sub categories"
          >
            {subPages.map((sub) => {
              const isActive = sub.id === activeSubId;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSub(sub.id)}
                  type="button"
                  className={`relative h-7 px-2.5 rounded-[5px] text-xs font-semibold cursor-pointer transition-colors duration-150 flex items-center justify-center select-none ${
                    isActive
                      ? 'text-[#e6e8f4]'
                      : 'text-[#7d8299] hover:text-[#d8dceb] hover:bg-white/[0.04]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeSubTabPill"
                      className="absolute inset-0 bg-[#191b26] border border-white/15 rounded-[5px] shadow-sm z-0"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{sub.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right Header Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenSettings}
          id="gear-button"
          aria-label="Settings"
          title="Configurações (Tema, Animações, Sons, Tecla do Menu)"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#7d8299] hover:text-[#d8dceb] hover:bg-[#12131c] border border-transparent hover:border-white/10 transition-colors cursor-pointer group"
        >
          <i
            className={`fas fa-gear text-xs transition-transform duration-700 ease-out group-hover:rotate-180 ${
              isSettingsOpen ? 'rotate-90 text-[var(--accent)]' : ''
            }`}
          />
        </button>

        <button
          onClick={onOpenSearch}
          aria-label="Search"
          title="Buscar módulos (Ctrl + K)"
          className="h-8 px-3 rounded-lg flex items-center gap-2 text-[#7d8299] hover:text-[#d8dceb] hover:bg-[#12131c] border border-white/[0.08] hover:border-white/15 transition-colors text-xs font-medium cursor-pointer"
        >
          <i className="fas fa-magnifying-glass text-xs" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white/[0.06] rounded text-[#8e93ac]">
            Ctrl+K
          </kbd>
        </button>
      </div>
    </header>
  );
};
