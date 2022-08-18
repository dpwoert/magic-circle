import type { ReactNode } from 'react';

import type { IpcBase } from '@magic-circle/client';

export type icons =
  | 'AirplayToTv'
  | 'AnnotationDots'
  | 'AnnotationWarning'
  | 'Announcement'
  | 'Archive'
  | 'ArrowDownLeft'
  | 'ArrowDownRight'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUpLeft'
  | 'ArrowUpRight'
  | 'ArrowUp'
  | 'AtSign'
  | 'Badge'
  | 'Bank'
  | 'BatteryCharging'
  | 'BatteryFull'
  | 'BatteryLow'
  | 'BatteryMedium'
  | 'Battery'
  | 'BellOff'
  | 'Bell'
  | 'Book'
  | 'Bookmark'
  | 'Box'
  | 'Briefcase'
  | 'BuildingStore'
  | 'Building'
  | 'CalendarMinus'
  | 'CalendarPlus'
  | 'Calendar'
  | 'CameraOff'
  | 'Camera'
  | 'Chart'
  | 'CheckCircle'
  | 'Check'
  | 'ChevronDown'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'ChevronUp'
  | 'Clipboard'
  | 'Clock'
  | 'CloseCircle'
  | 'Close'
  | 'Cloud'
  | 'Code'
  | 'ColumnsHorizontal'
  | 'ColumnsVertical'
  | 'Columns'
  | 'Copy'
  | 'Crop'
  | 'Cursor'
  | 'Dashboard'
  | 'Dollar'
  | 'DotsHorizontal'
  | 'DotsVertical'
  | 'Download'
  | 'Edit'
  | 'EmojiHappy'
  | 'EmojiSad'
  | 'EyeOff'
  | 'Eye'
  | 'FastForward'
  | 'FileMinus'
  | 'FilePlus'
  | 'FileText'
  | 'File'
  | 'Film'
  | 'Filter'
  | 'Flag'
  | 'FolderMinus'
  | 'FolderPlus'
  | 'Folder'
  | 'Globe'
  | 'GridMasonry'
  | 'Grid'
  | 'Hashtag'
  | 'Headphones'
  | 'Heart'
  | 'HelpCircle'
  | 'Help'
  | 'Home'
  | 'Inbox'
  | 'Information'
  | 'Key'
  | 'Link'
  | 'LockUnlocked'
  | 'Lock'
  | 'LogIn'
  | 'LogOut'
  | 'Mail'
  | 'Map'
  | 'Maximize'
  | 'Menu'
  | 'Message'
  | 'MicrophoneMute'
  | 'Microphone'
  | 'Minimize'
  | 'MinusCircle'
  | 'Minus'
  | 'Monitor2'
  | 'Monitor'
  | 'Moon'
  | 'Music'
  | 'Paintbucket'
  | 'Pause'
  | 'Percentage'
  | 'PhoneCallCross'
  | 'PhoneCallForward'
  | 'PhoneCallHangUp'
  | 'PhoneCallIncoming'
  | 'PhoneCallOutgoing'
  | 'PhoneCall'
  | 'Phone'
  | 'Photo'
  | 'PictureInPicture'
  | 'PieChart'
  | 'Pill'
  | 'PinTack'
  | 'Pin'
  | 'Play'
  | 'Plug'
  | 'PlusCircle'
  | 'Plus'
  | 'Print'
  | 'Projector'
  | 'Redo'
  | 'Refresh'
  | 'Rewind'
  | 'Rows'
  | 'Search'
  | 'Send'
  | 'Server'
  | 'SettingsSliders'
  | 'Settings'
  | 'Share'
  | 'Shield'
  | 'ShoppingBag'
  | 'ShoppingBasket'
  | 'ShoppingCart'
  | 'SkipBack'
  | 'SkipForward'
  | 'Smartphone'
  | 'Speaker'
  | 'Star'
  | 'Sticker'
  | 'Stop'
  | 'StreamToTv'
  | 'Sun'
  | 'TableColumns'
  | 'TableRows'
  | 'Tablet'
  | 'Tag'
  | 'Target'
  | 'Ticket'
  | 'Trash'
  | 'TrendingDown'
  | 'TrendingUp'
  | 'Truck'
  | 'Undo'
  | 'Upload'
  | 'UserCheck'
  | 'UserCross'
  | 'UserMinus'
  | 'UserPlus'
  | 'User'
  | 'UsersMinus'
  | 'UsersPlus'
  | 'Users'
  | 'VideoCameraOff'
  | 'VideoCamera'
  | 'Video'
  | 'Virus'
  | 'Wallet'
  | 'WarningTriangle'
  | 'WifiNoConnection'
  | 'Wifi'
  | 'ZoomIn'
  | 'ZoomOut'
  | 'Npm'
  | 'Github';

export type StoreHook<T> = (newValue: T) => void;

