import { describe, it, expect, afterEach, vi } from "vitest";
import {
  isIndexable,
  gscVerificationToken,
  rootMetaExtras,
} from "../site-meta";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isIndexable", () => {
  it("is true only when explicitly opted in", () => {
    vi.stubEnv("VITE_SEO_INDEXABLE", "true");
    expect(isIndexable()).toBe(true);
  });

  it("defaults to false when unset (staging/preview safety)", () => {
    vi.stubEnv("VITE_SEO_INDEXABLE", "");
    expect(isIndexable()).toBe(false);
  });

  it("is false for any value other than 'true'", () => {
    vi.stubEnv("VITE_SEO_INDEXABLE", "false");
    expect(isIndexable()).toBe(false);
    vi.stubEnv("VITE_SEO_INDEXABLE", "1");
    expect(isIndexable()).toBe(false);
  });
});

describe("gscVerificationToken", () => {
  it("returns the trimmed token when set", () => {
    vi.stubEnv("VITE_GSC_VERIFICATION", "  abc123  ");
    expect(gscVerificationToken()).toBe("abc123");
  });

  it("returns undefined when unset or blank", () => {
    vi.stubEnv("VITE_GSC_VERIFICATION", "");
    expect(gscVerificationToken()).toBeUndefined();
    vi.stubEnv("VITE_GSC_VERIFICATION", "   ");
    expect(gscVerificationToken()).toBeUndefined();
  });
});

describe("rootMetaExtras", () => {
  it("emits robots noindex on a non-indexable deploy", () => {
    vi.stubEnv("VITE_SEO_INDEXABLE", "");
    vi.stubEnv("VITE_GSC_VERIFICATION", "");
    expect(rootMetaExtras()).toContainEqual({
      name: "robots",
      content: "noindex, nofollow",
    });
  });

  it("does NOT emit robots noindex on an indexable (prod) deploy", () => {
    vi.stubEnv("VITE_SEO_INDEXABLE", "true");
    vi.stubEnv("VITE_GSC_VERIFICATION", "");
    expect(rootMetaExtras()).not.toContainEqual(
      expect.objectContaining({ name: "robots" }),
    );
  });

  it("emits the GSC verification meta when a token is configured", () => {
    vi.stubEnv("VITE_SEO_INDEXABLE", "true");
    vi.stubEnv("VITE_GSC_VERIFICATION", "token-xyz");
    expect(rootMetaExtras()).toContainEqual({
      name: "google-site-verification",
      content: "token-xyz",
    });
  });

  it("emits nothing when indexable and no token", () => {
    vi.stubEnv("VITE_SEO_INDEXABLE", "true");
    vi.stubEnv("VITE_GSC_VERIFICATION", "");
    expect(rootMetaExtras()).toEqual([]);
  });
});
