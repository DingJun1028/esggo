/// <reference types="vite/client" />

declare module 'ical.js' {
  export const Component: unknown;
  export const Event: unknown;
  export const parse: (input: string) => unknown;
  const ICAL: unknown;
  export default ICAL;
}

declare module 'lucide-react'; // Fallback if type definition missing (rare)

declare module 'web-vitals' {
  export function getCLS(onReport: (report: unknown) => void): void;
  export function getFID(onReport: (report: unknown) => void): void;
  export function getFCP(onReport: (report: unknown) => void): void;
  export function getLCP(onReport: (report: unknown) => void): void;
  export function getTTFB(onReport: (report: unknown) => void): void;
}

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_FIREBASE_API_KEY?: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
  readonly VITE_FIREBASE_PROJECT_ID?: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  readonly VITE_FIREBASE_APP_ID?: string;
  readonly VITE_USE_EMULATORS?: string;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