export interface Store<T> {
  value: T;
  set(value: T): void;
  setFn(fn: (curr: T) => T): void;
  onChange(hook: StoreHook<T>): void;
  removeListener(hook: StoreHook<T>): void;
  hooks: StoreHook<T>[];
}

export interface StoreConstructor<T> {
  new (initialValue: T): Store<T>;
}

export interface SidebarOpts {
  icon: icons;
  name: string;
  render: ReactNode;
  before?: string | string[];
  after?: string | string[];
}

export type Sidebar = {
  current: number;
  panels: SidebarOpts[];
};

export type Button = {
  label: string;
  icon: icons;
  tooltip?: string;
  onClick: () => void;
  hide?: boolean;
  disabled?: boolean;
};

export type ButtonCollection = {
  before?: string | string[];
  after?: string | string[];
  list: Button[];
};

export type ButtonCollections = Record<string, ButtonCollection>;

export type CommandLineReference = {
  type: string;
  id: string;
};

export type CommandLineScreen = {
  searchLabel?: string;
  initialScreen?: boolean;
  reference?: CommandLineReference;
  actions: CommandLineAction[];
};

export type CommandLineAction = {
  label: string;
  shortcut?: string;
  icon: icons;
  onSelect: (action: CommandLineAction) => Promise<void | CommandLineScreen>;
};

export interface Plugin {
  name: string;
  setup: (app: App) => Promise<void>;
  connect?: () => void;
  preConnect?: () => void;
  hydrate?: () => any;
  ready?: () => void;
  sidebar?: () => SidebarOpts;
  buttons?: (buttons: ButtonCollections) => ButtonCollections;
  load?: (data: any) => Promise<void>;
  save?: () => Promise<any>;
  reset?: () => Promise<void>;
  commands?: (reference?: CommandLineReference) => CommandLineAction[];
  // electron?: string;
}

export interface PluginConstructor {
  new (): Plugin;
}

export type ControlProps<T, K> = {
  value: T;
  label: string;
  options: K;
  hasChanges: boolean;
  select?: {
    label: string;
    icon: icons;
    onSelect: () => void;
  };
  set: (newValue: T) => void;
  reset: () => void;
};

export type Control = {
  name: string;
  supports?: (type: string, options: any) => boolean;
  render: (props: ControlProps<any, any>) => ReactNode;
};

// export enum BuildTarget {
//   ELECTRON = 'electron',
//   IFRAME = 'iframe',
// }

export interface Config {
  url: string | ((dev: boolean) => string);
  plugins:
    | PluginConstructor[]
    | ((defaultPlugins: PluginConstructor[]) => PluginConstructor[]);
  controls: Control[] | ((defaultControls: Control[]) => Control[]);
  settings: {
    pageTitle?: string;
    screenshots?: {
      directoryBasedOnFrameUrl?: boolean;
      gitInfo?: boolean;
    };
    playControls?: {
      fullscreen?: boolean;
    };
    recordings?: {
      fps?: number[];
    };
    [key: string]: any;
  };
  // target: BuildTarget;
}

export type UserConfig = Partial<Config>;

export type ControlExport = {
  path: string;
  type: string;
  label: string;
  options: Record<string, any>;
  value: any;
  initialValue: any;
  blockHydrate: boolean;
  watching: boolean;
};

export type LayerExport = {
  path: string;
  name: string;
  folder: boolean;
  children: Array<LayerExport | ControlExport>;
};

export type MainLayerExport = LayerExport[];

export type PageInfo = {
  title: string;
  location?: Location;
  firstPaint?: number;
  firstContentfulPaint?: number;
  loadingTime?: number;
};

export enum LayoutHook {
  SIDEBAR_RIGHT = 'sidebar_right',
  HEADER_RIGHT = 'header_right',
  INNER = 'inner',
  BOTTOM = 'bottom',
}

export type layoutHooks = Record<string, ReactNode>;

export interface App {
  plugins: Plugin[];
  controls: Record<string, Control>;
  config: Config;
  ipc: IpcBase;

  buttons: Store<ButtonCollections>;
  sidebar: Store<Sidebar>;
  pageInfo: Store<PageInfo>;
  layoutHooks: Store<layoutHooks>;
  commandLine: Store<CommandLineScreen | null>;
  commandLineReference: Store<CommandLineReference | null>;

  getPlugin: (name: string) => Plugin | undefined;
  getControl: (name: string) => Control | undefined;
  getSetting: <T>(path: string, defaultValue?: T) => T;

  setLayoutHook: (name: LayoutHook, hook: ReactNode) => void;
  getCommandLine: (reference?: CommandLineReference) => CommandLineScreen;
  showCommandLine: (screen?: CommandLineScreen) => void;

  save: () => Promise<Record<string, any>>;
  load: (data: Record<string, any>) => Promise<void>;
  reset: () => Promise<void>;
}
