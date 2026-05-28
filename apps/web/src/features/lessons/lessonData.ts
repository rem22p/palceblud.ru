export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  /** Lines to type, each string is one line the user must complete */
  steps: string[];
}

// ─── English QWERTY lessons ───

export const EN_LESSONS: Lesson[] = [
  {
    id: "en-01",
    title: "Home Row",
    description: "Learn the resting position. Place your fingers on ASDF and JKL;.",
    difficulty: "beginner",
    steps: [
      "asdf jkl; asdf jkl; asdf jkl;",
      "fj fj fj dk dk dk sl sl sl a; a; a;",
      "asdf jkl; fj dk sl a; asdf jkl;",
      "fads jlk; sadf ;lkj fdsa ;jkl",
      "asdfg hjkl; asdfg hjkl; fghj fghj",
    ],
  },
  {
    id: "en-02",
    title: "Home Row Extended",
    description: "Add G and H to your home row practice.",
    difficulty: "beginner",
    steps: [
      "asdfg hjkl; asdfg hjkl;",
      "fg fg fg jh jh jh gh gh gh",
      "gas had jag half flag hash",
      "flash glass shall flags lash",
      "asdfghjkl; asdfghjkl; g h g h",
    ],
  },
  {
    id: "en-03",
    title: "Top Row",
    description: "Reach up to QWERTY and UIOP.",
    difficulty: "beginner",
    steps: [
      "qwer tyui qwer tyui qwer tyui",
      "ru ru ru ti ti ti we we we qp qp qp",
      "quit rope tyre wire port quiet",
      "wrote quite trip poet ripe pour",
      "qwertyuiop qwertyuiop top row done",
    ],
  },
  {
    id: "en-04",
    title: "Bottom Row",
    description: "Reach down to ZXCV and BNM.",
    difficulty: "beginner",
    steps: [
      "zxcv bnm, zxcv bnm, zxcv bnm,",
      "cv cv cv bn bn bn zm zm zm x, x, x,",
      "box van cab zebra buzz comb",
      "cabin zoom vixen banner jazz",
      "zxcvbnm,./ zxcvbnm,./ bottom done",
    ],
  },
  {
    id: "en-05",
    title: "All Rows Mixed",
    description: "Combine all three rows. Full alphabet practice.",
    difficulty: "intermediate",
    steps: [
      "quick brown fox jumps over lazy dog",
      "pack my box with five dozen liquor jugs",
      "wax job vex cwm quiz nymph frk",
      "when zombies arrive quickly fax judge",
      "heavy boxes perform quick waltz jigs",
    ],
  },
  {
    id: "en-06",
    title: "Capitals",
    description: "Practice the Shift key with capital letters.",
    difficulty: "intermediate",
    steps: [
      "The Quick Brown Fox Jumps Over The Lazy Dog",
      "Hello World This Is A Capital Test",
      "New York London Paris Tokyo Berlin Moscow",
      "JavaScript TypeScript React NextJS NodeJS Python",
      "GOOGLE APPLE MICROSOFT AMAZON META NETFLIX",
    ],
  },
  {
    id: "en-07",
    title: "Numbers",
    description: "Practice the number row 1234567890.",
    difficulty: "intermediate",
    steps: [
      "1234 5678 9012 3456 7890 1234",
      "phone 555 0123 room 404 year 2024",
      "chapter 12 verse 7 page 365 volume 9",
      "42 is the answer to life the universe and everything",
      "pi is 3.14159 speed 88mph temperature 98.6",
    ],
  },
  {
    id: "en-08",
    title: "Symbols",
    description: "Master punctuation and special characters.",
    difficulty: "intermediate",
    steps: [
      "Hello, world! How are you today? I'm fine; thanks.",
      "Price: $19.99 (50% off!) Code: #include <stdio.h>",
      "email@domain.com /usr/bin/env & url?q=search",
      "if (x > 0 && y < 10) { return x + y; } else { return 0; }",
      "A \"quote\" within 'single' quotes. Array[0] = {key: value};",
    ],
  },
  {
    id: "en-09",
    title: "Common Words",
    description: "Most frequent English words for speed building.",
    difficulty: "intermediate",
    steps: [
      "the be to of and a in that have it for not on with he as you do at",
      "this but his by from they we say her she or an will my one all would",
      "there their what so up out if about who get which go me when make can",
      "like time no just him know take people into year your good some could",
      "them see other than then now look only come its over think also back",
    ],
  },
  {
    id: "en-10",
    title: "Long Words",
    description: "Practice longer, complex words for advanced typing.",
    difficulty: "advanced",
    steps: [
      "development programming application technology experience",
      "organization communication understanding relationship",
      "international environmental infrastructure opportunity",
      "extraordinary revolutionary responsibility determination",
      "sophisticated comprehensive simultaneously concentration",
    ],
  },
  {
    id: "en-11",
    title: "Code Keywords",
    description: "Programming keywords and syntax practice.",
    difficulty: "advanced",
    steps: [
      "const let var function return async await export import default",
      "if else for while break continue switch case try catch throw finally",
      "class extends super this new typeof instanceof void null undefined",
      "interface type enum namespace module import export default require",
      "async function fetchData() { const res = await fetch(url); return res.json(); }",
    ],
  },
  {
    id: "en-12",
    title: "Paragraphs",
    description: "Full paragraphs for endurance and flow.",
    difficulty: "advanced",
    steps: [
      "The quick brown fox jumps over the lazy dog near the river bank where children play.",
      "Programming is the art of telling another human what one wants the computer to do.",
      "In the beginning the Universe was created. This has made a lot of people very angry.",
      "It is not the strongest of the species that survives but the most adaptable to change.",
      "The best time to plant a tree was twenty years ago. The second best time is now.",
    ],
  },
];

