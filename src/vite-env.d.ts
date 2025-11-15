/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

/**
 * Type definitions for Vite environment
 *
 * Provides TypeScript support for:
 * - import.meta.env variables
 * - Vite-specific features
 * - PWA types
 */

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_URL?: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly hot?: {
    accept: (cb?: () => void) => void;
    dispose: (cb: (data: any) => void) => void;
    decline: () => void;
    invalidate: () => void;
    on: (event: string, cb: (...args: any[]) => void) => void;
  };
}
