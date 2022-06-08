import type { ReactNode } from 'react';
import type { AtomEffect } from 'recoil';

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
  | 'ZoomOut';

export type StoreHook<T> = (newValue: T) => void;

export interface Store<T> {
  set(value: T): void;
  onChange(hook: StoreHook<T>): void;
  removeListener(hook: StoreHook<T>): void;
  effect(): AtomEffect<T>;
}

export interface StoreConstructor<T> {
  new (initialValue: T): Store<T>;
}

export enum LayoutPlacement {
  SIDEBAR = 'sidebar',
}

export interface SidebarOpts {
  icon: icons;
  render: ReactNode;
}

export type Hydration = Record<string, any>;

export type Button = {
  label: string;
  icon: icons;
  onClick: (button: Button) => Button | void;
};

export type Buttons = Button[];

export type ButtonCollections = Record<string, Buttons>;

export interface Plugin {
  name: string;
  setup: (app: App) => Promise<void>;
  sidebar?: () => SidebarOpts;
  buttons?: (buttons: ButtonCollections) => ButtonCollections;
  hydrate?: (hydration: Hydration) => Promise<Hydration>;
  ready?: () => void;
  save?: () => Promise<Record<string, any>>;
  reset?: () => Promise<void>;
  electron?: string;
}

export interface PluginConstructor {
  new (): Plugin;
}

export interface Config {
  url: string;
  plugins: PluginConstructor[];
  theme: {
    accent: string;
  };
  settings: {};
}

export type UserConfig = Partial<Config>;

export interface App {
  plugins: Plugin[];
  config: Config;
  buttons: Store<ButtonCollections>;
  sidebar: Store<SidebarOpts[]>;
  getPlugin: (name: string) => Plugin | undefined;
  getSetting: (name: string) => unknown;
}
