/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_N8N_WEBHOOK_URL: string;
  readonly VITE_USE_MOCK: string;
  readonly VITE_SHOW_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
