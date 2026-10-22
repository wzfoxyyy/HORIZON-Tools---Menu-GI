import React from 'react';

interface ToastProps {
  message: string | null;
  type?: 'info' | 'success' | 'warn';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#171826]/95 backdrop-blur-md border border-white/20 border-l-[3px] border-l-[var(--accent)] shadow-2xl shadow-black/90 text-xs font-semibold text-white pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <i className="fas fa-circle-check text-[var(--accent)] text-xs" />
      <span>{message}</span>
    </div>
  );
};
