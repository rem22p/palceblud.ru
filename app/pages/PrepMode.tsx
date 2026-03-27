import { useState, useEffect, useMemo, useRef } from "react";
import { useTyping, TypingDisplay } from "../components/TypingCore";
import { Lock, Keyboard as KeyboardIcon, CheckCircle, HelpCircle, X } from "lucide-react";
import { useSettingsStore } from "../features/settings/store/settingsStore";

// --- КОНФИГУРАЦИЯ ---
const ACCENT_COLOR = "#0A5F38"; 
const ACCENT_LIGHT = "#4ade80"; 
const ACCENT_DIM = "rgba(10, 95, 56, 0.6)";

const STAGE_COMPLETED = "#34d399";
const STAGE_CURRENT = "#065f46";
const STAGE_LINE = "#34d399";

const PANEL_BG = "rgba(10, 95, 56, 0.15)"; 
const PANEL_BORDER = "rgba(74, 222, 128, 0.3)"; 
const TEXT_MAIN = "#e0e0e0"; 
const TEXT_LABEL = "rgba(224, 224, 224, 0.8)"; 
const KEY_INACTIVE_BG = "rgba(255,255,255,0.08)"; 
const KEY_INACTIVE_TEXT = "#555";

const KEY_PROGRESSION = [
  "E", "T", "O", "A", "H", "I", "N", "S", "R", "L",
  "D", "C", "U", "M", "W", "F", "G", "Y", "P", "B",
  "V", "K", "X", "J", "Q", "Z"
];

const LESSONS_PER_LEVEL = 5;
const WORDS_PER_LESSON = 25;

const KEYBOARD_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

