import { AccentColor, ModuleItemConfig, SubPageConfig, TabConfig } from './types';

export const APP_INFO = {
  name: 'HORIZON',
  badge: 'GI-6.4',
  version: 'v.7.2',
  subtitle: 'Updating to v.7.2',
};

// Black hole / Cosmic Event Horizon color palette (no harsh 100% white, no neon)
export const ACCENTS: AccentColor[] = [
  { c: '#d6daf0', n: 'Event Horizon (Starlight)', textColor: '#090a0f' },
  { c: '#d9975b', n: 'Accretion Disk (Amber)', textColor: '#090a0f' },
  { c: '#9fa6cb', n: 'Deep Cosmos (Slate)', textColor: '#090a0f' },
  { c: '#7c8299', n: 'Singularity (Titanium)', textColor: '#090a0f' },
  { c: '#5e94b3', n: 'Gravitational Wave (Blue)', textColor: '#090a0f' },
  { c: '#b35e68', n: 'Redshift (Crimson)', textColor: '#090a0f' },
];

export const TABS: TabConfig[] = [
  { id: 'about', label: 'About', icon: 'fa-info' },
  { id: 'visuals', label: 'Visuals', icon: 'fa-eye' },
  { id: 'player', label: 'Player', icon: 'fa-user' },
  { id: 'world', label: 'World', icon: 'fa-globe' },
  { id: 'configs', label: 'Configs', icon: 'fa-folder-open' },
];

export interface PageDictionary {
  [pageId: string]: SubPageConfig[];
}

