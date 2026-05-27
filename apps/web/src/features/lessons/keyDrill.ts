// ─── Key Drill Engine (BlindTyping-inspired) ───

export interface KeyStat {
  speed: number;    // avg WPM for this key
  accuracy: number; // % correct (0-100)
  tests: number;    // how many test batches completed
  unlocked: boolean;
}

export type KeyStatsMap = Record<string, KeyStat>;

/** Initialize key stats. unlockedKeys are unlocked, rest are locked. */
export function initKeyStats(
  unlockedKeys: string[],
  allKeys?: string[],
): KeyStatsMap {
  const map: KeyStatsMap = {};
  const unlocked = new Set(unlockedKeys);
  const keys = allKeys ?? unlockedKeys;
  for (const key of keys) {
    map[key] = { speed: 0, accuracy: 100, tests: 0, unlocked: unlocked.has(key) };
  }
  return map;
}

/** Update stats for a single key after a test session. */
export function updateKeyStats(
  stats: KeyStatsMap,
  key: string,
  speed: number,
  accuracy: number,
): KeyStatsMap {
  const s = stats[key];
  if (!s) return stats;

  const newTests = s.tests + 1;
  const newSpeed =
    s.tests === 0 ? speed : (s.speed * s.tests + speed) / newTests;
  const newAccuracy =
    s.tests === 0 ? accuracy : Math.round((s.accuracy * s.tests + accuracy) / newTests);

  return {
    ...stats,
    [key]: { ...s, speed: newSpeed, accuracy: newAccuracy, tests: newTests },
  };
}

/** Find the weakest unlocked key (lowest accuracy, then lowest speed). */
export function getWeakestKey(stats: KeyStatsMap): string | null {
  let weakest: string | null = null;
  let minAccuracy = 101;
  let minSpeed = Infinity;

  for (const [key, s] of Object.entries(stats)) {
    if (!s.unlocked || s.tests === 0) continue;
    if (s.accuracy < minAccuracy || (s.accuracy === minAccuracy && s.speed < minSpeed)) {
      weakest = key;
      minAccuracy = s.accuracy;
      minSpeed = s.speed;
    }
  }

  return weakest;
}

/** Check if next key should be unlocked. All unlocked keys need 5+ tests at 100% accuracy. */
export function shouldUnlockNext(stats: KeyStatsMap): boolean {
  let hasUnlocked = false;
  let hasLocked = false;

  for (const s of Object.values(stats)) {
    if (s.unlocked) {
      hasUnlocked = true;
      if (s.tests < 5 || s.accuracy < 100) return false;
    } else {
      hasLocked = true;
    }
  }

  return hasUnlocked && hasLocked;
}

/** Unlock the next key from the full alphabet. Keys are unlocked in order. */
export function unlockNextKey(
  stats: KeyStatsMap,
  allKeys: string[],
): KeyStatsMap {
  const newStats = { ...stats };
  for (const key of allKeys) {
    if (!newStats[key]) {
      newStats[key] = { speed: 0, accuracy: 100, tests: 0, unlocked: true };
      return newStats;
    }
    if (newStats[key] && !newStats[key].unlocked) {
      newStats[key] = { ...newStats[key], unlocked: true };
      return newStats;
    }
  }
  return newStats;
}

/**
 * Generate practice words from the given alphabet.
 * If forcedKey is provided, it appears in every word.
 */
export function generateDrillWords(
  letters: string[],
  forcedKey: string | null,
  count: number,
): string[] {
  if (letters.length === 0) return [];
  if (letters.length === 1) return Array(count).fill(letters[0]);

  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = 2 + Math.floor(Math.random() * 4); // 2-5 chars
    let word = "";
    for (let j = 0; j < len; j++) {
      word += letters[Math.floor(Math.random() * letters.length)];
    }
    // Ensure forced key is present
    if (forcedKey && letters.includes(forcedKey) && !word.includes(forcedKey)) {
      const pos = Math.floor(Math.random() * word.length);
      word = word.slice(0, pos) + forcedKey + word.slice(pos + 1);
    }
    words.push(word);
  }

  return words;
}