// --- БАЗА СЛОВ (500+) ---
const REAL_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so",
  "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people",
  "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "is",
  "eye", "hand", "high", "such", "before", "must", "own", "right", "same", "tell", "does", "set", "three", "put", "try", "let", "may", "down", "keep", "few",
  "state", "very", "still", "long", "made", "find", "head", "stand", "page", "should", "country", "found", "answer", "school", "grow", "study", "learn", "plant", "cover",
  "food", "sun", "four", "between", "city", "tree", "cross", "farm", "hard", "start", "might", "story", "saw", "far", "sea", "draw", "left", "late", "run", "while",
  "press", "close", "night", "real", "life", "north", "book", "carry", "took", "science", "eat", "room", "friend", "began", "idea", "fish", "mountain", "stop", "once", "base",
  "hear", "horse", "cut", "sure", "watch", "color", "face", "wood", "main", "open", "seem", "together", "next", "white", "children", "begin", "got", "walk", "example", "ease",
  "paper", "group", "always", "music", "those", "both", "mark", "often", "letter", "until", "mile", "river", "car", "feet", "care", "second", "enough", "plain", "girl", "usual",
  "young", "ready", "above", "ever", "red", "list", "though", "feel", "talk", "bird", "soon", "body", "dog", "family", "direct", "pose", "leave", "song", "measure", "door",
  "product", "black", "short", "numeral", "class", "wind", "question", "happen", "complete", "ship", "area", "half", "rock", "order", "fire", "south", "problem", "piece", "told", "knew",
  "pass", "since", "top", "whole", "king", "street", "inch", "multiply", "nothing", "course", "stay", "wheel", "full", "force", "blue", "object", "decide", "surface", "deep", "moon",
  "island", "foot", "system", "busy", "test", "record", "boat", "common", "gold", "possible", "plane", "stead", "dry", "wonder", "laugh", "thousand", "ago", "ran", "check", "game",
  "shape", "equate", "hot", "miss", "brought", "heat", "snow", "tire", "bring", "yes", "distant", "fill", "east", "paint", "language", "among", "unit", "power", "town", "fine",
  "certain", "fly", "fall", "lead", "cry", "dark", "machine", "note", "wait", "plan", "figure", "star", "box", "noun", "field", "rest", "correct", "able", "pound", "done",
  "beauty", "drive", "stood", "contain", "front", "teach", "week", "final", "gave", "green", "oh", "quick", "develop", "ocean", "warm", "free", "minute", "strong", "special", "mind",
  "behind", "clear", "tail", "produce", "fact", "space", "heard", "best", "hour", "better", "true", "during", "hundred", "five", "remember", "step", "early", "hold", "west", "ground",
  "interest", "reach", "fast", "verb", "sing", "listen", "six", "table", "travel", "less", "morning", "ten", "simple", "several", "vowel", "toward", "war", "lay", "against", "pattern",
  "slow", "center", "love", "person", "money", "serve", "appear", "road", "map", "rain", "rule", "govern", "pull", "cold", "notice", "voice", "energy", "hunt", "probable", "bed",
  "brother", "egg", "ride", "cell", "believe", "perhaps", "pick", "sudden", "count", "square", "reason", "length", "represent", "art", "subject", "region", "size", "vary", "settle", "speak",
  "weight", "general", "ice", "matter", "circle", "pair", "include", "divide", "syllable", "felt", "grand", "ball", "yet", "wave", "drop", "heart", "am", "present", "heavy", "dance",
  "engine", "position", "arm", "wide", "sail", "material", "fraction", "forest", "sit", "race", "window", "store", "summer", "train", "sleep", "prove", "lone", "leg", "exercise", "wall",
  "catch", "mount", "wish", "sky", "board", "joy", "winter", "sat", "written", "wild", "instrument", "kept", "glass", "grass", "cow", "job", "edge", "sign", "visit", "past",
  "soft", "fun", "bright", "gas", "weather", "month", "million", "bear", "finish", "happy", "hope", "flower", "clothe", "strange", "gone", "trade", "melody", "trip", "office", "receive",
  "row", "mouth", "exact", "symbol", "die", "least", "trouble", "shout", "except", "wrote", "seed", "tone", "join", "suggest", "clean", "break", "lady", "yard", "rise", "bad",
  "blow", "oil", "blood", "touch", "grew", "cent", "mix", "team", "wire", "cost", "lost", "brown", "wear", "garden", "equal", "sent", "choose", "fell", "fit", "flow",
  "fair", "bank", "collect", "save", "control", "decimal", "ear", "else", "quite", "broke", "case", "middle", "kill", "son", "lake", "moment", "scale", "loud", "spring", "observe",
  "child", "straight", "consonant", "nation", "dictionary", "milk", "speed", "method", "organ", "pay", "age", "section", "dress", "cloud", "surprise", "quiet", "stone", "tiny", "climb", "cool",
  "design", "poor", "lot", "experiment", "bottom", "key", "iron", "single", "stick", "flat", "twenty", "skin", "smile", "crease", "hole", "jump", "baby", "eight", "village", "meet",
  "root", "buy", "raise", "solve", "metal", "whether", "push", "seven", "paragraph", "third", "shall", "held", "hair", "describe", "cook", "floor", "either", "result", "burn", "hill",
  "safe", "cat", "century", "consider", "type", "law", "bit", "coast", "copy", "phrase", "silent", "tall", "sand", "soil", "roll", "temperature", "finger", "industry", "value", "fight",
  "lie", "beat", "excite", "natural", "view", "sense", "capital", "won't", "chair", "danger", "fruit", "rich", "thick", "soldier", "process", "operate", "practice", "separate", "difficult", "doctor",
  "please", "protect", "noon", "crop", "modern", "element", "hit", "student", "corner", "party", "supply", "whose", "locate", "ring", "character", "insect", "caught", "period", "indicating", "radio",
  "spoke", "atom", "human", "history", "effect", "electric", "expect", "bone", "rail", "imagine", "provide", "agree", "thus", "gentle", "woman", "captain", "guess", "necessary", "sharp", "wing",
  "create", "neighbor", "wash", "bat", "rather", "crowd", "corn", "compare", "poem", "string", "bell", "depend", "meat", "rub", "tube", "famous", "dollar", "stream", "fear", "sight",
  "thin", "triangle", "planet", "hurry", "chief", "colony", "clock", "mine", "tie", "enter", "major", "fresh", "search", "send", "yellow", "gun", "allow", "print", "dead", "spot",
  "desert", "suit", "current", "lift", "rose", "arrive", "master", "track", "parent", "shore", "division", "sheet", "substance", "favor", "connect", "post", "spend", "chord", "fat", "glad",
  "original", "share", "station", "dad", "bread", "charge", "proper", "bar", "offer", "segment", "slave", "duck", "instant", "market", "degree", "populate", "chick", "dear", "enemy", "reply",
  "drink", "occur", "support", "speech", "nature", "range", "steam", "motion", "path", "liquid", "log", "meant", "quotient", "teeth", "shell", "neck", "oxygen", "sugar", "death", "pretty",
  "skill", "women", "season", "solution", "magnet", "silver", "thank", "branch", "match", "suffix", "especially", "fig", "afraid", "huge", "sister", "steel", "discuss", "forward", "similar", "guide",
  "experience", "score", "apple", "bought", "led", "pitch", "coat", "mass", "card", "band", "rope", "slip", "win", "dream", "evening", "condition", "feed", "tool", "total", "basic",
  "smell", "valley", "nor", "double", "seat", "continue", "block", "chart", "hat", "sell", "success", "company", "subtract", "event", "particular", "deal", "swim", "term", "opposite", "wife",
  "shoe", "shoulder", "spread", "arrange", "camp", "invent", "cotton", "born", "determine", "quart", "nine", "truck", "noise", "level", "chance", "gather", "shop", "stretch", "throw", "shine",
  "property", "column", "molecule", "select", "wrong", "gray", "repeat", "require", "broad", "prepare", "salt", "nose", "plural", "anger", "claim", "continent"
];

