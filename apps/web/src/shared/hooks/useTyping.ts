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
  duration?: number; // seconds; undefined = no timer
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
    timeLeft: duration ?? 99999,
    isRunning: false,
    isFinished: false,
  });

  // Refs
  const isFinishedRef = useRef(false);
  const isRunningRef = useRef(false);
  const textRef = useRef(text);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onFinishRef = useRef(onFinish);

  // Sync refs
  useEffect(() => { isFinishedRef.current = state.isFinished; }, [state.isFinished]);
  useEffect(() => { isRunningRef.current = state.isRunning; }, [state.isRunning]);
  useEffect(() => { textRef.current = text; }, [text]);
  useEffect(() => { onFinishRef.current = onFinish; });

  // ─── Timer tick (timer modes only) ───
  const tick = useCallback(() => {
    if (duration == null) return;
    const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
    const remaining = Math.max(0, Math.ceil(duration - elapsedSec));

    setState((prev) => {
      if (remaining <= 0) {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        const final: TypingState = { ...prev, timeLeft: 0, isRunning: false, isFinished: true };
        setTimeout(() => onFinishRef.current?.(final), 0);
        return final;
      }
      return { ...prev, timeLeft: remaining };
    });
  }, [duration]);

  // ─── Calculate stats helper (used on every keystroke) ───
  const calcLiveStats = useCallback((correctChars: number, totalChars: number) => {
    const elapsedMs = Date.now() - startTimeRef.current;
    return {
      wpm: calcWpm(correctChars, elapsedMs),
      rawWpm: calcWpm(totalChars, elapsedMs),
      accuracy: calcAccuracy(correctChars, totalChars),
    };
  }, []);

  // ─── Handle keydown ───
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFinishedRef.current) return;
    if (e.key.length > 1 && e.key !== "Backspace") return;

    // Start on first keystroke
    if (!isRunningRef.current && e.key.length === 1) {
      isRunningRef.current = true;
      startTimeRef.current = Date.now();
      if (duration != null) {
        timerRef.current = setInterval(tick, 100);
      }
    }

    e.preventDefault();

    setState((prev) => {
      const { typed, isCorrect, isComplete } = processKeystroke(
        prev.typed, textRef.current, e.key,
      );

      const newErrors = prev.errors + (isCorrect ? 0 : 1);
      const newCurrentIndex = typed.length;
      const correctChars = newCurrentIndex - newErrors;

      // Calculate live stats
      const stats = calcLiveStats(correctChars, newCurrentIndex);

      // Stop timer on complete
      if (isComplete && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      return {
        ...prev,
        typed,
        currentIndex: newCurrentIndex,
        errors: newErrors,
        wpm: stats.wpm,
        rawWpm: stats.rawWpm,
        accuracy: stats.accuracy,
        isRunning: true,
        isFinished: isComplete,
      };
    });
  }, [tick, calcLiveStats, duration]);

  // ─── Keyboard listener ───
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [handleKeyDown]);

  // ─── Reset ───
  const reset = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    isFinishedRef.current = false;
    isRunningRef.current = false;
    startTimeRef.current = 0;
    setState({
      typed: "", currentIndex: 0, errors: 0,
      wpm: 0, rawWpm: 0, accuracy: 100, consistency: 100,
      timeLeft: duration ?? 99999,
      isRunning: false, isFinished: false,
    });
  }, [duration]);

  return { state, reset };
}

export { generateText } from "./typing-engine";
