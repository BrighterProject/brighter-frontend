/** A `<meta>` descriptor accepted by TanStack Router's `head()`. */
export interface HeadMeta {
  name?: string;
  property?: string;
  content: string;
}

/**
 * Whether this deployment may be indexed by search engines.
 *
 * Safe default: **not** indexable unless a deploy explicitly opts in via
 * `VITE_SEO_INDEXABLE="true"`. This guarantees staging/preview/local builds
 * never leak into search results and compete with production, even when the
 * env var is simply forgotten. Production sets it to `"true"`.
 */
export function isIndexable(): boolean {
  return import.meta.env.VITE_SEO_INDEXABLE === "true";
}

/** Google Search Console meta-tag verification token, if configured. */
export function gscVerificationToken(): string | undefined {
  const token = import.meta.env.VITE_GSC_VERIFICATION?.trim();
  return token ? token : undefined;
}

/**
 * Extra `<meta>` entries for the root document head:
 *  - `robots: noindex, nofollow` on non-indexable deploys (staging/preview/dev)
 *  - `google-site-verification` when a Search Console token is configured
 */
export function rootMetaExtras(): HeadMeta[] {
  const extras: HeadMeta[] = [];
  if (!isIndexable()) {
    extras.push({ name: "robots", content: "noindex, nofollow" });
  }
  const token = gscVerificationToken();
  if (token) {
    extras.push({ name: "google-site-verification", content: token });
  }
  return extras;
}