const canTypeWord = (word: string, allowedKeys: string[]) => {
  const allowedSet = new Set(allowedKeys.map(k => k.toLowerCase()));
  return word.split('').every(char => allowedSet.has(char.toLowerCase()));
};

function generateRealLessonText(availableKeys: string[], wordCount: number): string {
  const possibleWords = REAL_WORDS.filter(w => canTypeWord(w, availableKeys));
  if (possibleWords.length === 0) return "wait";
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    const randomWord = possibleWords[Math.floor(Math.random() * possibleWords.length)];
    words.push(randomWord);
  }
  return words.join(" ");
}

// --- ПРАВАЯ ПАНЕЛЬ ---
function PrepRightPanel({ unlockedCount, nextKey, activeKeyRef, style }: { unlockedCount: number, nextKey: string | undefined, activeKeyRef: React.MutableRefObject<string | null>, style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "fixed", top: "80px", right: "clamp(20px, 5vw, 80px)", zIndex: 10,
      backgroundColor: PANEL_BG, border: `1px solid ${PANEL_BORDER}`, borderRadius: "14px",
      padding: "12px 16px", width: "220px", display: "flex", flexDirection: "column", gap: "10px",
      ...style
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <KeyboardIcon size={12} color={ACCENT_LIGHT} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: ACCENT_LIGHT, letterSpacing: "0.12em", textTransform: "uppercase" }}>Прогресс</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.55rem", color: TEXT_LABEL, textTransform: "uppercase", marginBottom: "2px" }}>Открыто</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", color: ACCENT_LIGHT, fontWeight: 700 }}>
            {unlockedCount} <span style={{fontSize: "0.75rem", color: TEXT_LABEL}}>/ {KEY_PROGRESSION.length}</span>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "0.55rem", color: TEXT_LABEL, textTransform: "uppercase", marginBottom: "2px" }}>След.</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "4px", color: nextKey ? ACCENT_LIGHT : KEY_INACTIVE_TEXT, fontWeight: 700, fontSize: "1.1rem" }}>
            {nextKey || "—"}
            {nextKey && <Lock size={10} style={{ opacity: 0.7 }} />}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "2px" }}>
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} style={{ display: "flex", justifyContent: "center", gap: "3px" }}>
            {row.map((key) => {
              const upperKey = key.toUpperCase();
              const indexInProgress = KEY_PROGRESSION.indexOf(upperKey);
              const isPressed = activeKeyRef.current === key;
              let bgColor = KEY_INACTIVE_BG, textColor = KEY_INACTIVE_TEXT, borderColor = "transparent", showLock = true, opacity = 0.6, transform = "scale(1)", boxShadow = "none";
              if (indexInProgress !== -1) {
                if (indexInProgress < unlockedCount) { bgColor = ACCENT_COLOR; textColor = "#fff"; borderColor = "transparent"; showLock = false; opacity = 1; }
                else { showLock = true; opacity = 0.6; }
              }
              if (isPressed) { bgColor = "#4ade80"; textColor = "#022c22"; borderColor = "#4ade80"; opacity = 1; transform = "scale(1.2)"; boxShadow = "0 0 15px #4ade80"; showLock = false; }
              return (
                <div key={key} style={{ width: "16px", height: "18px", backgroundColor: bgColor, border: `1px solid ${borderColor}`, borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", opacity, transform, boxShadow, transition: "all 0.15s ease-out" }}>
                  {!showLock && <span style={{ fontSize: "0.6rem", color: textColor, fontWeight: "bold" }}>{key}</span>}
                  {showLock && <Lock size={5} color={KEY_INACTIVE_TEXT} />}
                </div>
              );
            })}
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "4px" }}>
          {(() => {
            const key = "space";
            const isPressed = activeKeyRef.current === key;
            let bgColor = ACCENT_COLOR, opacity = 0.3, transform = "scale(1)", boxShadow = "none";
            if (isPressed) { bgColor = "#4ade80"; opacity = 1; transform = "scale(1.05, 0.9)"; boxShadow = "0 0 15px #4ade80"; }
            return <div style={{ width: "60%", height: "14px", backgroundColor: bgColor, borderRadius: "3px", opacity, transform, boxShadow, transition: "all 0.15s ease-out" }} />;
          })()}
        </div>
      </div>
    </div>
  );
}

