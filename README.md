# TechForWord Statistics Widget

Автоматичний віджет для відображення статистики TechForWord (курси, студенти, вебінари, інсайдери).

## Використання

### 1. Підключення скрипта

Додайте цей тег в ваш HTML (в `<head>` або перед закриваючим `</body>`):

```html
<script src="https://techforword-courses.vercel.app/techforword-stats.min.js"></script>
```

### 2. HTML структура

Переконайтеся що у вас є елементи з такими ID:

```html
<span id="courses">0</span>
<span id="students">0</span>
<span id="webinars">0</span>
<span id="insiders">0</span>
```

### 3. Автоматична ініціалізація

Скрипт автоматично ініціалізується коли DOM готовий. Нічого додаткового робити не потрібно.

## Налаштування

### Debug режим

Для включення debug логування:

```html
<script>
  window.TechForWordStats.config.debug = true;
</script>
<script src="https://techforword-courses.vercel.app/techforword-stats.min.js"></script>
```

### Ручна ініціалізація

Якщо потрібно запустити вручну:

```html
<script>
  window.TechForWordStats.init();
</script>
```

## API Endpoints

Скрипт робить запити на:

- `https://techforword-courses.vercel.app/courses` - кількість курсів
- `https://techforword-courses.vercel.app/enrollments` - кількість інсайдерів
- `https://techforword-courses.vercel.app/course` - дані курсу для вебінарів
- `https://techforword-courses.vercel.app/users` - кількість студентів

## Логіка підрахунку вебінарів

Вебінари підраховуються за пріоритетом:

### 1. Батьківська секція (найкращий варіант):

Скрипт спочатку шукає батьківську секцію що містить всі вебінари:

- "Webinars"
- "All Webinars"
- "Webinar Archive"
- "Webinar Collection"

**Якщо знайдена** - використовує кількість лекцій з цієї секції.

### 2. Fallback: Індивідуальні секції:

Якщо батьківської секції немає, використовує стару логіку:

#### Точні секції (9 основних):

1. "Branding and marketing 🎨"
2. "Productivity habits and hacks 🛠"
3. "Terminology 🔠"
4. "Writing ✍️"
5. "Translation tips 🔁"
6. "Glossaries for interpreters 📝"
7. "Interpreting tools and skills 🎧"
8. "Speech recognition 🗣"
9. "Artificial Intelligence 🤖"

#### Автоматичне виявлення нових секцій:

- `webinar`, `session`, `training`, `workshop`, `masterclass`

**Рекомендація:** Створіть батьківську секцію "Webinars" з усіма вебінарами для найпростішого підрахунку.

## Файли

- `public/techforword-stats.js` - повна версія з коментарями
- `public/techforword-stats.min.js` - мініфікована версія для продакшену
- `client-example.html` - приклад використання
- `index.html` - тестова сторінка з debug інформацією

## Розробка

Для тестування локально:

1. Запустіть локальний сервер
2. Відкрийте `index.html` для debug версії
3. Відкрийте `client-example.html` для прикладу використання

## Оновлення

Якщо клієнт змінить структуру вебінарів, оновіть масив `webinarSectionNames` в конфігурації.
