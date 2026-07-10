import { describe, it, expect, afterEach } from "vitest";
import { buildCountryOptions } from "../countries";

describe("buildCountryOptions", () => {
  const originalDisplayNames = Intl.DisplayNames;

  afterEach(() => {
    Object.defineProperty(Intl, "DisplayNames", {
      value: originalDisplayNames,
      configurable: true,
      writable: true,
    });
  });

  it("resolves localized country names when Intl.DisplayNames is available", () => {
    const options = buildCountryOptions("en");

    expect(options.find((o) => o.code === "DE")?.name).toBe("Germany");
    const names = options.map((o) => o.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, "en")));
  });

  it("falls back to ISO codes without throwing when Intl.DisplayNames is unsupported", () => {
    // Simulate an older browser (e.g. iOS Safari < 14.5) lacking Intl.DisplayNames.
    Object.defineProperty(Intl, "DisplayNames", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    expect(() => buildCountryOptions("bg")).not.toThrow();
    const options = buildCountryOptions("bg");
    expect(options.find((o) => o.code === "DE")?.name).toBe("DE");
    expect(options.length).toBeGreaterThan(50);
  });

  it("does not throw on a malformed locale", () => {
    expect(() => buildCountryOptions("not a locale!!")).not.toThrow();
  });

  // Regression: production crashed with "invalid element in locales argument"
  // when locale storage had not hydrated and getLocale() returned undefined,
  // producing `new Intl.DisplayNames([undefined], …)`.
  it.each([undefined, null])(
    "does not throw and still returns options when locale is %s",
    (locale) => {
      expect(() => buildCountryOptions(locale)).not.toThrow();
      const options = buildCountryOptions(locale);
      expect(options.length).toBe(97);
      expect(options.every((o) => typeof o.name === "string" && o.name)).toBe(
        true,
      );
    },
  );
});
