# пальцеблуд.рф — Клавиатурный тренажёр

## Обзор проекта

**пальцеблуд.рф** — это веб-приложение для обучения слепой печати и развития скорости набора текста. Проект предоставляет два основных режима:

1. **Practice Mode** — свободная практика с таймером (15s/30s/60s/120s)
2. **Learning Mode** — структурированные уроки от базовой раскладки до продвинутых техник

## Технологический стек

| Категория | Технология |
|-----------|------------|
| **Фреймворк** | React 19+ |
| **Язык** | TypeScript (TSX) |
| **Роутинг** | react-router-dom |
| **Стили** | Tailwind CSS v4 |
| **UI компоненты** | shadcn/ui (кастомизированные) |
| **Иконки** | lucide-react |
| **Шрифты** | JetBrains Mono, Inter |
| **Анимации** | CSS keyframes |

## Структура проекта

```
palceblud/
├── app/
│   ├── App.tsx                 # Корневой компонент
│   ├── routes.ts               # Конфигурация роутера
│   ├── components/
│   │   ├── ui/                 # shadcn/ui компоненты (40+ файлов)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   ├── Header.tsx          # Шапка с навигацией
│   │   ├── Footer.tsx          # Подвал
│   │   ├── ModeHeader.tsx      # Заголовок режима
│   │   ├── ZoneSelector.tsx    # Выбор режима (Learning/Sharpening)
│   │   ├── TypingCore.tsx      # Хук useTyping + компонент TypingDisplay
│   │   ├── TypingInterface.tsx # Интерфейс ввода
│   │   ├── SettingsPanel.tsx   # Панель настроек
│   │   ├── StatsBar.tsx        # Панель статистики
│   │   ├── ProfileStats.tsx    # Статистика профиля
│   │   └── ...
│   └── pages/
│       ├── PracticeMode.tsx    # Страница практики
│       └── LearningMode.tsx    # Страница обучения
├── styles/
│   ├── tailwind.css            # Конфигурация Tailwind v4
│   ├── theme.css               # CSS переменные темы (light/dark)
│   ├── fonts.css               # Подключение шрифтов
│   └── index.css               # Основные стили
└── src.zip                     # Исходный архив
```

## Ключевые компоненты

### TypingCore.tsx
Центральная логика печати:
- `useTyping()` — хук для управления состоянием набора (WPM, точность, таймер)
- `TypingDisplay` — компонент отображения текста с подсветкой ошибок

### PracticeMode.tsx
- Генерация случайных слов из WORD_POOL
- Плавающие статистические индикаторы (WPM, accuracy, timer)
- Результат overlay с детальной статистикой

### LearningMode.tsx
- 6 уроков с прогрессией сложности
- Step indicator для навигации между уроками
- Sidebar с прогрессом и подсказками

## Темизация

Проект использует CSS переменные для поддержки светлой/тёмной темы:

```css
/* Основные цвета (dark mode) */
--background: oklch(0.145 0 0);
--foreground: oklch(0.985 0 0);
--primary: oklch(0.985 0 0);
--accent: #e2b714;  /* Золотой акцент */
```

## Сборка и запуск

> ⚠️ **Примечание:** В проекте отсутствуют конфигурационные файлы (`package.json`, `vite.config.ts`, `tsconfig.json`). Для запуска необходимо создать базовую настройку Vite + React.

### Рекомендуемые шаги для инициализации:

```bash
# 1. Инициализация проекта
npm create vite@latest . -- --template react-ts

# 2. Установка зависимостей
npm install react-router-dom lucide-react class-variance-authority tailwind-merge clsx

# 3. Установка Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# 4. Запуск dev-сервера
npm run dev
```

### Конфигурация Tailwind v4 (`vite.config.ts`):

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

## Стилистические особенности

- **Шрифты:** JetBrains Mono для моноширинного текста, Inter для UI
- **Цвета:** Тёмная тема по умолчанию с золотым (#e2b714) и оранжевым (#ff6b35) акцентами
- **Анимации:** Плавные переходы (0.15s–0.4s), fade-in/up эффекты
- **Дизайн:** Минималистичный интерфейс с blur-эффектами и градиентными свечениями

## Расширяемость

Проект использует модульную архитектуру:
- UI компоненты изолированы в `app/components/ui/`
- Логика печати вынесена в переиспользуемый хук `useTyping()`
- Страницы режимов независимы и могут быть расширены

## TODO для полной функциональности

- [ ] Добавить `package.json` с зависимостями
- [ ] Настроить `vite.config.ts`
- [ ] Добавить `tsconfig.json`
- [ ] Интегрировать бэкенд для сохранения прогресса
- [ ] Добавить авторизацию пользователей
- [ ] Реализовать leaderboard
- [ ] Поддержка кириллической раскладки
