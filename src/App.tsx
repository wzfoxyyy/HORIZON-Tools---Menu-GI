import { motion } from 'motion/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AboutTab } from './components/AboutTab';
import { Header } from './components/Header';
import { InfoTooltip } from './components/InfoTooltip';
import { KeybindModal } from './components/KeybindModal';
import { ModuleItem } from './components/ModuleItem';
import { SearchSpotlight } from './components/SearchSpotlight';
import { SettingsPopover } from './components/SettingsPopover';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { ACCENTS, ALL_MODULES, RAW_PAGES } from './menuData';
import { AccentColor, InfoData, ModuleItemConfig } from './types';

const STORAGE_KEY = 'horizon-gi-config';
const ACCENT_STORAGE_KEY = 'horizon-gi-accent';
const KEYBINDS_STORAGE_KEY = 'horizon-gi-keybinds';
const MENU_KEY_STORAGE_KEY = 'horizon-gi-menu-key';

// Audio feedback generator (subtle click)
function playClickSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch (e) {
    // Ignore audio context if blocked
  }
}

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<string>('visuals');
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>({
    visuals: 'main',
    player: 'movement',
    world: 'world-main',
    configs: 'configs-main',
    about: 'overview',
  });

  // Modules state
  const initialModuleStates = useMemo(() => {
    const map: Record<string, boolean> = {};
    ALL_MODULES.forEach((m) => {
      if (m.on !== undefined) map[m.id] = m.on;
    });
    return map;
  }, []);

  const initialControlValues = useMemo(() => {
    const map: Record<string, any> = {};
    ALL_MODULES.forEach((m) => {
      m.body?.forEach((ctrl) => {
        if (ctrl.type === 'slider') map[ctrl.id] = ctrl.value;
        else if (ctrl.type === 'toggle') map[ctrl.id] = ctrl.on;
        else if (ctrl.type === 'input') map[ctrl.id] = ctrl.value;
      });
    });
    return map;
  }, []);

  const initialOpenStates = useMemo(() => {
    const map: Record<string, boolean> = {};
    ALL_MODULES.forEach((m) => {
      map[m.id] = !!m.open;
    });
    return map;
  }, []);

  const [moduleStates, setModuleStates] = useState<Record<string, boolean>>(initialModuleStates);
  const [controlValues, setControlValues] = useState<Record<string, any>>(initialControlValues);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>(initialOpenStates);

  // Keybinds system: maps moduleId -> keyName (e.g. 'X', 'F', 'SPACE')
  const [keybinds, setKeybinds] = useState<Record<string, string>>({});
  // Bindable Menu Toggle Key (default: 'Insert')
  const [menuKey, setMenuKey] = useState<string>('Insert');

  // Keybind modal state (triggered on module right click)
  const [keybindModal, setKeybindModal] = useState<{
    item: ModuleItemConfig;
    position: { x: number; y: number };
  } | null>(null);

  // Settings & Theme (Black hole / Event Horizon Starlight tone)
  const [currentAccent, setCurrentAccent] = useState<string>('#d6daf0');
  const [animationsEnabled, setAnimationsEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);

  // Modals & Popovers
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [infoTooltip, setInfoTooltip] = useState<{
    info: InfoData;
    rect: DOMRect;
  } | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Toast trigger
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  };

  // Check if Unsafe Mode is currently enabled
  const isUnsafeMode = !!moduleStates['configs.configs-main.unsafe-mode'];

  // Initialize saved theme, keybinds, menuKey or load configuration
  useEffect(() => {
    try {
      const savedAccent = localStorage.getItem(ACCENT_STORAGE_KEY);
      if (savedAccent) {
        setCurrentAccent(savedAccent);
        document.documentElement.style.setProperty('--accent', savedAccent);
      } else {
        document.documentElement.style.setProperty('--accent', '#d6daf0');
      }

      const savedMenuKey = localStorage.getItem(MENU_KEY_STORAGE_KEY);
      if (savedMenuKey) {
        setMenuKey(savedMenuKey);
      }

      const savedKeybinds = localStorage.getItem(KEYBINDS_STORAGE_KEY);
      if (savedKeybinds) {
        setKeybinds(JSON.parse(savedKeybinds));
      }

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.modules) setModuleStates((prev) => ({ ...prev, ...parsed.modules }));
        if (parsed.controls) setControlValues((prev) => ({ ...prev, ...parsed.controls }));
        if (parsed.keybinds) setKeybinds(parsed.keybinds);
        if (parsed.menuKey) setMenuKey(parsed.menuKey);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, []);

  // Save menu key when changed
  const handleSetMenuKey = (key: string) => {
    setMenuKey(key);
    try {
      localStorage.setItem(MENU_KEY_STORAGE_KEY, key);
    } catch (e) {}
    triggerToast(`Tecla do menu alterada para: [${key}]`);
  };

  // Save module keybind
  const handleSaveKeybind = (moduleId: string, key: string | null) => {
    setKeybinds((prev) => {
      const updated = { ...prev };
      if (!key) {
        delete updated[moduleId];
      } else {
        updated[moduleId] = key;
      }
      try {
        localStorage.setItem(KEYBINDS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    const item = ALL_MODULES.find((m) => m.id === moduleId);
    if (key) {
      triggerToast(`Bind salvo: [${key}] -> ${item?.label || 'Módulo'}`);
    } else {
      triggerToast(`Bind removido de: ${item?.label || 'Módulo'}`);
    }
    setKeybindModal(null);
  };

  // Sync accent variable
  const handleSelectAccent = (accent: AccentColor) => {
    setCurrentAccent(accent.c);
    document.documentElement.style.setProperty('--accent', accent.c);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, accent.c);
    } catch (e) {}
    if (soundEnabled) playClickSound();
    triggerToast(`Accent: ${accent.n}`);
  };

  // Toggle Module
  const handleToggleModule = (id: string, e?: React.MouseEvent) => {
    if (soundEnabled) playClickSound();

    const current = !!moduleStates[id];
    const next = !current;
    const targetModule = ALL_MODULES.find((m) => m.id === id);

    setModuleStates((prev) => ({ ...prev, [id]: next }));

    // Special handler: Unsafe Mode trigger
    if (targetModule?.unlockRisky) {
      if (!next) {
        // Disabling unsafe mode: automatically turn off all risky modules
        setModuleStates((prev) => {
          const updated = { ...prev, [id]: false };
          ALL_MODULES.forEach((m) => {
            if (m.risky) updated[m.id] = false;
          });
          return updated;
        });
        triggerToast('Unsafe Mode desativado: módulos de risco bloqueados');
      } else {
        triggerToast('Unsafe Mode ativado: módulos de risco liberados');
      }
    } else {
      triggerToast(`${targetModule?.label || 'Módulo'} ${next ? 'habilitado' : 'desabilitado'}`);
    }
  };

  // Toggle open/collapse
  const handleToggleOpen = (id: string) => {
    if (soundEnabled) playClickSound();
    setOpenStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Change sub control value
  const handleControlChange = (controlId: string, value: any) => {
    setControlValues((prev) => ({ ...prev, [controlId]: value }));
  };

  // Action buttons (Save, Load, Reset)
  const handleActionClick = (item: ModuleItemConfig) => {
    if (soundEnabled) playClickSound();

    if (item.key === 'save_config') {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            modules: moduleStates,
            controls: controlValues,
            keybinds,
            menuKey,
          })
        );
        triggerToast('Configuração salva com sucesso');
      } catch (e) {
        triggerToast('Erro ao salvar configuração');
      }
    } else if (item.key === 'load_config') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.modules) setModuleStates(parsed.modules);
          if (parsed.controls) setControlValues(parsed.controls);
          if (parsed.keybinds) setKeybinds(parsed.keybinds);
          if (parsed.menuKey) setMenuKey(parsed.menuKey);
          triggerToast('Configuração carregada com sucesso');
        } else {
          triggerToast('Nenhuma configuração salva encontrada');
        }
      } catch (e) {
        triggerToast('Erro ao carregar configuração');
      }
    } else if (item.key === 'reset_config') {
      setModuleStates(initialModuleStates);
      setControlValues(initialControlValues);
      setKeybinds({});
      triggerToast('Configurações redefinidas para o padrão');
    } else {
      triggerToast(item.msg || `${item.action} executado`);
    }
  };

  // Global keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in a form input/textarea
      const isInput = /^(INPUT|TEXTAREA)$/.test((e.target as HTMLElement)?.tagName);
      if (isInput) return;

      // Check Menu Toggle Key (Customizable from settings)
      const pressedKeyUpper = e.key.toUpperCase();
      const menuKeyUpper = menuKey.toUpperCase();
      const codeUpper = e.code.toUpperCase();

      const isMenuKeyMatch =
        pressedKeyUpper === menuKeyUpper ||
        codeUpper === menuKeyUpper ||
        (menuKeyUpper === 'INS' && codeUpper === 'INSERT') ||
        (menuKeyUpper === 'DEL' && codeUpper === 'DELETE') ||
        (menuKeyUpper === 'SPACE' && codeUpper === 'SPACE');

      if (isMenuKeyMatch) {
        e.preventDefault();
        setIsMenuVisible((v) => !v);
        return;
      }

      // Open search with Ctrl+K or /
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        setIsSettingsOpen(false);
        setKeybindModal(null);
        return;
      } else if (e.key === '/' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
        setIsSettingsOpen(false);
        setKeybindModal(null);
        return;
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        else if (isSettingsOpen) setIsSettingsOpen(false);
        setKeybindModal(null);
        setInfoTooltip(null);
        return;
      }

      // Check module keybinds
      for (const [moduleId, boundKey] of Object.entries(keybinds)) {
        const boundUpper = boundKey.toUpperCase();
        const matchesKey =
          pressedKeyUpper === boundUpper ||
          codeUpper === boundUpper ||
          (boundUpper === 'SPACE' && codeUpper === 'SPACE') ||
          (boundUpper === 'INS' && codeUpper === 'INSERT');

        if (matchesKey) {
          e.preventDefault();
          const targetModule = ALL_MODULES.find((m) => m.id === moduleId);
          // Check if module is locked due to unsafe mode
          if (targetModule?.risky && !isUnsafeMode) {
            triggerToast(`Módulo [${targetModule.label}] bloqueado (ative Unsafe Mode)`);
            return;
          }

          if (soundEnabled) playClickSound();
          const nextState = !moduleStates[moduleId];
          setModuleStates((prev) => ({ ...prev, [moduleId]: nextState }));
          triggerToast(
            `[${boundKey}] ${targetModule?.label || 'Módulo'}: ${
              nextState ? 'HABILITADO' : 'DESABILITADO'
            }`
          );
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuKey, keybinds, moduleStates, isUnsafeMode, soundEnabled, isSearchOpen]);

  // Jump to module from Search Spotlight
  const handleSelectModuleFromSearch = (module: ModuleItemConfig) => {
    setIsSearchOpen(false);
    setActiveTab(module.page);
    if (module.subId) {
      setActiveSubTabs((prev) => ({ ...prev, [module.page]: module.subId! }));
    }

    // Scroll and highlight with subtle flash
    setTimeout(() => {
      const el = document.getElementById(`module-${module.id}`);
      if (el && contentRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.animation = 'flashSolid 1.2s ease';
        setTimeout(() => {
          el.style.animation = '';
        }, 1250);
      }
    }, 120);
  };

  // Determine current subpages
  const currentSubPages = RAW_PAGES[activeTab] || [];
  const activeSubId = activeSubTabs[activeTab] || currentSubPages[0]?.id;
  const currentSubPage = currentSubPages.find((s) => s.id === activeSubId) || currentSubPages[0];

  // Filter visible items considering Unsafe Mode
  const isModuleLocked = (item: ModuleItemConfig) => {
    return !!item.risky && !isUnsafeMode;
  };

  // Active modules count
  const activeCount = Object.entries(moduleStates).filter(
    ([id, on]) => on && !id.includes('unsafe-mode')
  ).length;

  return (
    <div className="w-screen h-screen bg-[#07070a] text-[#d8dceb] overflow-hidden select-none font-sans">
      {/* Floating Shortcut Helper when menu is hidden via Menu Key */}
      {!isMenuVisible && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#0c0d14] border border-white/15 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-[#d8dceb]">Menu Oculto</span>
          <button
            onClick={() => setIsMenuVisible(true)}
            className="px-2.5 py-1 rounded bg-[#d6daf0] text-[#07070a] font-bold text-[11px] hover:bg-white transition-colors cursor-pointer"
          >
            Pressione [{menuKey}] para abrir
          </button>
        </div>
      )}

      {/* Main Fullscreen Window Layout */}
      {isMenuVisible && (
        <div className={`win-fullscreen ${!animationsEnabled ? 'noanim' : ''}`}>
          {/* Top Bar Header */}
          <Header
            currentTab={activeTab}
            subPages={currentSubPages}
            activeSubId={activeSubId}
            onSelectSub={(subId) => {
              if (soundEnabled) playClickSound();
              setActiveSubTabs((prev) => ({ ...prev, [activeTab]: subId }));
              if (contentRef.current) contentRef.current.scrollTop = 0;
            }}
            onOpenSettings={() => {
              if (soundEnabled) playClickSound();
              setIsSettingsOpen((v) => !v);
              setKeybindModal(null);
            }}
            onOpenSearch={() => {
              if (soundEnabled) playClickSound();
              setIsSearchOpen(true);
              setKeybindModal(null);
            }}
            isSettingsOpen={isSettingsOpen}
          />

          {/* Main Content Area */}
          <main className="grid grid-cols-[196px_minmax(0,1fr)] min-h-0 bg-[#07070a]">
            {/* Sidebar */}
            <Sidebar
              activeTab={activeTab}
              onSelectTab={(tabId) => {
                if (soundEnabled) playClickSound();
                setActiveTab(tabId);
                setKeybindModal(null);
              }}
              activeModulesCount={activeCount}
              menuKey={menuKey}
            />

            {/* Scrollable Content Viewport with smooth instant transition */}
            <div
              ref={contentRef}
              className="overflow-y-auto p-4 custom-scroll relative"
            >
              <motion.div
                key={`${activeTab}-${activeSubId}`}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                  {activeTab === 'about' ? (
                    <AboutTab
                      onOpenSearch={() => setIsSearchOpen(true)}
                      onOpenSettings={() => setIsSettingsOpen(true)}
                      isUnsafeMode={isUnsafeMode}
                      onToggleUnsafeMode={() =>
                        handleToggleModule('configs.configs-main.unsafe-mode')
                      }
                    />
                  ) : currentSubPage ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
                      {currentSubPage.cols.map((colCards, colIdx) => {
                        const visibleCards = colCards.filter((card) =>
                          card.items.some((it) => !isModuleLocked(it))
                        );

                        return (
                          <div key={colIdx} className="flex flex-col gap-3 min-w-0">
                            {visibleCards.map((card, cardIdx) => {
                              const visibleItems = card.items.filter((it) => !isModuleLocked(it));
                              if (visibleItems.length === 0) return null;

                              return (
                                <motion.section
                                  key={card.title}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    duration: 0.22,
                                    delay: (colIdx * 2 + cardIdx) * 0.035,
                                    ease: [0.22, 1, 0.36, 1],
                                  }}
                                  className="bg-[#0c0d13] border border-white/[0.07] rounded-xl p-3.5"
                                >
                                  <h3 className="flex items-center gap-2.5 font-bold text-[13px] text-[#d8dceb] tracking-wide mb-3 pb-2.5 border-b border-white/[0.06]">
                                    <span className="w-6 h-6 flex items-center justify-center rounded-md bg-[#13151f] text-[var(--accent)] text-xs">
                                      <i className={`fas ${card.icon}`} />
                                    </span>
                                    <span>{card.title}</span>
                                  </h3>

                                  <div className="flex flex-col gap-2">
                                    {visibleItems.map((item) => (
                                      <ModuleItem
                                        key={item.id}
                                        item={item}
                                        isOn={!!moduleStates[item.id]}
                                        isOpen={!!openStates[item.id]}
                                        controlValues={controlValues}
                                        boundKey={keybinds[item.id]}
                                        onToggle={handleToggleModule}
                                        onToggleOpen={handleToggleOpen}
                                        onControlChange={handleControlChange}
                                        onShowInfo={(it, rect) => {
                                          setInfoTooltip({
                                            info: it.info!,
                                            rect,
                                          });
                                        }}
                                        onHideInfo={() => setInfoTooltip(null)}
                                        onActionClick={handleActionClick}
                                        onOpenKeybind={(targetItem, pos) => {
                                          setKeybindModal({
                                            item: targetItem,
                                            position: pos,
                                          });
                                        }}
                                      />
                                    ))}
                                  </div>
                                </motion.section>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-20 text-center text-[#797e96] flex flex-col items-center gap-3">
                      <i className="fas fa-lock text-2xl text-[var(--accent)] opacity-60" />
                      <p className="text-sm">
                        Nenhum módulo disponível no momento.
                        <br />
                        Ative o <strong>Unsafe Mode</strong> em Configs para liberar módulos de risco.
                      </p>
                    </div>
                  )}
                </motion.div>
            </div>
          </main>

          {/* Settings Popover */}
          <SettingsPopover
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentAccent={currentAccent}
            onSelectAccent={handleSelectAccent}
            animationsEnabled={animationsEnabled}
            onToggleAnimations={() => {
              if (soundEnabled) playClickSound();
              setAnimationsEnabled((v) => !v);
              triggerToast(
                !animationsEnabled ? 'Animações habilitadas' : 'Animações desabilitadas'
              );
            }}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              setSoundEnabled((v) => !v);
              triggerToast(!soundEnabled ? 'Sons de interface ativos' : 'Sons desativados');
            }}
            menuKey={menuKey}
            onSetMenuKey={handleSetMenuKey}
          />

          {/* Keybind Context Modal (Right click on module) */}
          <KeybindModal
            item={keybindModal?.item || null}
            position={keybindModal?.position || null}
            currentKey={keybindModal ? keybinds[keybindModal.item.id] : undefined}
            onSaveKeybind={handleSaveKeybind}
            onClose={() => setKeybindModal(null)}
          />

          {/* Search Spotlight Modal */}
          <SearchSpotlight
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            modules={ALL_MODULES.filter((m) => !isModuleLocked(m))}
            moduleStates={moduleStates}
            onSelectModule={handleSelectModuleFromSearch}
          />

          {/* Info Tooltip with smooth animation and clamped boundaries */}
          <InfoTooltip
            info={infoTooltip?.info || null}
            targetRect={infoTooltip?.rect || null}
          />

          {/* Toast Notification */}
          <Toast message={toastMessage} />
        </div>
      )}
    </div>
  );
}
