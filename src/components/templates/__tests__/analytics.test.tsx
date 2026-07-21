import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { Analytics, umamiConfig } from "../analytics";
import { setCookieConsent } from "@/lib/cookie-consent";

const UMAMI = {
  src: "https://umami.example/script.js",
  websiteId: "site-123",
};

function stubUmamiEnv() {
  vi.stubEnv("VITE_UMAMI_SRC", UMAMI.src);
  vi.stubEnv("VITE_UMAMI_WEBSITE_ID", UMAMI.websiteId);
}

function injectedScript(): HTMLScriptElement | null {
  return document.getElementById("umami-analytics") as HTMLScriptElement | null;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  injectedScript()?.remove();
  localStorage.clear();
});

describe("umamiConfig", () => {
  it("returns config when both env vars are set", () => {
    stubUmamiEnv();
    expect(umamiConfig()).toEqual(UMAMI);
  });

  it("returns null when either env var is missing", () => {
    vi.stubEnv("VITE_UMAMI_SRC", UMAMI.src);
    vi.stubEnv("VITE_UMAMI_WEBSITE_ID", "");
    expect(umamiConfig()).toBeNull();
  });
});

describe("Analytics", () => {
  it("does not inject the script without analytics consent", async () => {
    stubUmamiEnv();
    setCookieConsent(false);
    render(<Analytics />);
    await waitFor(() => expect(injectedScript()).toBeNull());
  });

  it("injects the Umami script when consent is already granted", async () => {
    stubUmamiEnv();
    setCookieConsent(true);
    render(<Analytics />);
    await waitFor(() => {
      const script = injectedScript();
      expect(script).not.toBeNull();
      expect(script?.src).toBe(UMAMI.src);
      expect(script?.dataset.websiteId).toBe(UMAMI.websiteId);
      expect(script?.defer).toBe(true);
    });
  });

  it("injects the script when consent is granted after mount", async () => {
    stubUmamiEnv();
    render(<Analytics />);
    expect(injectedScript()).toBeNull();
    setCookieConsent(true);
    await waitFor(() => expect(injectedScript()).not.toBeNull());
  });

  it("does not inject when Umami env is unconfigured", async () => {
    setCookieConsent(true);
    render(<Analytics />);
    await waitFor(() => expect(injectedScript()).toBeNull());
  });
});
