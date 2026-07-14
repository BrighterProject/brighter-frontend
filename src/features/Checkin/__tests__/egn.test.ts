import { describe, expect, it } from "vitest";
import { isValidBgPersonalNumber, isValidEGN, isValidLNCh } from "../lib/egn";

const VALID_EGNS = [
  "8001010034", // 1900s, male
  "9506150023", // 1900s, female
  "0543100119", // 2000s century offset
  "9031220040", // 1800s century offset, remainder=10 edge case
] as const;

// Valid LNCh checksums that are NOT valid EGNs (distinct registries).
const VALID_LNCHS = [
  "1000000001",
  "7452310877",
  "9001123459",
  "6408070009",
  "1234567893",
] as const;

describe("isValidEGN", () => {
  it.each(VALID_EGNS)("accepts valid EGN %s", (egn) => {
    expect(isValidEGN(egn)).toBe(true);
  });

  it.each(VALID_LNCHS)("rejects LNCh-only value %s", (lnch) => {
    expect(isValidEGN(lnch)).toBe(false);
  });

  it("rejects a wrong checksum", () => {
    expect(isValidEGN("8001010035")).toBe(false);
  });

  it("rejects the wrong length", () => {
    expect(isValidEGN("800101003")).toBe(false);
  });

  it("rejects non-digit input", () => {
    expect(isValidEGN("800101003A")).toBe(false);
  });
});

describe("isValidLNCh", () => {
  it.each(VALID_LNCHS)("accepts valid LNCh %s", (lnch) => {
    expect(isValidLNCh(lnch)).toBe(true);
  });

  it.each(VALID_EGNS)("rejects EGN-only value %s", (egn) => {
    expect(isValidLNCh(egn)).toBe(false);
  });

  it("rejects a wrong checksum", () => {
    expect(isValidLNCh("1000000002")).toBe(false);
  });

  it("rejects the wrong length", () => {
    expect(isValidLNCh("100000000")).toBe(false);
  });

  it("rejects non-digit input", () => {
    expect(isValidLNCh("12345678AB")).toBe(false);
  });
});

describe("isValidBgPersonalNumber", () => {
  it.each([...VALID_EGNS, ...VALID_LNCHS])("accepts %s", (value) => {
    expect(isValidBgPersonalNumber(value)).toBe(true);
  });

  it("rejects a value that is neither EGN nor LNCh", () => {
    expect(isValidBgPersonalNumber("8001010035")).toBe(false);
  });
});
