import { useState, useEffect, useRef, useCallback } from "react";

export interface TypingState {
  typed: string;
  currentIndex: number;
  errors: number; // total incorrect keystrokes
  wpm: number;
  rawWpm: number;
  accuracy: number; // 0..100
  consistency: number; // 0..100 (not implemented yet)
  timeLeft: number; // seconds remaining
  isRunning: boolean;
  isFinished: boolean;
}

interface TypingConfig {
  text: string;
  duration: number; // seconds
  onFinish?: (state: TypingState) => void;
}

export function useTyping({ text, duration, onFinish }: TypingConfig) {
  const [state, setState] = useState<TypingState>({
    typed: "",
    currentIndex: 0,
    errors: 0,
    wpm: 0,
    rawWpm: 0,
    accuracy: 100,
    consistency: 100,
    timeLeft: duration,
    isRunning: false,
    isFinished: false,
  });

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  // Calculate WPM every tick
  const calcStats = useCallback((now: number, currentIndex: number, errors: number) => {
    const elapsedMin = (now - startTimeRef.current) / 60000;
    if (elapsedMin < 0.001) return { wpm: 0, rawWpm: 0, accuracy: 100 };
    const totalChars = currentIndex + errors;
    const wpm = Math.round((currentIndex / 5) / elapsedMin);
    const rawWpm = Math.round((totalChars / 5) / elapsedMin);
    const accuracy = totalChars > 0 ? Math.round((currentIndex / totalChars) * 100) : 100;
    return { wpm, rawWpm, accuracy };
  }, []);

  // Timer tick
  const tick = useCallback(() => {
    setState((prev) => {
      if (!prev.isRunning) return prev;
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const timeLeft = Math.max(0, duration - elapsed);

      if (timeLeft <= 0) {
        // Finished — calculate final stats
        const stats = calcStats(Date.now(), prev.currentIndex, prev.errors);
        const final: TypingState = {
          ...prev,
          ...stats,
          timeLeft: 0,
          isRunning: false,
          isFinished: true,
        };
        onFinishRef.current?.(final);
        return final;
      }

      const stats = calcStats(Date.now(), prev.currentIndex, prev.errors);
      return { ...prev, ...stats, timeLeft: Math.ceil(timeLeft) };
    });
  }, [duration, calcStats]);

  // Start timer on first keystroke
  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(tick, 100);
  }, [tick]);

  // Stop timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Handle keydown
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (state.isFinished) return;

      // Ignore modifier-only keys
      if (e.key.length > 1 && e.key !== "Backspace") return;

      // Start on first valid keystroke
      if (!state.isRunning && e.key.length === 1) {
        setState((prev) => ({ ...prev, isRunning: true }));
        startTimer();
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setState((prev) => {
          if (prev.currentIndex === 0) return prev;
          return {
            ...prev,
            typed: prev.typed.slice(0, -1),
            currentIndex: prev.currentIndex - 1,
          };
        });
        return;
      }

      // Regular character
      if (e.key.length !== 1) return;
      e.preventDefault();

      setState((prev) => {
        const expected = text[prev.currentIndex] ?? "";
        const isCorrect = e.key === expected;

        return {
          ...prev,
          typed: prev.typed + e.key,
          currentIndex: prev.currentIndex + 1,
          errors: prev.errors + (isCorrect ? 0 : 1),
        };
      });
    },
    [state.isFinished, state.isRunning, startTimer, text],
  );

  // Attach/detach keyboard listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      stopTimer();
    };
  }, [handleKeyDown, stopTimer]);

  // Reset
  const reset = useCallback(() => {
    stopTimer();
    setState({
      typed: "",
      currentIndex: 0,
      errors: 0,
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      consistency: 100,
      timeLeft: duration,
      isRunning: false,
      isFinished: false,
    });
  }, [duration, stopTimer]);

  return { state, reset };
}

/** Generate a string of random words */
export function generateText(words: string[], count: number): string {
  const picked: string[] = [];
  for (let i = 0; i < count; i++) {
    picked.push(words[Math.floor(Math.random() * words.length)]);
  }
  return picked.join(" ");
}
