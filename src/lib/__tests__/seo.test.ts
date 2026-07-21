import { describe, it, expect, afterEach, vi } from "vitest";
import { buildSeo, buildSiteDefaults, siteUrl, SITE_NAME } from "../seo";

const SITE = "https://test.example";

function stubSite(url = SITE): void {
  vi.stubEnv("VITE_SITE_URL", url);
}

afterEach(() => {
  vi.unstubAllEnvs();
});

/** Pull the `content` of the first meta entry matching a name/property. */
function metaContent(
  meta: ReadonlyArray<Record<string, unknown>>,
  key: "name" | "property",
  value: string,
): string | undefined {
  const hit = meta.find((m) => m[key] === value);
  return hit?.content as string | undefined;
}

function titleOf(meta: ReadonlyArray<Record<string, unknown>>): string | undefined {
  return meta.find((m) => "title" in m)?.title as string | undefined;
}

function linkHref(
  links: ReadonlyArray<Record<string, unknown>>,
  rel: string,
  hrefLang?: string,
): string | undefined {
  const hit = links.find(
    (l) => l.rel === rel && (hrefLang === undefined || l.hrefLang === hrefLang),
  );
  return hit?.href as string | undefined;
}

describe("siteUrl", () => {
  it("reads VITE_SITE_URL and strips a trailing slash", () => {
    stubSite("https://test.example/");
    expect(siteUrl()).toBe("https://test.example");
  });

  it("falls back to the production host when unset", () => {
    vi.stubEnv("VITE_SITE_URL", "");
    expect(siteUrl()).toBe("https://pochivka-na-moreto.bg");
  });
});

describe("buildSeo — title & description", () => {
  it("emits the title and description", () => {
    stubSite();
    const { meta } = buildSeo({
      locale: "bg",
      path: "/properties/123",
      title: "Nice villa",
      description: "A lovely place",
    });
    expect(titleOf(meta)).toBe("Nice villa");
    expect(metaContent(meta, "name", "description")).toBe("A lovely place");
  });
});

describe("buildSeo — canonical & hreflang", () => {
  it("builds an absolute canonical with the locale prefix", () => {
    stubSite();
    const { links } = buildSeo({
      locale: "bg",
      path: "/properties/123",
      title: "t",
      description: "d",
    });
    expect(linkHref(links, "canonical")).toBe(
      `${SITE}/bg/properties/123`,
    );
  });

  it("emits hreflang alternates for every locale plus x-default → bg", () => {
    stubSite();
    const { links } = buildSeo({
      locale: "en",
      path: "/properties/123",
      title: "t",
      description: "d",
    });
    expect(linkHref(links, "alternate", "bg")).toBe(`${SITE}/bg/properties/123`);
    expect(linkHref(links, "alternate", "en")).toBe(`${SITE}/en/properties/123`);
    expect(linkHref(links, "alternate", "x-default")).toBe(
      `${SITE}/bg/properties/123`,
    );
  });

  it("normalizes a trailing slash away and handles the root path", () => {
    stubSite();
    const trailing = buildSeo({ locale: "bg", path: "/properties/123/", title: "t", description: "d" });
    expect(linkHref(trailing.links, "canonical")).toBe(`${SITE}/bg/properties/123`);
    const root = buildSeo({ locale: "bg", path: "", title: "t", description: "d" });
    expect(linkHref(root.links, "canonical")).toBe(`${SITE}/bg`);
  });
});

describe("buildSeo — Open Graph & Twitter", () => {
  it("emits localized og:site_name, mapped og:locale, and og:url == canonical", () => {
    stubSite();
    const { meta, links } = buildSeo({
      locale: "bg",
      path: "/properties/123",
      title: "t",
      description: "d",
    });
    expect(metaContent(meta, "property", "og:site_name")).toBe(SITE_NAME.bg);
    expect(metaContent(meta, "property", "og:locale")).toBe("bg_BG");
    expect(metaContent(meta, "property", "og:type")).toBe("website");
    expect(metaContent(meta, "property", "og:url")).toBe(linkHref(links, "canonical"));
    expect(metaContent(meta, "name", "twitter:card")).toBe("summary_large_image");
    expect(metaContent(meta, "name", "twitter:title")).toBe("t");
  });

  it("absolutizes a relative image and passes an absolute image through", () => {
    stubSite();
    const rel = buildSeo({ locale: "en", path: "/x", title: "t", description: "d", image: "/img/a.jpg" });
    expect(metaContent(rel.meta, "property", "og:image")).toBe(`${SITE}/img/a.jpg`);
    const abs = buildSeo({ locale: "en", path: "/x", title: "t", description: "d", image: "https://cdn.example/b.jpg" });
    expect(metaContent(abs.meta, "property", "og:image")).toBe("https://cdn.example/b.jpg");
  });

  it("uses the type argument for og:type", () => {
    stubSite();
    const { meta } = buildSeo({ locale: "en", path: "/x", title: "t", description: "d", type: "article" });
    expect(metaContent(meta, "property", "og:type")).toBe("article");
  });
});

