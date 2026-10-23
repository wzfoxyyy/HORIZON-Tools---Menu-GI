export type ControlType = 'slider' | 'input' | 'toggle' | 'button';

export interface SliderControl {
  id: string;
  type: 'slider';
  label: string;
  min: number;
  max: number;
  value: number;
  dec?: number;
}

export interface InputControl {
  id: string;
  type: 'input';
  label: string;
  placeholder?: string;
  value: string;
}

export interface ToggleControl {
  id: string;
  type: 'toggle';
  label: string;
  on: boolean;
}

export interface ButtonControl {
  id: string;
  type: 'button';
  label: string;
  text?: string;
  actionText?: string;
  onClick?: () => void;
}

export type ModuleControl = SliderControl | InputControl | ToggleControl | ButtonControl;

export interface InfoData {
  type: 'info' | 'warn' | 'danger';
  title?: string;
  lines: string[];
}

export interface ModuleItemConfig {
  id: string;
  label: string;
  key: string;
  card: string;
  page: string;
  subId?: string;
  subLabel?: string;
  on?: boolean;
  open?: boolean;
  risky?: boolean;
  ban?: boolean;
  unlockRisky?: boolean;
  action?: string;
  msg?: string;
  info?: InfoData;
  body?: ModuleControl[];
  onClick?: () => void;
}

export interface CardConfig {
  title: string;
  icon: string;
  items: ModuleItemConfig[];
}

export interface SubPageConfig {
  id: string;
  label: string;
  cols: [CardConfig[], CardConfig[]];
}

export interface TabConfig {
  id: string;
  label: string;
  icon: string;
}

export interface AccentColor {
  c: string;
  n: string;
  textColor?: string;
}