export const RAW_PAGES: PageDictionary = {
  about: [
    {
      id: 'overview',
      label: 'Overview',
      cols: [
        [
          {
            title: 'HORIZON Tools Suite',
            icon: 'fa-shield-halved',
            items: [
              {
                id: 'about.brand_info',
                label: 'HORIZON Suite Status',
                key: 'brand_status',
                card: 'HORIZON Tools Suite',
                page: 'about',
                subId: 'overview',
                subLabel: 'Overview',
                on: true,
                open: true,
                info: {
                  type: 'info',
                  title: 'HORIZON Tools',
                  lines: [
                    'Built with high-performance memory hooks.',
                    'Engineered for stealth and stability.',
                    'Tema Buraco Negro (Black Hole) com tipografia Inter.',
                  ],
                },
                body: [
                  {
                    id: 'about.brand_info.ver',
                    type: 'input',
                    label: 'Client Build',
                    placeholder: '7.2.0-STABLE',
                    value: '7.2.0-STABLE',
                  },
                ],
              },
              {
                id: 'about.engine_info',
                label: 'Memory Engine',
                key: 'engine_driver',
                card: 'HORIZON Tools Suite',
                page: 'about',
                subId: 'overview',
                subLabel: 'Overview',
                on: true,
                open: false,
                info: {
                  type: 'info',
                  title: 'Core Engine',
                  lines: ['Kernel virtual memory bypass.', 'Zero crash telemetry.'],
                },
                body: [
                  {
                    id: 'about.engine_info.target',
                    type: 'slider',
                    label: 'Hook Latency',
                    min: 1,
                    max: 1,
                    value: 1,
                    dec: 0,
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            title: 'Quick Hotkeys & Commands',
            icon: 'fa-keyboard',
            items: [
              {
                id: 'about.hotkey_guide',
                label: 'Default Keybinds',
                key: 'keybinds_guide',
                card: 'Quick Hotkeys & Commands',
                page: 'about',
                subId: 'overview',
                subLabel: 'Overview',
                open: true,
                info: {
                  type: 'info',
                  title: 'Shortcuts',
                  lines: [
                    'INSERT: Show or hide this menu panel',
                    'Ctrl + K or /: Open module search modal',
                    'ESC: Close search dialog or settings popover',
                  ],
                },
                body: [
                  {
                    id: 'about.hotkey_guide.insert',
                    type: 'input',
                    label: 'Menu Key',
                    placeholder: 'INSERT',
                    value: 'INSERT',
                  },
                  {
                    id: 'about.hotkey_guide.search',
                    type: 'input',
                    label: 'Search Key',
                    placeholder: 'Ctrl + K',
                    value: 'Ctrl + K',
                  },
                ],
              },
            ],
          },
        ],
      ],
    },
  ],
  visuals: [
    {
      id: 'main',
      label: 'Main',
      cols: [
        [
          {
            title: 'Visual Tweaks',
            icon: 'fa-display',
            items: [
              {
                id: 'visuals.main.fps-unlock',
                label: 'FPS Unlock',
                key: 'fps_unlock',
                card: 'Visual Tweaks',
                page: 'visuals',
                subId: 'main',
                subLabel: 'Main',
                on: false,
                open: true,
                info: {
                  type: 'info',
                  title: 'FPS Unlock',
                  lines: ['Limit is fixed at 120 FPS in this build.'],
                },
              },
            ],
          },
          {
            title: 'Profile Change',
            icon: 'fa-dice',
            items: [
              {
                id: 'visuals.main.uid-change',
                label: 'UID Change',
                key: 'uid_change',
                card: 'Profile Change',
                page: 'visuals',
                subId: 'main',
                subLabel: 'Main',
                open: true,
                on: false,
                info: {
                  type: 'info',
                  title: 'Spoof UID',
                  lines: ['Replaces visible UID on HUD and recording overlays.'],
                },
                body: [
                  {
                    id: 'visuals.main.uid-change.uid',
                    type: 'input',
                    label: 'UID:',
                    placeholder: 'Enter UID',
                    value: '800123456',
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            title: 'Camera',
            icon: 'fa-camera',
            items: [
              {
                id: 'visuals.main.fov-changer',
                label: 'FOV Changer',
                key: 'fov_changer',
                card: 'Camera',
                page: 'visuals',
                subId: 'main',
                subLabel: 'Main',
                on: false,
                open: true,
                info: {
                  type: 'info',
                  title: 'Field of View',
                  lines: ['Expands the camera angle for a wider tactical vision.'],
                },
                body: [
                  {
                    id: 'visuals.main.fov-changer.fov-value',
                    type: 'slider',
                    label: 'FOV Value',
                    min: 45,
                    max: 120,
                    value: 45,
                    dec: 0,
                  },
                ],
              },
            ],
          },
        ],
      ],
    },
    {
      id: 'esp',
      label: 'ESP',
      cols: [
        [
          {
            title: 'ESP Config',
            icon: 'fa-eye',
            items: [
              {
                id: 'visuals.esp.active',
                label: 'Active',
                key: 'active',
                card: 'ESP Config',
                page: 'visuals',
                subId: 'esp',
                subLabel: 'ESP',
                on: false,
                open: true,
                body: [
                  {
                    id: 'visuals.esp.active.range',
                    type: 'slider',
                    label: 'Range',
                    min: 0,
                    max: 300,
                    value: 0,
                    dec: 0,
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            title: 'ESP Filters',
            icon: 'fa-filter',
            items: [
              {
                id: 'visuals.esp.esp-chest',
                label: 'ESP Chest',
                key: 'esp_chest',
                card: 'ESP Filters',
                page: 'visuals',
                subId: 'esp',
                subLabel: 'ESP',
                on: false,
                open: true,
              },
              {
                id: 'visuals.esp.esp-oculi',
                label: 'ESP Oculi',
                key: 'esp_oculi',
                card: 'ESP Filters',
                page: 'visuals',
                subId: 'esp',
                subLabel: 'ESP',
                on: false,
                open: true,
              },
            ],
          },
        ],
      ],
    },
  ],
  player: [
    {
      id: 'movement',
      label: 'Movement',
      cols: [
        [
          {
            title: 'Movement',
            icon: 'fa-person-running',
            items: [
              {
                id: 'player.movement.player-speed',
                label: 'Player-Speed',
                key: 'player_speed',
                card: 'Movement',
                page: 'player',
                subId: 'movement',
                subLabel: 'Movement',
                on: false,
                open: true,
                body: [
                  {
                    id: 'player.movement.player-speed.speed',
                    type: 'slider',
                    label: 'Speed',
                    min: 1,
                    max: 2.5,
                    value: 1,
                    dec: 1,
                  },
                ],
              },
              {
                id: 'player.movement.jump-height',
                label: 'Jump Height',
                key: 'jump_height',
                card: 'Movement',
                page: 'player',
                subId: 'movement',
                subLabel: 'Movement',
                on: false,
                open: true,
                body: [
                  {
                    id: 'player.movement.jump-height.height',
                    type: 'slider',
                    label: 'Height',
                    min: 1,
                    max: 2,
                    value: 1,
                    dec: 1,
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            title: 'Advanced Movement',
            icon: 'fa-person-running',
            items: [
              {
                id: 'player.movement.no-clip',
                label: 'No Clip (Read Info)',
                key: 'no_clip',
                card: 'Advanced Movement',
                page: 'player',
                subId: 'movement',
                subLabel: 'Movement',
                on: false,
                risky: false,
                ban: true,
                info: {
                  type: 'warn',
                  title: 'Warning',
                  lines: [
                    'This module can be dangerous or risky if you set high values for the functions mentioned above (Speed Changer and Jump Height).',
                    'Therefore, consider using low values if you decide to use this module.',
                  ],
                },
              },
            ],
          },
        ],
      ],
    },
    {
      id: 'attack-defense',
      label: 'Attack & Defense',
      cols: [
        [
          {
            title: 'Attack',
            icon: 'fa-gun',
            items: [
              {
                id: 'player.attack-defense.kill-aura',
                label: 'Kill Aura',
                key: 'kill_aura',
                card: 'Attack',
                page: 'player',
                subId: 'attack-defense',
                subLabel: 'Attack & Defense',
                on: false,
                open: true,
                ban: true,
                info: {
                  type: 'danger',
                  title: 'Risk of use',
                  lines: [
                    'High Damage and Range increase the chance of a ban.',
                    'Use low values.',
                  ],
                },
                body: [
                  {
                    id: 'player.attack-defense.kill-aura.damage',
                    type: 'slider',
                    label: 'Damage',
                    min: 1,
                    max: 200000,
                    value: 1,
                    dec: 0,
                  },
                  {
                    id: 'player.attack-defense.kill-aura.range',
                    type: 'slider',
                    label: 'Range',
                    min: 1,
                    max: 15,
                    value: 1,
                    dec: 0,
                  },
                  {
                    id: 'player.attack-defense.kill-aura.targets',
                    type: 'slider',
                    label: 'Targets',
                    min: 1,
                    max: 2,
                    value: 1,
                    dec: 0,
                  },
                  {
                    id: 'player.attack-defense.kill-aura.delay',
                    type: 'slider',
                    label: 'Delay',
                    min: 1,
                    max: 5,
                    value: 5,
                    dec: 1,
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            title: 'Defense',
            icon: 'fa-shield-halved',
            items: [
              {
                id: 'player.attack-defense.god-mode',
                label: 'God Mode',
                key: 'god_mode',
                card: 'Defense',
                page: 'player',
                subId: 'attack-defense',
                subLabel: 'Attack & Defense',
                on: false,
                open: true,
              },
            ],
          },
        ],
      ],
    },
  ],
  world: [
    {
      id: 'world-main',
      label: 'World',
      cols: [
        [
          {
            title: 'Dialogs',
            icon: 'fa-comment',
            items: [
              {
                id: 'world.world-main.auto-talk',
                label: 'Auto-Talk',
                key: 'auto_talk',
                card: 'Dialogs',
                page: 'world',
                subId: 'world-main',
                subLabel: 'World',
                on: false,
                open: true,
                info: {
                  type: 'warn',
                  title: 'Warning',
                  lines: ['Lower Delay values increase the risk.'],
                },
                body: [
                  {
                    id: 'world.world-main.auto-talk.auto-choices',
                    type: 'toggle',
                    label: 'Auto-Choices',
                    on: false,
                  },
                  {
                    id: 'world.world-main.auto-talk.delay',
                    type: 'slider',
                    label: 'Delay',
                    min: 0.5,
                    max: 5,
                    value: 5,
                    dec: 1,
                  },
                ],
              },
            ],
          },
        ],
        [
          {
            title: 'Auto-Collect',
            icon: 'fa-gem',
            items: [
              {
                id: 'world.world-main.auto-loot',
                label: 'Auto-Loot',
                key: 'auto_loot',
                card: 'Auto-Collect',
                page: 'world',
                subId: 'world-main',
                subLabel: 'World',
                on: false,
                open: true,
                info: {
                  type: 'warn',
                  title: 'Warning',
                  lines: ['Lower Delay and High range values increase the risk.'],
                },
                body: [
                  {
                    id: 'world.world-main.auto-loot.open-chests',
                    type: 'toggle',
                    label: 'Open Chests',
                    on: false,
                  },
                  {
                    id: 'world.world-main.auto-loot.delay',
                    type: 'slider',
                    label: 'Delay',
                    min: 1,
                    max: 5,
                    value: 5,
                    dec: 1,
                  },
                  {
                    id: 'world.world-main.auto-loot.range',
                    type: 'slider',
                    label: 'Range',
                    min: 1,
                    max: 15,
                    value: 1,
                    dec: 0,
                  },
                ],
              },
              {
                id: 'world.world-main.auto-seelie',
                label: 'Auto-Seelie',
                key: 'auto_seelie',
                card: 'Auto-Collect',
                page: 'world',
                subId: 'world-main',
                subLabel: 'World',
                on: false,
                risky: true,
                open: false,
                info: {
                  type: 'danger',
                  title: 'Risk of use',
                  lines: ['Speed-Up limit is fixed at 1.5X in this build.', 'High range can trigger anomaly flags.'],
                },
                body: [
                  {
                    id: 'world.world-main.auto-seelie.range',
                    type: 'slider',
                    label: 'Range',
                    min: 1,
                    max: 7,
                    value: 1,
                    dec: 0,
                  },
                  {
                    id: 'world.world-main.auto-seelie.speed-up',
                    type: 'toggle',
                    label: 'Speed-Up',
                    on: false,
                  },
                ],
              },
            ],
          },
        ],
      ],
    },
  ],
  configs: [
    {
      id: 'configs-main',
      label: 'Configs',
      cols: [
        [
          {
            title: 'Profiles',
            icon: 'fa-folder-open',
            items: [
              {
                id: 'configs.configs-main.save-config',
                label: 'Save Config',
                key: 'save_config',
                card: 'Profiles',
                page: 'configs',
                subId: 'configs-main',
                subLabel: 'Configs',
                action: 'Save',
                msg: 'Config saved to storage',
              },
              {
                id: 'configs.configs-main.load-config',
                label: 'Load Config',
                key: 'load_config',
                card: 'Profiles',
                page: 'configs',
                subId: 'configs-main',
                subLabel: 'Configs',
                action: 'Load',
                msg: 'Config loaded from storage',
              },
              {
                id: 'configs.configs-main.reset-config',
                label: 'Reset Config',
                key: 'reset_config',
                card: 'Profiles',
                page: 'configs',
                subId: 'configs-main',
                subLabel: 'Configs',
                action: 'Reset',
                msg: 'Config reset to factory defaults',
              },
            ],
          },
        ],
        [
          {
            title: 'Unsafe Mode',
            icon: 'fa-skull',
            items: [
              {
                id: 'configs.configs-main.unsafe-mode',
                label: 'Active (Ban Risky)',
                key: 'unsafe_mode_active',
                card: 'Unsafe Mode',
                page: 'configs',
                subId: 'configs-main',
                subLabel: 'Configs',
                on: false,
                unlockRisky: true,
                ban: true,
                info: {
                  type: 'danger',
                  title: 'Caution: Unsafe Mode',
                  lines: [
                    'Unlocks experimental modules that may trigger anti-cheat detections.',
                    'Keep disabled during standard gameplay.',
                  ],
                },
              },
            ],
          },
        ],
      ],
    },
  ],
};

// Flatten modules for search and global state lookup
export const ALL_MODULES: ModuleItemConfig[] = [];
Object.values(RAW_PAGES).forEach((subpages) => {
  subpages.forEach((sub) => {
    sub.cols.forEach((col) => {
      col.forEach((card) => {
        card.items.forEach((item) => {
          ALL_MODULES.push(item);
        });
      });
    });
  });
});
