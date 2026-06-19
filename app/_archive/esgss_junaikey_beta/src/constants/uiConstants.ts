/**
 * Magic Numbers Constants - UI Components
 * 用於替換程式碼中的 magic numbers
 */

// ============================================================================
// Toast Notification Constants
// ============================================================================

export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
  INFINITE: 0,
} as const;

export const TOAST_POSITION = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right',
  TOP_CENTER: 'top-center',
  BOTTOM_CENTER: 'bottom-center',
} as const;

export const TOAST_LIMIT = {
  DEFAULT: 5,
  MAX: 10,
} as const;

// ============================================================================
// Tour Constants
// ============================================================================

export const TOUR_DEFAULT_OPTIONS = {
  STEP_DURATION: 0, // Infinite
  SHOW_PROGRESS: true,
  ALLOW_SKIP: true,
  SHOW_CLOSE_BUTTON: true,
 Keyboard_NAVIGATION: true,
  OVERLAY: true,
  SPOTLIGHT: true,
} as const;

export const TOUR_POSITION = {
  TOP: 'top',
  BOTTOM: 'bottom',
  LEFT: 'left',
  RIGHT: 'right',
  CENTER: 'center',
} as const;

// ============================================================================
// Virtual Scroll Constants
// ============================================================================

export const VIRTUAL_SCROLL = {
  OVERSCAN_COUNT: 3,
  DEFAULT_ITEM_SIZE: 50,
  MIN_ITEM_SIZE: 1,
  MAX_ITEM_SIZE: 500,
  DEFAULT_OVERSCAN: 5,
} as const;

export const GRID_BREAKPOINTS = {
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
  XLARGE: 5,
} as const;

// ============================================================================
// Image Constants
// ============================================================================

export const IMAGE_QUALITY = {
  THUMBNAIL: 0.3,
  MEDIUM: 0.6,
  HIGH: 0.9,
  MAX: 1.0,
} as const;

export const IMAGE_SIZES = {
  AVATAR: 40,
  THUMBNAIL: 150,
  MEDIUM: 400,
  LARGE: 800,
  XLARGE: 1200,
  ORIGINAL: 0,
} as const;

export const LAZY_LOAD_THRESHOLD = {
  VIEWPORT: 50, // pixels
  LOAD_AHEAD: 500, // pixels
} as const;

// ============================================================================
// Rate Limiting Constants
// ============================================================================

export const RATE_LIMIT_WINDOW = {
  ONE_SECOND: 1000,
  ONE_MINUTE: 60000,
  ONE_HOUR: 3600000,
  ONE_DAY: 86400000,
} as const;

// ============================================================================
// Validation Constants
// ============================================================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_DIGITS: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_UPLOAD_SIZE: 50 * 1024 * 1024, // 50MB
} as const;

// ============================================================================
// Date/Time Constants
// ============================================================================

export const DATE_FORMATS = {
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'YYYY年MM月DD日',
  TIME: 'HH:mm:ss',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  RELATIVE: 'relative',
} as const;

export const TIME_UNITS = {
  MILLISECOND: 1,
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
  YEAR: 365 * 24 * 60 * 60 * 1000,
} as const;

// ============================================================================
// Animation Constants
// ============================================================================

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

export const ANIMATION_DELAY = {
  SHORT: 50,
  MEDIUM: 100,
  LONG: 200,
} as const;

// ============================================================================
// Breakpoint Constants
// ============================================================================

export const BREAKPOINTS = {
  XS: 480,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// ============================================================================
// API Constants
// ============================================================================

export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000, // 1 second
  BATCH_SIZE: 100,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

// ============================================================================
// Storage Constants
// ============================================================================

export const STORAGE = {
  CACHE_PREFIX: 'esgss_',
  MAX_CACHE_SIZE: 5 * 1024 * 1024, // 5MB
  CACHE_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
} as const;

// ============================================================================
// Offline Constants
// ============================================================================

export const OFFLINE = {
  SYNC_INTERVAL: 30000, // 30 seconds
  MAX_QUEUE_SIZE: 100,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 5000, // 5 seconds
} as const;

// ============================================================================
// i18n Constants
// ============================================================================

export const I18N = {
  DEFAULT_LOCALE: 'zh-TW',
  FALLBACK_LOCALE: 'en-US',
  RTL_LOCALES: ['ar', 'he', 'fa', 'ur'],
} as const;

// ============================================================================
// Realtime Constants
// ============================================================================

export const REALTIME = {
  PRESENCE_HEARTBEAT: 10000, // 10 seconds
  CURSOR_UPDATE_INTERVAL: 50, // 50ms
  TYPING_TIMEOUT: 3000, // 3 seconds
  RECONNECT_DELAY: 1000, // 1 second
  MAX_RECONNECT_ATTEMPTS: 5,
} as const;

// ============================================================================
// Error Boundary Constants
// ============================================================================

export const ERROR_BOUNDARY = {
  MAX_ERRORS: 10,
  ERROR_RESET_DELAY: 60000, // 1 minute
} as const;
