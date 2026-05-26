// ─── Pure typing engine (framework-agnostic) ───

/** Calculate WPM: (correct chars / 5) / minutes */
export function calcWpm(correctChars: number, elapsedMs: number): number {
  if (elapsedMs < 100) return 0;
  const minutes = elapsedMs / 60000;
  return Math.round(correctChars / 5 / minutes);
}

/** Calculate accuracy: correct / total * 100 */
export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

/** Handle a single keystroke */
export function processKeystroke(
  typed: string,
  text: string,
  key: string,
): { typed: string; isCorrect: boolean; isComplete: boolean } {
  if (key === "Backspace") {
    return {
      typed: typed.slice(0, -1),
      isCorrect: true,
      isComplete: false,
    };
  }

  if (key.length !== 1) {
    return { typed, isCorrect: true, isComplete: false };
  }

  const expected = text[typed.length] ?? "";
  const newTyped = typed + key;

  return {
    typed: newTyped,
    isCorrect: key === expected,
    isComplete: newTyped.length >= text.length,
  };
}

/** Generate random word sequence */
export function generateText(words: string[], count: number): string {
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(words[Math.floor(Math.random() * words.length)]);
  }
  return picked.join(" ");
}
