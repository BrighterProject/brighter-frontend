/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set to "true" only on the production deploy to allow search indexing. */
  readonly VITE_SEO_INDEXABLE?: string;
  /** Google Search Console meta-tag verification token. */
  readonly VITE_GSC_VERIFICATION?: string;
  /** Self-hosted Umami analytics script URL. */
  readonly VITE_UMAMI_SRC?: string;
  /** Umami website ID for this property. */
  readonly VITE_UMAMI_WEBSITE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