function ProgressSteps({ streak, onShowHelp, onNextKey: _onNextKey, currentWpm: _currentWpm, style }: any) {
  return (
    <div style={{ position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", zIndex: 20, ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(52, 211, 153, 0.6)", letterSpacing: "0.1em" }}>ДО ОТКРЫТИЯ НОВОЙ БУКВЫ</div>
        <div onClick={onShowHelp} style={{ marginLeft: "6px", cursor: "pointer", transition: "transform 0.2s", display: "flex", alignItems: "center", color: STAGE_COMPLETED }} onMouseEnter={(e: any) => e.currentTarget.style.transform = "scale(1.1)"} onMouseLeave={(e: any) => e.currentTarget.style.transform = "scale(1)"}><HelpCircle size={18} /></div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {Array.from({ length: LESSONS_PER_LEVEL }).map((_, i) => {
          const isCompleted = i < streak;
          const isCurrent = i === streak;
          const bgColor = isCompleted ? STAGE_COMPLETED : (isCurrent ? STAGE_CURRENT : "rgba(255,255,255,0.06)");
          const borderColor = isCurrent ? STAGE_CURRENT : "transparent";
          return (
            <div key={i} style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: bgColor, border: `2px solid ${borderColor}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.25s ease", boxShadow: isCurrent ? `0 0 10px ${STAGE_CURRENT}60` : "none" }}>
                {isCompleted ? <CheckCircle size={14} color="#111" strokeWidth={3} /> : isCurrent ? <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#fff", fontWeight: 700 }}>{i + 1}</span> : <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.1)" }} />}
              </div>
              {i < LESSONS_PER_LEVEL - 1 && <div style={{ width: "20px", height: "2px", backgroundColor: isCompleted ? STAGE_LINE : "rgba(255,255,255,0.07)", transition: "background-color 0.3s" }} />}
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(52, 211, 153, 0.6)", letterSpacing: "0.05em", textAlign: "center" }}>ЦЕЛЬ: 130 CPM</div>
    </div>
  );
}

function HelpModal({ isOpen, onClose, nextKey, currentWpm: _currentWpm }: any) {
  if (!isOpen) return null;
  const themeColor = STAGE_COMPLETED;
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 90, cursor: "pointer" }} />
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 100, backgroundColor: "#2b2d31", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", width: "90%", maxWidth: "400px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", fontFamily: "'JetBrains Mono', monospace", animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.1rem", color: "#e0e0e0", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}><HelpCircle size={20} color={themeColor} />Условия раздела</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: "4px" }} onMouseEnter={(e: any) => e.currentTarget.style.color = "#fff"} onMouseLeave={(e: any) => e.currentTarget.style.color = "#666"}><X size={20} /></button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "0.85rem", color: "#aaa", lineHeight: 1.6, marginBottom: "16px" }}>Чтобы открыть следующую букву, необходимо пройти <strong>5 уроков</strong> со скоростью ≥ 130 CPM (символов в мин.) и точностью ≥ 95%.</p>
          <div style={{ backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontSize: "0.75rem", color: "#888", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.1em" }}>Требования к уроку:</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Скорость (CPM)</span>
              <span style={{ fontSize: "0.9rem", color: themeColor, fontWeight: "bold" }}>≥ 130</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "#e0e0e0" }}>Точность</span>
              <span style={{ fontSize: "0.9rem", color: themeColor, fontWeight: "bold" }}>≥ 95%</span>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#666" }}>Следующая буква: <span style={{ color: ACCENT_LIGHT, fontWeight: "bold" }}>{nextKey || "Все открыто"}</span></div>
      </div>
      <style>{`@keyframes slideUp { from { transform: translate(-50%, -40%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }`}</style>
    </>
  );
}

const PREP_PROGRESS_KEY = "palceblud_prep_progress";

export function PrepMode() {
  // Загружаем прогресс из localStorage
  const [unlockedCount, setUnlockedCount] = useState<number>(() => {
    const saved = localStorage.getItem(PREP_PROGRESS_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return data.unlockedCount ?? 5;
    }
    return 5;
  });

  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem(PREP_PROGRESS_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return data.streak ?? 0;
    }
    return 0;
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showAllKeysComplete, setShowAllKeysComplete] = useState(false);
  const fontSize = useSettingsStore((state) => state.fontSize);

  const activeKeyRef = useRef<string | null>(null);
  const [, setTick] = useState(0);
  const hasProcessedFinish = useRef<boolean>(false);
  const [retryCount, setRetryCount] = useState(0);

  const currentKeys = useMemo(() => KEY_PROGRESSION.slice(0, unlockedCount), [unlockedCount]);
  const nextKey = KEY_PROGRESSION[unlockedCount];
  const lessonText = useMemo(() => generateRealLessonText(currentKeys, WORDS_PER_LESSON), [currentKeys, streak, retryCount]);

  // Получаем данные из хука.
  // ВАЖНО: wpm в нашем хуке уже рассчитан как CPM (Chars Per Minute).
  const { typed, wpm, accuracy, isActive, isFinished, isPaused, togglePause, handleType, reset } = useTyping(lessonText, { mode: "words", wordLimit: WORDS_PER_LESSON });

  // Живая статистика для обновления в реальном времени
  const [liveCpm, setLiveCpm] = useState(0);
  const [liveAcc, setLiveAcc] = useState(100);
  const startTimeRef = useRef<number | null>(null);
  
  // Обновляем live-статистику во время печати
  useEffect(() => {
    if (!isActive || isPaused || isFinished || typed.length === 0) {
      setLiveCpm(0);
      setLiveAcc(100);
      startTimeRef.current = null;
      return;
    }
    
    // Инициализируем startTime при начале печати
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    
    const interval = setInterval(() => {
      const elapsedMin = (Date.now() - startTimeRef.current!) / 60000;
      if (elapsedMin > 0.008) {
        const cpm = Math.round(typed.length / elapsedMin);
        
        let correct = 0;
        for (let i = 0; i < typed.length; i++) {
          if (typed[i] === lessonText[i]) correct++;
        }
        const acc = Math.round((correct / typed.length) * 100);
        
        // Плавное обновление - усредняем с предыдущим значением
        setLiveCpm(prev => Math.round(prev * 0.6 + Math.min(cpm, 600) * 0.4));
        setLiveAcc(prev => Math.round(prev * 0.6 + acc * 0.4));
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, isFinished, typed.length, lessonText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length > 1 && e.key !== " ") return;
      const key = e.key.toLowerCase();
      if ((key >= 'а' && key <= 'я') || (key >= 'a' && key <= 'z') || key === ' ') {
        const visualKey = key === ' ' ? 'space' : key;
        activeKeyRef.current = visualKey;
        setTick(prev => prev + 1);
        setTimeout(() => {
          activeKeyRef.current = null;
          setTick(prev => prev + 1);
        }, 300);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  // --- ЛОГИКА ПЕРЕХОДА ЭТАПОВ ---
  useEffect(() => {
    if (isFinished && !hasProcessedFinish.current) {
      hasProcessedFinish.current = true;

      // Условия: 150 CPM и 95% точности
      const targetCpm = 150;
      const targetAccuracy = 95;
      const currentCpm = wpm; // Это уже символы в минуту
      const isGoodAccuracy = accuracy >= targetAccuracy;
      const isFastEnough = currentCpm >= targetCpm;

      if (isGoodAccuracy && isFastEnough) {
        // УСПЕХ
        const newStreak = streak + 1;

        if (newStreak >= LESSONS_PER_LEVEL && unlockedCount < KEY_PROGRESSION.length) {
          // ОТКРЫВАЕМ НОВУЮ БУКВУ
          setNotification(`Открыта новая буква: ${nextKey}!`);
          setTimeout(() => setNotification(null), 4000);

          setUnlockedCount(prev => prev + 1);
          setStreak(0);

          // Проверяем, была ли это последняя буква
          if (unlockedCount + 1 >= KEY_PROGRESSION.length) {
            setShowAllKeysComplete(true);
          }

          setTimeout(() => {
            hasProcessedFinish.current = false;
            reset();
          }, 0);
        } else {
          // СЛЕДУЮЩИЙ УРОК
          setStreak(newStreak);
          setTimeout(() => {
            hasProcessedFinish.current = false;
            reset();
          }, 0);
        }
      } else {
        // НЕУДАЧА (перезапуск этапа с новыми словами и блюром)
        setRetryCount(prev => prev + 1); // Генерируем новый текст
        hasProcessedFinish.current = false;
        reset();
      }
    }

    if (!isFinished) {
      hasProcessedFinish.current = false;
    }
  }, [isFinished, wpm, accuracy, streak, unlockedCount, nextKey, reset]);

  // Сохраняем прогресс в localStorage
  useEffect(() => {
    localStorage.setItem(PREP_PROGRESS_KEY, JSON.stringify({ unlockedCount, streak }));
  }, [unlockedCount, streak]);

  return (
    <>
      <div style={{ minHeight: "100vh", backgroundColor: "#2b2d31", color: "#e0e0e0", fontFamily: "'JetBrains Mono', monospace", position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "40px" }}>
      <style>{`
        .page-transition button[onclick*="onReset"] { 
          background: ${ACCENT_COLOR} !important; 
          border: 1px solid ${ACCENT_LIGHT} !important; 
          color: #fff !important; 
          transition: all 0.2s !important;
        }
        .page-transition button[onclick*="onReset"]:hover { 
          background: ${ACCENT_LIGHT} !important; 
          color: #000 !important; 
        }
      `}</style>

      {/* Статистика */}
      <div style={{ position: "fixed", top: "100px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", opacity: (!isFinished && typed.length === 0) ? 0.5 : 1, transition: "opacity 0.4s" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "5rem", fontWeight: 200, color: liveCpm > 0 ? ACCENT_LIGHT : ACCENT_DIM, lineHeight: 1, letterSpacing: "-0.04em" }}>{liveCpm}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: ACCENT_DIM, letterSpacing: "0.2em", textTransform: "uppercase" }}>CPM</span>
        </div>
      </div>
      <div style={{ position: "fixed", top: "215px", left: "80px", zIndex: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "2px", opacity: (!isFinished && typed.length === 0) ? 0.5 : 1, transition: "opacity 0.4s" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "3.2rem", fontWeight: 200, color: liveAcc === 100 ? ACCENT_LIGHT : liveAcc >= 90 ? TEXT_MAIN : ACCENT_COLOR, lineHeight: 1, letterSpacing: "-0.04em" }}>{liveAcc}%</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(224,224,224,0.5)", letterSpacing: "0.2em", textTransform: "uppercase" }}>точн</span>
        </div>
      </div>

      <PrepRightPanel unlockedCount={unlockedCount} nextKey={nextKey} activeKeyRef={activeKeyRef} />
      <ProgressSteps streak={streak} onNextKey={nextKey} onShowHelp={() => setIsHelpOpen(true)} currentWpm={wpm} style={{ opacity: isActive && !isFinished ? 0 : 1, transition: "opacity 0.3s ease" }} />
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} nextKey={nextKey} currentWpm={wpm} />

      <div style={{ width: "1000px", margin: "0 auto", padding: "0", opacity: 1, transition: "opacity 0.3s ease" }}>
        {notification && (
          <div style={{ position: "fixed", top: "180px", left: "50%", marginLeft: "-150px", padding: "10px 20px", backgroundColor: "rgba(10, 95, 56, 0.3)", color: ACCENT_LIGHT, border: `1px solid ${ACCENT_LIGHT}`, borderRadius: "10px", fontWeight: "bold", textAlign: "center", animation: "fadeIn 0.3s ease", zIndex: 50, width: "300px" }}>
            🎉 {notification}
          </div>
        )}
        <TypingDisplay
          text={lessonText} typed={typed} onType={handleType} onReset={reset}
          colors={{ correct: "#e0e0e0", error: "#ca4754", untyped: "rgba(255,255,255,0.1)", cursor: ACCENT_LIGHT, errorBg: "rgba(239, 68, 68, 0.1)" }}
          isFinished={isFinished}
          wpm={wpm} accuracy={accuracy}
          fontSize={`${fontSize}px`}
          lineHeight={`${fontSize + 32}px`}
          isPaused={isPaused}
          togglePause={togglePause}
          mode="words"
          width="1000px"
          paddingRight={80}
        />
      </div>
      
      {isFinished ? (
        <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap" }}>tab — заново</div>
      ) : (
        <div style={{ position: "fixed", bottom: "16px", left: "50%", transform: "translateX(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: isActive ? "rgba(255,255,255,0.8)" : "rgba(224,224,224,0.1)", letterSpacing: "0.15em", whiteSpace: "nowrap", textShadow: isActive ? "0 0 10px rgba(255,255,255,0.5)" : "none", transition: "all 0.3s ease" }}>tab — заново &nbsp;·&nbsp; esc — пауза</div>
      )}

      {/* Модальное окно - все буквы открыты */}
      {showAllKeysComplete && (
        <>
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", zIndex: 300 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", marginLeft: "-225px", marginTop: "-180px", zIndex: 301, backgroundColor: "#1e2028", border: `2px solid ${ACCENT_LIGHT}`, borderRadius: "20px", padding: "48px 64px", minWidth: "450px", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🏆</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.8rem", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>Поздравляем!</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "rgba(224,224,224,0.6)", marginBottom: "32px", lineHeight: 1.6 }}>
              Вы открыли все буквы!<br/>
              Теперь продолжайте практиковаться, чтобы достичь скорости 150+ CPM
            </div>
            <button
              onClick={() => setShowAllKeysComplete(false)}
              style={{
                background: `linear-gradient(135deg, ${ACCENT_COLOR}, ${ACCENT_LIGHT})`,
                border: "none",
                borderRadius: "12px",
                padding: "16px 48px",
                color: "#111",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.95rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 4px 20px rgba(74, 222, 128, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 30px rgba(74, 222, 128, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(74, 222, 128, 0.3)";
              }}
            >
              ПРОДОЛЖИТЬ
            </button>
          </div>
        </>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
    </>
  );
}