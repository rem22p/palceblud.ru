import { describe, it, expect } from "vitest";
import {
  initKeyStats,
  updateKeyStats,
  getWeakestKey,
  shouldUnlockNext,
  generateDrillWords,
  type KeyStatsMap,
} from "./keyDrill";

const HOME_ROW_EN = ["a", "s", "d", "f", "j", "k", "l", ";"];
const FULL_EN = ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"];
const ALL_KEYS = "abcdefghijklmnopqrstuvwxyz".split("");

describe("initKeyStats", () => {
  it("creates stats for each key with zero values", () => {
    const stats = initKeyStats(HOME_ROW_EN);
    expect(Object.keys(stats)).toHaveLength(8);
    for (const key of HOME_ROW_EN) {
      expect(stats[key]).toEqual({ speed: 0, accuracy: 100, tests: 0, unlocked: true });
    }
  });

  it("marks non-home-row keys as locked", () => {
    const stats = initKeyStats(HOME_ROW_EN, ALL_KEYS);
    expect(stats["a"].unlocked).toBe(true);
    expect(stats["e"].unlocked).toBe(false);
    expect(stats["z"].unlocked).toBe(false);
  });
});

describe("updateKeyStats", () => {
  it("increments tests count and updates speed for 100% accuracy", () => {
    const stats = initKeyStats(HOME_ROW_EN);
    const updated = updateKeyStats(stats, "a", 45, 100);
    expect(updated["a"].tests).toBe(1);
    expect(updated["a"].speed).toBe(45);
    expect(updated["a"].accuracy).toBe(100);
  });

  it("accumulates speed as rolling average", () => {
    let stats = initKeyStats(HOME_ROW_EN);
    stats = updateKeyStats(stats, "a", 40, 100);
    stats = updateKeyStats(stats, "a", 60, 100);
    expect(stats["a"].speed).toBe(50); // (40+60)/2
    expect(stats["a"].tests).toBe(2);
  });

  it("updates accuracy on errors", () => {
    let stats = initKeyStats(HOME_ROW_EN);
    stats = updateKeyStats(stats, "a", 50, 100);
    stats = updateKeyStats(stats, "a", 50, 0); // one error
    expect(stats["a"].accuracy).toBe(50); // 1/2 correct
    expect(stats["a"].tests).toBe(2);
  });

  it("does not crash for unknown key", () => {
    const stats = initKeyStats(HOME_ROW_EN);
    const updated = updateKeyStats(stats, "z", 30, 80);
    expect(updated).toEqual(stats); // unchanged
  });
});

describe("getWeakestKey", () => {
  it("returns key with lowest accuracy", () => {
    let stats = initKeyStats(HOME_ROW_EN);
    stats = updateKeyStats(stats, "a", 50, 100);
    stats = updateKeyStats(stats, "s", 50, 50); // 50% accuracy
    stats = updateKeyStats(stats, "d", 60, 100);

    expect(getWeakestKey(stats)).toBe("s");
  });

  it("returns key with lowest speed when accuracy is tied", () => {
    let stats = initKeyStats(HOME_ROW_EN);
    stats = updateKeyStats(stats, "a", 30, 100);
    stats = updateKeyStats(stats, "s", 50, 100);

    expect(getWeakestKey(stats)).toBe("a");
  });

  it("returns null when no tests have been done", () => {
    const stats = initKeyStats(HOME_ROW_EN);
    expect(getWeakestKey(stats)).toBeNull();
  });

  it("ignores locked keys", () => {
    const stats = initKeyStats(HOME_ROW_EN, ALL_KEYS);
    // e is locked (not in home row), should not be returned
    const weak = getWeakestKey(stats);
    expect(weak).toBeNull(); // no unlocked keys have tests
  });
});

describe("shouldUnlockNext", () => {
  it("returns true when all unlocked keys have 5+ tests at 100% accuracy", () => {
    const stats = initKeyStats(["a", "s"], ALL_KEYS);
    // Give both keys 5 perfect tests
    let s = stats;
    for (let i = 0; i < 5; i++) {
      s = updateKeyStats(s, "a", 50, 100);
      s = updateKeyStats(s, "s", 50, 100);
    }
    expect(shouldUnlockNext(s)).toBe(true);
  });

  it("returns false when any key has < 5 tests", () => {
    const stats = initKeyStats(["a", "s"], ALL_KEYS);
    let s = stats;
    s = updateKeyStats(s, "a", 50, 100);
    s = updateKeyStats(s, "a", 50, 100);
    expect(shouldUnlockNext(s)).toBe(false);
  });

  it("returns false when any key has < 100% accuracy", () => {
    const stats = initKeyStats(["a", "s"], ALL_KEYS);
    let s = stats;
    for (let i = 0; i < 5; i++) {
      s = updateKeyStats(s, "a", 50, 100);
      s = updateKeyStats(s, "s", 50, i === 0 ? 0 : 100); // one error on first test
    }
    expect(shouldUnlockNext(s)).toBe(false);
  });

  it("returns false when all keys are already unlocked", () => {
    const stats = initKeyStats(ALL_KEYS, ALL_KEYS);
    // All keys unlocked, nothing to unlock
    expect(shouldUnlockNext(stats)).toBe(false);
  });
});

describe("generateDrillWords", () => {
  it("generates words only from the given alphabet", () => {
    const letters = ["a", "s", "d", "f"];
    const words = generateDrillWords(letters, null, 25);
    expect(words).toHaveLength(25);
    for (const word of words) {
      for (const ch of word) {
        expect(letters).toContain(ch);
      }
    }
  });

  it("always includes the forced key in every word", () => {
    const letters = ["a", "s", "d", "f", "j"];
    const words = generateDrillWords(letters, "j", 10);
    for (const word of words) {
      expect(word).toContain("j");
    }
  });

  it("generates words of length 2-5", () => {
    const letters = ["a", "s", "d", "f", "j", "k"];
    const words = generateDrillWords(letters, null, 50);
    for (const word of words) {
      expect(word.length).toBeGreaterThanOrEqual(2);
      expect(word.length).toBeLessThanOrEqual(5);
    }
  });

  it("returns empty array for empty alphabet", () => {
    expect(generateDrillWords([], null, 10)).toEqual([]);
  });

  it("returns single-letter words for single-letter alphabet", () => {
    const words = generateDrillWords(["a"], null, 5);
    expect(words).toEqual(["a", "a", "a", "a", "a"]);
  });
});
