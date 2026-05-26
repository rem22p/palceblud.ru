# 🎹 пальцеблуд.рф — Клавиатурный тренажёр

**Современный веб-тренажёр слепой печати на React 19 + Vite 6 + TypeScript**

---

## 📋 Обзор проекта

**пальцеблуд.рф** — это SPA (Single Page Application) для обучения слепой печати и развития скорости набора текста.

### Основные возможности:
- **Practice Mode** — свободная печать с таймером (15s/30s/60s/120s)
- **Learning Mode** — 6 структурированных уроков от базовой раскладки до скоростной печати
- **Real-time статистика** — WPM, точность, прогресс
- **Тёмная тема** с золотым акцентом (#e2b714)
- **Адаптивный дизайн** для всех устройств

---

## 🛠️ Технологический стек

| Категория | Технология | Версия |
|-----------|------------|--------|
| **Фреймворк** | React 19 | 19.0.0 |
| **Язык** | TypeScript | 5.7 |
| **Сборщик** | Vite | 6.1.1 |
| **Роутинг** | React Router | 7.2.0 |
| **Стили** | Tailwind CSS | 4.0.8 |
| **Иконки** | Lucide React | 0.475.0 |
| **UI компоненты** | shadcn/ui | latest |
| **Шрифты** | JetBrains Mono, Inter | — |

---

## 📁 Структура проекта

```
palceblud/
├── 📄 index.html              # Точка входа
├── 📦 package.json            # Зависимости и скрипты
├── ⚙️ vite.config.ts          # Конфигурация Vite
├── 📘 tsconfig.json           # Конфигурация TypeScript
├── .gitignore                 # Игнор для Git
│
├── 📂 app/                    # Исходный код React
│   ├── App.tsx                # Корневой компонент (роутер)
│   ├── main.tsx               # Входная точка (рендер)
│   ├── routes.tsx             # Маршруты
│   │
│   ├── 📂 components/         # UI компоненты
│   │   ├── Layout.tsx         # Layout с ModeHeader
│   │   ├── ModeHeader.tsx     # Шапка с переключателем режимов
│   │   ├── TypingCore.tsx     # Хук useTyping + компонент TypingDisplay
│   │   ├── SettingsDropdown.tsx # Выпадающее меню настроек
│   │   │
│   │   ├── 📂 ui/             # shadcn/ui компоненты (40+ файлов)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   │
│   │   └── 📂 figma/          # Figma компоненты
│   │
│   └── 📂 pages/              # Страницы приложения
│       ├── PracticeMode.tsx   # Режим практики
│       └── LearningMode.tsx   # Режим обучения
│
└── 📂 styles/                 # CSS файлы
    ├── index.css              # Главный файл (импорты)
    ├── tailwind.css           # Tailwind директивы
    ├── theme.css              # CSS переменные темы
    ├── fonts.css              # Подключение шрифтов
    └── animations.css         # Keyframes анимации
```

---

## 🚀 Запуск и разработка

### Установка зависимостей
```bash
npm install
```

### Запуск dev-сервера
```bash
npm run dev
# Откроется http://localhost:5173
```

### Сборка для продакшена
```bash
npm run build
```

### Предпросмотр продакшен сборки
```bash
npm run preview
```

### Линтинг
```bash
npm run lint
```

---

## 🏗️ Архитектура

### Компонентная иерархия

```
App.tsx (RouterProvider)
  └── routes.tsx
      └── Layout.tsx
          ├── ModeHeader.tsx (шапка с переключателем)
          └── Outlet (страницы)
              ├── PracticeMode.tsx
              └── LearningMode.tsx
```

### Ключевые компоненты

#### `TypingCore.tsx`
Центральная логика печати:
- `useTyping(text, timeLimit)` — хук управления состоянием (WPM, точность, таймер)
- `TypingDisplay` — компонент отображения текста с подсветкой ошибок

**Оптимизации:**
- `useMemo` для `text.split("")` — кэширование разбиения текста
- `useCallback` для `focusInput` — стабильная ссылка
- Keyframes вынесены в `styles/animations.css`

#### `PracticeMode.tsx`
- Генерация случайных слов из WORD_POOL
- Плавающие статистические индикаторы
- Результат overlay с детальной статистикой

**Оптимизации:**
- `useCallback` для `handleRestart`
- Правильные зависимости в `useEffect`

#### `LearningMode.tsx`
- 6 уроков с прогрессией сложности
- Step indicator для навигации
- Sidebar с прогрессом и подсказками

---

## 🎨 Стилевые соглашения

### CSS переменные (theme.css)
```css
:root {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --accent: #e2b714;  /* Золотой акцент */
}
```

### Tailwind CSS v4
- Native CSS import (без конфига)
- `@source` для сканирования файлов
- Утилитарные классы для layout

### Шрифты
- **JetBrains Mono** — моноширинный для текста
- **Inter** — UI элементы

---

## 📝 Development Conventions

### TypeScript
- `strict: true` — строгая типизация
- `noUnusedLocals: true` — нет неиспользуемым переменным
- `noUnusedParameters: true` — нет неиспользуемым параметрам

### Код-стайл
- Функциональные компоненты с TypeScript интерфейсами
- `useCallback` / `useMemo` для оптимизации
- Вынос стилей в отдельные CSS файлы (не `<style>` в JSX)

### Структура компонентов
```typescript
// 1. Импорты
import { useState } from "react";

// 2. Типы
interface Props {
  onSettingsClick?: () => void;
}

// 3. Компонент
export function Component({ prop }: Props) {
  // 4. Хуки
  const [state, setState] = useState();
  
  // 5. Логика
  
  // 6. JSX
  return <div />;
}
```

---

## 🔧 Конфигурация

### Vite (vite.config.ts)
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
      '@ui': path.resolve(__dirname, './app/components/ui'),
    },
  },
  server: { port: 5173, open: true },
});
```

### TypeScript (tsconfig.json)
- Target: ES2022
- Module: ESNext
- Module Resolution: bundler
- Paths: `@/*` → `./app/*`

---

## 📊 Производительность

### Применённые оптимизации:
1. **Мемоизация** — `useMemo` для тяжёлых вычислений
2. **Стабильные ссылки** — `useCallback` для функций
3. **Code splitting** — роутинг через React Router
4. **CSS вынесен** — анимации в отдельном файле
5. **Компоненты вынесены** — SettingsDropdown отдельно

### Метрики для отслеживания:
- FCP < 1.5s
- LCP < 2.5s
- TTI < 3.5s
- 60 FPS при печати

---

## 🗂️ Неиспользуемые файлы

Следующие компоненты **не используются** в текущей версии:
- `ZoneSelector.tsx` — заготовка для страницы выбора режимов
- `Header.tsx` — альтернативная шапка
- `Footer.tsx` — подвал (не добавлен в Layout)
- `ProfileStats.tsx` — статистика профиля
- `SettingsPanel.tsx` — боковая панель настроек
- `StatsBar.tsx` — панель статистики
- `TypingInterface.tsx` — альтернативный интерфейс печати
- `app/components/ui/*` — 40+ shadcn/ui компонентов (можно удалить)

---

## 📈 Roadmap

### Ближайшие задачи:
- [ ] Русские слова в WORD_POOL
- [ ] Сохранение прогресса (localStorage)
- [ ] Таблица лидеров
- [ ] Пользовательские тексты
- [ ] Звуковая обратная связь

### Долгосрочные:
- [ ] Бэкенд для синхронизации
- [ ] Авторизация пользователей
- [ ] Multiplayer режим
- [ ] Экспорт статистики

---

## 📄 Лицензия

MIT

---

**Сделано с ⌨️ для тех, кто любит печатать**
