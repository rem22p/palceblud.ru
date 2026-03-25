// Генерация звуков клавиш через Web Audio API

class KeyboardSound {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.5;
  private enabled: boolean = false;

  constructor() {
    // AudioContext создаётся при первом взаимодействии пользователя
  }

  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (enabled && !this.audioContext) {
      this.init();
    }
  }

  play(type: 'keypress' | 'error' | 'complete' = 'keypress') {
    if (!this.enabled || !this.audioContext) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    switch (type) {
      case 'keypress':
        // Короткий тихий клик (механическая клавиатура)
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.03);
        gainNode.gain.setValueAtTime(this.volume * 0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
        oscillator.start(now);
        oscillator.stop(now + 0.03);
        break;

      case 'error':
        // Низкий тон для ошибки
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.1);
        gainNode.gain.setValueAtTime(this.volume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
        break;

      case 'complete':
        // Приятный аккорд для завершения
        this.playCompleteChord(now);
        break;
    }
  }

  private playCompleteChord(now: number) {
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (мажорное трезвучие)
    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator();
      const gainNode = this.audioContext!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext!.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, now + i * 0.05);
      gainNode.gain.setValueAtTime(this.volume * 0.2, now + i * 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.3);

      oscillator.start(now + i * 0.05);
      oscillator.stop(now + i * 0.05 + 0.3);
    });
  }
}

export const keyboardSound = new KeyboardSound();
