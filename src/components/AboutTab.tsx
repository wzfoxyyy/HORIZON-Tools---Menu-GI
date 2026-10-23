import React from 'react';
import { APP_INFO } from '../menuData';
import { HorizonLogo } from './HorizonLogo';

interface AboutTabProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  isUnsafeMode: boolean;
  onToggleUnsafeMode: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({
  onOpenSearch,
  onOpenSettings,
  isUnsafeMode,
  onToggleUnsafeMode,
}) => {
  return (
    <div className="flex flex-col gap-5 p-1 animate-in fade-in duration-200">
      {/* Hero Showcase Card */}
      <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0c0d14] p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Recreated Vector Black Hole Logo */}
          <div className="relative w-24 h-24 rounded-2xl bg-[#030305] border border-white/15 p-3 flex items-center justify-center shrink-0">
            <HorizonLogo size={68} />
            <span className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-[#1c1e2b] text-[#d8dceb] border border-white/10 font-bold text-[9px] tracking-wider uppercase">
              VECTOR CORE
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#d8dceb]">
                {APP_INFO.name} Tools
              </h2>
              <span className="text-[11px] font-bold text-[#9aa0b8] bg-[#141520] border border-white/10 px-2 py-0.5 rounded">
                GI Suite 7.2
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-[#7d8299] leading-relaxed max-w-xl">
              Painel de utilidades em tela cheia com estética Buraco Negro (Black Hole), controles modulares, tipografia Inter e zero poluição neon.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <button
                onClick={onOpenSearch}
                className="px-3.5 py-1.5 rounded-lg bg-[#d6daf0] text-[#07070a] font-bold hover:bg-[#c2c6dc] transition-colors flex items-center gap-2 text-xs cursor-pointer"
              >
                <i className="fas fa-magnifying-glass text-[11px]" />
                Buscar Módulos (Ctrl+K)
              </button>
              <button
                onClick={onOpenSettings}
                className="px-3.5 py-1.5 rounded-lg bg-[#141622] border border-white/10 text-[#d8dceb] hover:bg-white/[0.08] transition-colors flex items-center gap-2 text-xs cursor-pointer"
              >
                <i className="fas fa-gear text-[11px]" />
                Personalizar Tema
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hotkeys card */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0c0d14] p-4 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#9aa0b8] flex items-center gap-2">
            <i className="fas fa-keyboard text-[var(--accent)]" />
            Atalhos do Teclado
          </h3>
          <ul className="space-y-2 text-xs text-[#797e96]">
            <li className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span>Abrir / Ocultar Menu</span>
              <kbd className="px-2 py-0.5 rounded bg-[#13151f] text-[#d4d8ea] font-mono text-[11px] border border-white/10">
                INSERT
              </kbd>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span>Busca Rápida de Funções</span>
              <kbd className="px-2 py-0.5 rounded bg-[#13151f] text-[#d4d8ea] font-mono text-[11px] border border-white/10">
                Ctrl + K ou /
              </kbd>
            </li>
            <li className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span>Fechar Janelas / Popovers</span>
              <kbd className="px-2 py-0.5 rounded bg-[#13151f] text-[#d4d8ea] font-mono text-[11px] border border-white/10">
                ESC
              </kbd>
            </li>
            <li className="flex items-center justify-between py-1">
              <span>Navegação na Busca</span>
              <kbd className="px-2 py-0.5 rounded bg-[#13151f] text-[#d4d8ea] font-mono text-[11px] border border-white/10">
                Setas ↑ ↓ e ENTER
              </kbd>
            </li>
          </ul>
        </div>

        {/* Security & Risk Guide */}
        <div className="rounded-xl border border-white/[0.07] bg-[#0c0d14] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#9aa0b8] flex items-center gap-2">
              <i className="fas fa-shield-halved text-[var(--accent)]" />
              Níveis de Segurança
            </h3>
            <span
              onClick={onToggleUnsafeMode}
              className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer border transition-colors ${
                isUnsafeMode
                  ? 'bg-rose-950/40 text-rose-300 border-rose-500/30'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isUnsafeMode ? 'Unsafe Mode Ativo' : 'Safe Mode Ativo'}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-[#111219] border border-white/[0.04] flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-[#d8dceb]">Padrão Seguro:</strong>
                <p className="text-[11px] text-[#797e96]">Funções visuais (FOV, FPS, UID) e automações brandas.</p>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#111219] border border-amber-500/20 flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-amber-300">Risky:</strong>
                <p className="text-[11px] text-[#797e96]">Valores altos de velocidade ou kill aura podem chamar atenção.</p>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-[#111219] border border-rose-500/20 flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-rose-300">Unsafe:</strong>
                <p className="text-[11px] text-[#797e96]">Módulos ocultos por padrão até ativação do Unsafe Mode em Configs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
