// Alert Banner Types for the Alert Banner Builder Custom Field

export type AlertType = 'info' | 'warning' | 'error' | 'success';
export type AlertPosition = 'top' | 'bottom' | 'fixed' | 'inline';
export type ButtonStyle = 'primary' | 'secondary' | 'text';
export type DisplayOption = 'dismissible' | 'persistent' | 'timed';
export type AnimationType = 
  | 'none'
  | 'slide-down' 
  | 'slide-up' 
  | 'fade-in' 
  | 'bounce' 
  | 'shake';

export interface AlertCTA {
  text: string;
  url: string;
  style: ButtonStyle;
}

export interface AlertBannerConfig {
  message: string;
  type: AlertType;
  displayOption: DisplayOption;
  dismissible: boolean;
  timedDuration?: number; // in seconds, only for 'timed' display option
  icon: string;
  customIcon?: string; // base64 or URL for custom uploaded icon
  backgroundColor: string;
  textColor: string;
  cta?: AlertCTA;
  position: AlertPosition;
  animation: AnimationType;
}

// Default configuration
export const defaultAlertConfig: AlertBannerConfig = {
  message: '',
  type: 'info',
  displayOption: 'dismissible',
  dismissible: true,
  icon: 'info-circle',
  backgroundColor: '#E1EAFF',
  textColor: '#293BA1',
  position: 'top',
  animation: 'slide-down',
};

// Preset color palettes for each alert type
export const alertTypePresets: Record<AlertType, { bg: string; text: string; icon: string }> = {
  info: {
    bg: '#E1EAFF',
    text: '#293BA1',
    icon: 'information-outline',
  },
  warning: {
    bg: '#FFF6E7',
    text: '#7A2F00',
    icon: 'alert-outline',
  },
  error: {
    bg: '#FFE4E2',
    text: '#92001F',
    icon: 'alert-circle-outline',
  },
  success: {
    bg: '#BEF6E3',
    text: '#085040',
    icon: 'check-circle-outline',
  },
};

// Available icons (using MDI icon names)
export const availableIcons = [
  { name: 'information-outline', label: 'Info' },
  { name: 'alert-outline', label: 'Warning' },
  { name: 'alert-circle-outline', label: 'Error' },
  { name: 'check-circle-outline', label: 'Success' },
  { name: 'bell-outline', label: 'Bell' },
  { name: 'bullhorn-outline', label: 'Announcement' },
  { name: 'clock-outline', label: 'Clock' },
  { name: 'lightning-bolt-outline', label: 'Lightning' },
  { name: 'star-outline', label: 'Star' },
  { name: 'gift-outline', label: 'Gift' },
  { name: 'tag-outline', label: 'Tag' },
  { name: 'fire', label: 'Fire' },
];

// Color palette presets
export const colorPresets = [
  // Blues
  '#E1EAFF', '#C9D8FF', '#6987F9', '#4A65E8', '#293BA1',
  // Greens
  '#BEF6E3', '#8BEBD0', '#0EA184', '#007F66', '#085040',
  // Yellows/Oranges
  '#FFF6E7', '#FFE6BD', '#FFA037', '#E26E00', '#7A2F00',
  // Reds
  '#FFE4E2', '#FFCCC8', '#F4595A', '#D92739', '#92001F',
  // Purples
  '#EAE7FF', '#D9D4FF', '#9373FF', '#6E3FFF', '#4715AF',
  // Grays
  '#F7F7F7', '#E9E9E9', '#B5B5B5', '#717171', '#282828',
  // Black & White
  '#FFFFFF', '#000000',
];

