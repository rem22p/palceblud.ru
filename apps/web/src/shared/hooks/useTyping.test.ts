import { describe, it, expect } from "vitest";
import { calcWpm, calcAccuracy, processKeystroke, generateText } from "./typing-engine";

// ─── Tests ───

describe("calcWpm", () => {
  it("returns 0 for short elapsed time", () => {
    expect(calcWpm(50, 50)).toBe(0);
  });

  it("calculates WPM correctly: 60 chars in 1 min = 12 WPM", () => {
    expect(calcWpm(60, 60000)).toBe(12);
  });

  it("calculates WPM: 300 chars in 1 min = 60 WPM", () => {
    expect(calcWpm(300, 60000)).toBe(60);
  });

  it("calculates WPM: 150 chars in 30 sec = 60 WPM", () => {
    expect(calcWpm(150, 30000)).toBe(60);
  });

  it("rounds down fractional WPM", () => {
    expect(calcWpm(61, 60000)).toBe(12);
  });
});

describe("calcAccuracy", () => {
  it("returns 100% when no keystrokes", () => {
    expect(calcAccuracy(0, 0)).toBe(100);
  });

  it("returns 100% for all correct", () => {
    expect(calcAccuracy(50, 50)).toBe(100);
  });

  it("returns 50% for half correct", () => {
    expect(calcAccuracy(5, 10)).toBe(50);
  });

  it("returns 0% for all wrong", () => {
    expect(calcAccuracy(0, 10)).toBe(0);
  });

  it("rounds to integer", () => {
    expect(calcAccuracy(1, 3)).toBe(33);
  });
});

describe("processKeystroke", () => {
  const text = "hello world";

  it("adds correct character", () => {
    const result = processKeystroke("", text, "h");
    expect(result.typed).toBe("h");
    expect(result.isCorrect).toBe(true);
    expect(result.isComplete).toBe(false);
  });

  it("adds incorrect character", () => {
    const result = processKeystroke("", text, "x");
    expect(result.typed).toBe("x");
    expect(result.isCorrect).toBe(false);
  });

  it("handles backspace", () => {
    const result = processKeystroke("hel", text, "Backspace");
    expect(result.typed).toBe("he");
  });

  it("handles backspace on empty string", () => {
    const result = processKeystroke("", text, "Backspace");
    expect(result.typed).toBe("");
  });

  it("ignores modifier keys", () => {
    const result = processKeystroke("hel", text, "Shift");
    expect(result.typed).toBe("hel");
  });

  it("detects completion", () => {
    const short = "ab";
    const result = processKeystroke("a", short, "b");
    expect(result.isComplete).toBe(true);
  });

  it("matches space character", () => {
    const result = processKeystroke("hello", "hello world", " ");
    expect(result.typed).toBe("hello ");
    expect(result.isCorrect).toBe(true);
  });
});

describe("generateText", () => {
  it("generates correct number of words", () => {
    const words = ["the", "quick", "brown", "fox"];
    const result = generateText(words, 3);
    expect(result.split(" ")).toHaveLength(3);
  });

  it("uses only words from the pool", () => {
    const words = ["hello", "world"];
    const result = generateText(words, 10);
    result.split(" ").forEach((w) => {
      expect(words).toContain(w);
    });
  });
});
