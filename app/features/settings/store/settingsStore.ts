import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const FONTS = [
  "JetBrains Mono",
  "Cascadia Code",
  "Consolas",
  "Lucida Console",
  "Courier New",
];

const THEMES = [
  { name: "classic", label: "Classic", accent: "#e2b714" },
  { name: "ocean", label: "Ocean", accent: "#60a5fa" },
  { name: "forest", label: "Forest", accent: "#34d399" },
  { name: "rose", label: "Rose", accent: "#f472b6" },
  { name: "purple", label: "Purple", accent: "#a78bfa" },
  { name: "orange", label: "Orange", accent: "#fb923c" },
];

type CursorStyle = "line" | "block" | "underline";

interface SettingsState {
  fontSize: number;
  lineHeight: number;
  maxWidth: number;
  fontFamily: string;
  theme: string;
  accentColor: string;
  cursorStyle: CursorStyle;
  cursorBlink: boolean;
  soundEnabled: boolean;
  soundVolume: number;
  setFontSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setTheme: (theme: string, accent: string) => void;
  setAccentColor: (color: string) => void;
  setCursorStyle: (style: CursorStyle) => void;
  setCursorBlink: (blink: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      fontSize: 32,
      lineHeight: 64,
      maxWidth: 1200,
      fontFamily: "JetBrains Mono",
      theme: "ocean",
      accentColor: "#60a5fa",
      cursorStyle: "line",
      cursorBlink: true,
      soundEnabled: false,
      soundVolume: 0.5,
      setFontSize: (size) => set({ fontSize: size, lineHeight: size + 32 }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setTheme: (theme, accent) => set({ theme, accentColor: accent }),
      setAccentColor: (color) => set({ accentColor: color }),
      setCursorStyle: (style) => set({ cursorStyle: style }),
      setCursorBlink: (blink) => set({ cursorBlink: blink }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setSoundVolume: (volume) => set({ soundVolume: volume }),
    }),
    {
      name: 'palceblud-settings',
    }
  )
);

export { FONTS, THEMES };
export type { CursorStyle };
