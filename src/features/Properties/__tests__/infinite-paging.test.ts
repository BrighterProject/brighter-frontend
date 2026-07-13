import { describe, it, expect } from "vitest";
import { nextInfinitePage } from "../api/hooks";

describe("nextInfinitePage", () => {
  it("advances while fewer rows are loaded than the total", () => {
    expect(nextInfinitePage(20, 45, 1)).toBe(2);
    expect(nextInfinitePage(40, 45, 2)).toBe(3);
  });

  it("stops when all rows are loaded (last page exactly full)", () => {
    // 40 loaded of 40 total — no phantom extra request even though page was full
    expect(nextInfinitePage(40, 40, 2)).toBeUndefined();
  });

  it("stops when loaded exceeds total", () => {
    expect(nextInfinitePage(45, 45, 3)).toBeUndefined();
  });
});