describe("buildSeo — noindex", () => {
  it("omits robots by default and emits noindex,nofollow when requested", () => {
    stubSite();
    const on = buildSeo({ locale: "en", path: "/auth/login", title: "t", description: "d", noindex: true });
    expect(metaContent(on.meta, "name", "robots")).toBe("noindex, nofollow");
    const off = buildSeo({ locale: "en", path: "/x", title: "t", description: "d" });
    expect(metaContent(off.meta, "name", "robots")).toBeUndefined();
  });
});

describe("buildSeo — pagination self-canonical (1.6)", () => {
  it("carries ?page=N on canonical, og:url and alternates for page > 1", () => {
    stubSite();
    const { links, meta } = buildSeo({
      locale: "bg",
      path: "/accommodation/burgas/nesebar",
      title: "t",
      description: "d",
      page: 3,
    });
    expect(linkHref(links, "canonical")).toBe(`${SITE}/bg/accommodation/burgas/nesebar?page=3`);
    expect(metaContent(meta, "property", "og:url")).toBe(`${SITE}/bg/accommodation/burgas/nesebar?page=3`);
    expect(linkHref(links, "alternate", "en")).toBe(`${SITE}/en/accommodation/burgas/nesebar?page=3`);
    expect(linkHref(links, "alternate", "x-default")).toBe(`${SITE}/bg/accommodation/burgas/nesebar?page=3`);
  });

  it("omits the query for page 1", () => {
    stubSite();
    const { links } = buildSeo({ locale: "bg", path: "/x", title: "t", description: "d", page: 1 });
    expect(linkHref(links, "canonical")).toBe(`${SITE}/bg/x`);
  });
});

describe("buildSiteDefaults — layout fallback meta", () => {
  it("emits title/description and OG/Twitter meta but NO canonical, hreflang or og:url", () => {
    stubSite();
    const { meta } = buildSiteDefaults({ locale: "bg", title: "Home", description: "Welcome" });
    expect(titleOf(meta)).toBe("Home");
    expect(metaContent(meta, "property", "og:site_name")).toBe(SITE_NAME.bg);
    expect(metaContent(meta, "property", "og:title")).toBe("Home");
    expect(metaContent(meta, "name", "twitter:card")).toBe("summary_large_image");
    // Must not leak page-specific canonical signals into the shared layout.
    expect(metaContent(meta, "property", "og:url")).toBeUndefined();
    expect("links" in (buildSiteDefaults({ locale: "bg", title: "t", description: "d" }) as object)).toBe(false);
  });
});

describe("buildSeo — JSON-LD", () => {
  it("emits one ld+json script for a single object", () => {
    stubSite();
    const { scripts } = buildSeo({
      locale: "en",
      path: "/x",
      title: "t",
      description: "d",
      jsonLd: { "@type": "Thing", name: "x" },
    });
    expect(scripts).toHaveLength(1);
    expect(scripts[0].type).toBe("application/ld+json");
    expect(JSON.parse(scripts[0].children as string)).toEqual({ "@type": "Thing", name: "x" });
  });

  it("emits one script per node for an array and drops null/undefined nodes", () => {
    stubSite();
    const { scripts } = buildSeo({
      locale: "en",
      path: "/x",
      title: "t",
      description: "d",
      jsonLd: [{ "@type": "A" }, null, undefined, { "@type": "B" }],
    });
    expect(scripts.map((s) => JSON.parse(s.children as string)["@type"])).toEqual(["A", "B"]);
  });

  it("emits no scripts when jsonLd is absent", () => {
    stubSite();
    const { scripts } = buildSeo({ locale: "en", path: "/x", title: "t", description: "d" });
    expect(scripts).toEqual([]);
  });
});
