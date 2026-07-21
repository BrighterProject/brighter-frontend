import { describe, it, expect } from "vitest";
import { buildRobotsTxt, buildSitemapXml } from "../sitemap";

const SITE = "https://test.example";

describe("buildRobotsTxt", () => {
  it("disallows everything on a non-indexable deploy", () => {
    const txt = buildRobotsTxt({ indexable: false, siteUrl: SITE });
    expect(txt).toContain("User-agent: *");
    expect(txt).toContain("Disallow: /");
    expect(txt).not.toContain("Sitemap:");
  });

  it("allows crawling and disallows private flows on an indexable deploy", () => {
    const txt = buildRobotsTxt({ indexable: true, siteUrl: SITE });
    expect(txt).toContain("Allow: /");
    expect(txt).toContain("Disallow: /*/auth/");
    expect(txt).toContain("Disallow: /*/bookings/");
    expect(txt).toContain("Disallow: /*/checkin/");
    expect(txt).toContain("Disallow: /*/book");
    expect(txt).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});

describe("buildSitemapXml", () => {
  it("emits a locale-prefixed <url> per locale with hreflang alternates", () => {
    const xml = buildSitemapXml({
      siteUrl: SITE,
      locales: ["bg", "en"],
      routes: [{ path: "/properties/123" }],
    });
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
    // one <loc> per locale
    expect(xml).toContain(`<loc>${SITE}/bg/properties/123</loc>`);
    expect(xml).toContain(`<loc>${SITE}/en/properties/123</loc>`);
    // alternates present in each url block
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="bg" href="${SITE}/bg/properties/123"/>`,
    );
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="en" href="${SITE}/en/properties/123"/>`,
    );
    expect(xml).toContain(
      `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/bg/properties/123"/>`,
    );
    // exactly two <url> blocks (bg + en)
    expect(xml.match(/<url>/g)).toHaveLength(2);
  });

  it("renders the home path as the bare locale root", () => {
    const xml = buildSitemapXml({ siteUrl: SITE, locales: ["bg", "en"], routes: [{ path: "" }] });
    expect(xml).toContain(`<loc>${SITE}/bg</loc>`);
    expect(xml).toContain(`<loc>${SITE}/en</loc>`);
  });

  it("includes optional lastmod/changefreq/priority when supplied", () => {
    const xml = buildSitemapXml({
      siteUrl: SITE,
      locales: ["bg"],
      routes: [{ path: "/x", lastmod: "2026-07-21", changefreq: "daily", priority: 0.8 }],
    });
    expect(xml).toContain("<lastmod>2026-07-21</lastmod>");
    expect(xml).toContain("<changefreq>daily</changefreq>");
    expect(xml).toContain("<priority>0.8</priority>");
  });

  it("escapes XML-significant characters in URLs", () => {
    const xml = buildSitemapXml({
      siteUrl: SITE,
      locales: ["bg"],
      routes: [{ path: "/x?a=1&b=2" }],
    });
    expect(xml).toContain(`<loc>${SITE}/bg/x?a=1&amp;b=2</loc>`);
    expect(xml).not.toContain("&b=2");
  });
});
