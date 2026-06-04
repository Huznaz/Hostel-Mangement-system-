/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_MODE?: "user" | "admin" | "full";
  readonly VITE_ADMIN_APP_URL?: string;
  readonly VITE_USER_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
