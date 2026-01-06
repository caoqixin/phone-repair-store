/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_RESEND_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
