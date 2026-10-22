import { motion } from 'motion/react';
import React from 'react';
import { InfoData } from '../types';

interface InfoTooltipProps {
  info: InfoData | null;
  targetRect: DOMRect | null;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ info, targetRect }) => {
  if (!info || !targetRect) return null;

  const isDanger = info.type === 'danger';
  const isWarn = info.type === 'warn';

  const borderColor = isDanger
    ? 'border-l-rose-500'
    : isWarn
    ? 'border-l-amber-500'
    : 'border-l-[var(--accent)]';

  const titleColor = isDanger
    ? 'text-rose-400'
    : isWarn
    ? 'text-amber-400'
    : 'text-[var(--accent)]';

  // Constants for geometry
  const tooltipWidth = 260;
  const sidebarWidth = 196;
  const minLeft = sidebarWidth + 8; // 204px
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;

  // Align with button horizontally, clamp within content viewport
  let left = targetRect.left;
  if (left < minLeft) {
    left = minLeft;
  } else if (left + tooltipWidth > screenWidth - 12) {
    left = screenWidth - tooltipWidth - 12;
  }

  // Vertical placement:
  // Header height is 60px. Tooltip height is approximately 78px.
  // If placing above would put it into the header (top < 64px), place below the button instead!
  const estimatedHeight = 78;
  const spaceAbove = targetRect.top - 60;
  const placeBelow = spaceAbove < estimatedHeight + 12;

  const top = placeBelow ? targetRect.bottom + 8 : targetRect.top - estimatedHeight - 8;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        left: `${left}px`,
        top: `${top}px`,
      }}
      className={`fixed z-50 w-[260px] p-3 rounded-xl bg-[#0e0f17] border border-white/15 border-l-[3px] ${borderColor} shadow-2xl pointer-events-none text-xs select-none`}
    >
      <h4 className={`font-bold text-[12.5px] mb-1 flex items-center gap-1.5 ${titleColor}`}>
        {isDanger && <i className="fas fa-skull text-[11px]" />}
        {isWarn && <i className="fas fa-triangle-exclamation text-[11px]" />}
        {!isDanger && !isWarn && <i className="fas fa-circle-info text-[11px]" />}
        {info.title || (isDanger ? 'Risk of use' : isWarn ? 'Warning' : 'Information')}
      </h4>
      <div className="flex flex-col gap-1 text-[#b5b8ce] leading-relaxed text-[11px]">
        {info.lines.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </motion.div>
  );
};
