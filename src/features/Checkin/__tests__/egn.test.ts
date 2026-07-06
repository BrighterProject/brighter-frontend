import { describe, expect, it } from "vitest";
import { isValidEGN } from "../lib/egn";

describe("isValidEGN", () => {
  it.each([
    "8001010034", // 1900s, male
    "9506150023", // 1900s, female
    "0543100119", // 2000s century offset
    "9031220040", // 1800s century offset, remainder=10 edge case
  ])("accepts valid EGN %s", (egn) => {
    expect(isValidEGN(egn)).toBe(true);
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