// ─── Russian ЙЦУКЕН lessons ───

export const RU_LESSONS: Lesson[] = [
  {
    id: "ru-01",
    title: "Домашний ряд",
    description: "Базовая позиция. Пальцы на ФЫВА и ОЛДЖ.",
    difficulty: "beginner",
    steps: [
      "фыва олдж фыва олдж фыва олдж",
      "ао ао ао вл вл вл ыд ыд ыд фж фж фж",
      "фыва олдж ао вл ыд фж фыва олдж",
      "выфа длож фыва ждло авыф жолд",
      "фывапр олджээ фывапр олджээ",
    ],
  },
  {
    id: "ru-02",
    title: "Домашний ряд +",
    description: "Добавляем П, Р, Э.",
    difficulty: "beginner",
    steps: [
      "фывапр олджээ фывапр олджээ",
      "рп рп рп ээ ээ ээ па па па рв рв рв",
      "пора рад жар пар эра дар",
      "продажа жара парад радар",
      "фывапролджээ фывапролджээ",
    ],
  },
  {
    id: "ru-03",
    title: "Верхний ряд",
    description: "Тянемся вверх к ЙЦУК и ЕНГШ.",
    difficulty: "beginner",
    steps: [
      "йцук енгш йцук енгш йцук енгш",
      "ук ук ук ег ег ег цн цн цн йш йш йш",
      "куй цен шут гуй еру куш",
      "шутка гений цукат шенкель",
      "йцукенгшщз йцукенгшщз верх готов",
    ],
  },
  {
    id: "ru-04",
    title: "Нижний ряд",
    description: "Тянемся вниз к ЯЧСМ и ИТЬБ.",
    difficulty: "beginner",
    steps: [
      "ячсм итьб ячсм итьб ячсм итьб",
      "см см см ит ит ит чь чь чь яб яб яб",
      "чай мяч сон мост чисто яма",
      "часть месть мост ясность семья",
      "ячсмитьбюю ячсмитьбюю низ готов",
    ],
  },
  {
    id: "ru-05",
    title: "Все ряды",
    description: "Полная клавиатура. Комбинируем все буквы.",
    difficulty: "intermediate",
    steps: [
      "съешь же ещё этих мягких французских булок да выпей чаю",
      "в чащах юга жил бы цитрус да но фальшивый экземпляр",
      "широкая электрификация южных губерний даст мощный толчок",
      "любя съешь щипцы вздохнёт мэр кайф жгуч",
      "разъярённый чтец эгоистично бьёт пятью жердями шустрого фехтовальщика",
    ],
  },
  {
    id: "ru-06",
    title: "Заглавные",
    description: "Shift + буквы для заглавных.",
    difficulty: "intermediate",
    steps: [
      "Москва Санкт Петербург Новосибирск Екатеринбург Казань",
      "Россия Беларусь Казахстан Украина Армения Грузия",
      "Пушкин Достоевский Толстой Чехов Гоголь Булгаков",
      "Яндекс Сбербанк ВТБ Газпром Роснефть Лукойл",
      "JavaScript TypeScript React Python Linux Docker",
    ],
  },
  {
    id: "ru-07",
    title: "Цифры",
    description: "Цифровой ряд 1234567890.",
    difficulty: "intermediate",
    steps: [
      "1234 5678 9012 3456 7890 1234",
      "телефон 8 800 555 35 35 квартира 42 год 2024",
      "глава 12 стих 7 страница 365 том 9 выпуск 3",
      "42 это ответ на главный вопрос жизни вселенной и всего такого",
      "пи 3.14159 скорость 120кмч температура 36.6 давление 760",
    ],
  },
  {
    id: "ru-08",
    title: "Символы",
    description: "Знаки препинания и спецсимволы.",
    difficulty: "intermediate",
    steps: [
      "Привет, мир! Как дела? Всё хорошо; спасибо.",
      "Цена: 1999₽ (скидка 50%!) Код: #include <stdio.h>",
      "почта@домен.рф /usr/bin/env & запрос?q=поиск",
      "если (x > 0 && y < 10) { вернуть x + y; } иначе { вернуть 0; }",
      "«Цитата» внутри 'кавычек'. Массив[0] = {ключ: значение};",
    ],
  },
  {
    id: "ru-09",
    title: "Частые слова",
    description: "Самые частотные русские слова.",
    difficulty: "intermediate",
    steps: [
      "и в не на я что с он а как это по но из у то за от она для",
      "мы вы они все так же ещё быть было весь может да нет или",
      "когда уже если до бы ты ему теперь даже есть очень хочу",
      "сказал чтобы была был где надо время который человек",
      "году дело день сейчас жизнь можно потому что так как этот",
    ],
  },
  {
    id: "ru-10",
    title: "Длинные слова",
    description: "Сложные длинные слова для продвинутой практики.",
    difficulty: "advanced",
    steps: [
      "программирование администрирование документирование",
      "переосвидетельствование достопримечательность",
      "соответственно использование предназначенный",
      "интеллектуальный производительность ответственность",
      "неудовлетворительный преобразовательный функционирование",
    ],
  },
  {
    id: "ru-11",
    title: "Технические термины",
    description: "IT-термины и профессиональная лексика.",
    difficulty: "advanced",
    steps: [
      "алгоритм переменная функция интерфейс компилятор отладчик",
      "микросервис контейнеризация виртуализация масштабирование",
      "шифрование аутентификация авторизация валидация сериализация",
      "маршрутизатор протокол интерфейс библиотека фреймворк репозиторий",
      "async function получитьДанные() { const ответ = await fetch(url); return ответ.json(); }",
    ],
  },
  {
    id: "ru-12",
    title: "Абзацы",
    description: "Полноценные тексты для выносливости и скорости.",
    difficulty: "advanced",
    steps: [
      "Съешь же ещё этих мягких французских булок да выпей чаю с лимоном и сахаром.",
      "Программирование это искусство объяснять другому человеку что ты хочешь от компьютера.",
      "В начале была создана Вселенная. Это многих рассердило и было признано ошибкой.",
      "Выживает не самый сильный и не самый умный а тот кто лучше всех приспосабливается к изменениям.",
      "Лучшее время посадить дерево было двадцать лет назад. Второе лучшее время сегодня.",
    ],
  },
];
