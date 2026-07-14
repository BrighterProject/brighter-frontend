import { describe, expect, it } from "vitest";
import { bgDigitsToIso, formatBgDigits, isoToBgDigits } from "../lib/bg-date";

describe("isoToBgDigits", () => {
  it("converts ISO to a DDMMYYYY buffer", () => {
    expect(isoToBgDigits("1990-07-08")).toBe("08071990");
  });

  it("returns empty for non-ISO input", () => {
    expect(isoToBgDigits("")).toBe("");
    expect(isoToBgDigits("08.07.1990")).toBe("");
  });
});

describe("formatBgDigits", () => {
  it.each([
    ["", ""],
    ["0", "0"],
    ["08", "08"],
    ["0807", "08.07"],
    ["08071990", "08.07.1990"],
  ])("formats %s as %s", (input, expected) => {
    expect(formatBgDigits(input)).toBe(expected);
  });

  it("strips non-digits and caps at 8 digits", () => {
    expect(formatBgDigits("08a07/1990999")).toBe("08.07.1990");
  });
});

describe("bgDigitsToIso", () => {
  it("converts a full day-first buffer to ISO", () => {
    expect(bgDigitsToIso("08071990")).toBe("1990-07-08");
  });

  it("returns empty while incomplete", () => {
    expect(bgDigitsToIso("0807")).toBe("");
  });

  it("rejects an impossible calendar date", () => {
    expect(bgDigitsToIso("31021990")).toBe(""); // 31 Feb
    expect(bgDigitsToIso("00071990")).toBe("");
  });
});
