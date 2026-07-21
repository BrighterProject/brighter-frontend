/**
 * Trailing-slash canonicalization (SEO 1.5). A single canonical URL form —
 * **no trailing slash** — enforced with a 301 at the SSR layer so duplicate
 * crawls (`/bg/properties/123/` vs `/bg/properties/123`) are resolved before
 * the canonical tag is even read.
 */

/**
 * Compute the no-trailing-slash redirect target for a location, or `null` when
 * the path is already canonical (no trailing slash, or the bare root `/`).
 *
 * @param pathname - Location pathname, leading slash included.
 * @param searchStr - Query string including a leading `?` (or empty).
 * @param hash - Hash including a leading `#` (or empty).
 */
export function trailingSlashRedirect(
  pathname: string,
  searchStr = "",
  hash = "",
): string | null {
  if (pathname.length <= 1 || !pathname.endsWith("/")) return null;
  const stripped = pathname.replace(/\/+$/, "");
  // Force a single-slash, same-origin path. Collapsing leading `/` and `\`
  // prevents a crafted pathname (`//evil.com/`, `/\evil.com/`) from producing a
  // protocol-relative target that would redirect off-site (open redirect).
  const safePath = `/${stripped.replace(/^[/\\]+/, "")}`;
  return `${safePath}${searchStr}${hash}`;
}
