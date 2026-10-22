import { motion } from 'motion/react';
import React from 'react';
import { TABS } from '../menuData';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  activeModulesCount?: number;
  menuKey: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeModulesCount = 0,
  menuKey,
}) => {
  return (
    <aside className="w-[196px] p-2.5 border-r border-white/[0.07] flex flex-col justify-between shrink-0 bg-[#060609] select-none">
      <nav className="flex flex-col gap-1" aria-label="Main navigation">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative h-[42px] px-4 flex items-center gap-3 rounded-lg text-[13.5px] font-semibold text-left transition-colors cursor-pointer group ${
                isActive
                  ? 'text-[#e6e8f4]'
                  : 'text-[#797e96] hover:text-[#cacede] hover:bg-white/[0.03]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSidebarTabBackground"
                  className="absolute inset-0 bg-[#12131d] border border-white/10 rounded-lg z-0"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {/* Left solid indicator bar */}
              {isActive && (
                <motion.span
                  layoutId="activeSidebarTabIndicator"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-[3px] h-[18px] rounded-full bg-[var(--accent)] z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <i
                className={`fas ${tab.icon} w-4 text-center text-sm transition-colors relative z-10 ${
                  isActive ? 'text-[var(--accent)]' : 'text-[#5f637a] group-hover:text-[#a2a6be]'
                }`}
              />

              <span className="truncate relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box - dynamically reflects the configured menuKey */}
      <div className="p-3 rounded-lg bg-[#0a0b10] border border-white/[0.05] text-[11px] text-[#6b6f85] flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span>Active Modules:</span>
          <span className="font-semibold text-[#d4d8ea] px-1.5 py-0.5 rounded bg-white/[0.06]">
            {activeModulesCount}
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#7d8299] pt-1 border-t border-white/[0.04]">
          <span>Toggle key:</span>
          <kbd className="text-[#d8dceb] bg-[#141622] px-2 py-0.5 rounded border border-white/15 font-mono font-bold text-[10px] tracking-wide shadow-sm">
            {menuKey}
          </kbd>
        </div>
      </div>
    </aside>
  );
};
