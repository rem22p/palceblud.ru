import { useState, useEffect, useRef, useCallback } from "react";
import { processKeystroke, calcWpm, calcAccuracy, generateText } from "./typing-engine";

export interface TypingState {
  typed: string;
  currentIndex: number;
  errors: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  timeLeft: number;
  isRunning: boolean;
  isFinished: boolean;
}

interface TypingConfig {
  text: string;
  duration: number;
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

  // Refs to avoid stale closures in event handlers
  const isFinishedRef = useRef(false);
  const isRunningRef = useRef(false);
  const textRef = useRef(text);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onFinishRef = useRef(onFinish);

  // Keep refs in sync
  useEffect(() => {
    isFinishedRef.current = state.isFinished;
    isRunningRef.current = state.isRunning;
  }, [state.isFinished, state.isRunning]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    onFinishRef.current = onFinish;
  });

  // Build current state snapshot from refs + state
  const buildState = useCallback(
    (partial: Partial<TypingState>): TypingState => ({
      ...state,
      ...partial,
    }),
    [state],
  );

  // Timer tick — reads refs, updates state
  const tick = useCallback(() => {
    const now = Date.now();
    const elapsedMs = now - startTimeRef.current;
    const elapsedSec = elapsedMs / 1000;
    const remaining = Math.max(0, Math.ceil(duration - elapsedSec));

    setState((prev) => {
      const correct = prev.currentIndex;
      const total = correct + prev.errors;

      const wpm = calcWpm(correct, elapsedMs);
      const rawWpm = calcWpm(total, elapsedMs);
      const accuracy = calcAccuracy(correct, total);

      if (remaining <= 0) {
        // Finished
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        const final: TypingState = {
          ...prev,
          wpm,
          rawWpm,
          accuracy,
          timeLeft: 0,
          isRunning: false,
          isFinished: true,
        };
        // Fire onFinish asynchronously to avoid setState-in-setState
        setTimeout(() => onFinishRef.current?.(final), 0);
        return final;
      }

      return { ...prev, wpm, rawWpm, accuracy, timeLeft: remaining };
    });
  }, [duration]);

  // Start timer
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

  // Handle keydown — uses refs to avoid stale closures
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if finished
    if (isFinishedRef.current) return;

    // Ignore modifier-only keys (except Backspace)
    if (e.key.length > 1 && e.key !== "Backspace") return;

    // Start timer on first valid keystroke
    if (!isRunningRef.current && e.key.length === 1) {
      // Start timer via state update + ref
      setState((prev) => ({ ...prev, isRunning: true }));
      isRunningRef.current = true;
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(tick, 100);
    }

    e.preventDefault();

    setState((prev) => {
      const { typed, isCorrect, isComplete } = processKeystroke(
        prev.typed,
        textRef.current,
        e.key,
      );

      if (isComplete && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return {
        ...prev,
        typed,
        currentIndex: typed.length,
        errors: prev.errors + (isCorrect ? 0 : 1),
        isFinished: isComplete,
      };
    });
  }, [tick]);

  // Attach keyboard listener
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
    isFinishedRef.current = false;
    isRunningRef.current = false;
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

export { generateText } from "./typing-engine";
