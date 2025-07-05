# Express Middleware App с MongoDB Atlas

## Описание

Учебный проект на Node.js и Express.js, демонстрирующий:
- работу с middleware,
- авторизацию через Passport,
- интеграцию с MongoDB Atlas (через Mongoose),
- шаблоны PUG и EJS,
- CRUD для пользователей и статей,
- работу с сессиями, cookies и темами оформления.

---

## Технологии

- Node.js 18+
- Express.js
- MongoDB Atlas (через Mongoose)
- Passport.js (Local стратегия)
- express-session, cookie-parser
- celebrate/Joi (валидация)
- PUG и EJS (шаблоны)

---

## Установка и запуск

1. **Клонируйте репозиторий и установите зависимости:**
   ```bash
   git clone <your-repository-url>
   cd express-middleware-app
   npm install
   ```

2. **Настройте подключение к MongoDB Atlas:**
   - Откройте файл `src/config/config.mjs`.
   - Впишите свой connection string в поле `URI`:
     ```js
     const CONFIG = {
       URI: 'mongodb+srv://username:password@cluster.mongodb.net/express-middleware-app?retryWrites=true&w=majority'
     }
     export { CONFIG }
     ```
   - Замените `username`, `password` и `cluster` на свои данные из MongoDB Atlas.

3. **Настройте параметры приложения:**
   - Для смены секретного ключа сессии, порта или режима окружения (development/production), измените значения непосредственно в коде (`src/app.mjs`) или передайте переменные окружения при запуске:
     - `SESSION_SECRET` — секрет для сессий (по умолчанию 'your-session-secret')
     - `NODE_ENV` — режим окружения (по умолчанию 'development')
     - `PORT` — порт сервера (по умолчанию 3000)

4. **Инициализируйте базу данных тестовыми данными:**
   ```bash
   npm run init-db
   ```

5. **Запустите приложение:**
   ```bash
   npm run dev
   ```
   Сервер будет доступен на http://localhost:3000

---

## Основные маршруты

### Корневой маршрут

- `GET /`  
  Главная страница (dashboard, PUG): отображает статистику, 3 пользователей и 3 статьи.

### Аутентификация (`/auth`)

- `POST /auth/register` — регистрация пользователя
- `POST /auth/login` — вход пользователя
- `POST /auth/logout` — выход
- `GET /auth/protected` — защищённый маршрут (требует авторизации)

### Пользователи (`/users`)

- `GET /users` — список пользователей (PUG)
- `GET /users/:id` — детали пользователя (PUG)
- `POST /users` — создать пользователя (JSON)
- `PUT /users/:id` — обновить пользователя (JSON)
- `DELETE /users/:id` — удалить пользователя (JSON)

### Статьи (`/articles`)

- `GET /articles` — список статей (EJS)
- `GET /articles/:id` — детали статьи (EJS)
- `POST /articles` — создать статью (JSON, требует прав администратора)
- `PUT /articles/:id` — обновить статью (JSON, требует прав администратора)
- `DELETE /articles/:id` — удалить статью (JSON, требует прав администратора)
- `GET /articles/tags/:tag` — поиск статей по тегу (JSON)
- `GET /articles/stats/statistics` — статистика статей (JSON)

### Оптимизированные маршруты для работы с большими объемами данных

#### Курсоры для эффективной обработки данных

**GET /articles/cursor** — получение статей через курсор (для больших объемов данных)
- **Параметры запроса:**
  - `limit` (опционально) — количество статей (по умолчанию 50)
  - `status` (опционально) — статус статей (по умолчанию 'published')
- **Пример запроса:**
  ```bash
  GET /articles/cursor?limit=100&status=published
  ```
- **Пример ответа:**
  ```json
  {
    "message": "Статьи получены через курсор",
    "count": 100,
    "articles": [
      {
        "_id": "...",
        "title": "Заголовок статьи",
        "content": "Полный текст статьи...",
        "excerpt": "Первые 150 символов...",
        "author": { "name": "Автор", "email": "author@example.com" },
        "tags": ["tag1", "tag2"],
        "status": "published",
        "publishedAt": "2024-01-15T10:30:00Z"
      }
    ]
  }
  ```

**POST /articles/cursor/process** — пакетная обработка статей через курсор
- **Тело запроса:**
  ```json
  {
    "batchSize": 10,
    "operation": "analyze"
  }
  ```
- **Операции:**
  - `analyze` — анализ статей (статистика по батчам)
  - `export` — экспорт статей (упрощенный формат)
- **Пример ответа:**
  ```json
  {
    "message": "Обработка через курсор завершена",
    "operation": "analyze",
    "batchSize": 10,
    "totalProcessed": 150,
    "batches": 15,
    "results": [
      {
        "batchNumber": 1,
        "count": 10,
        "avgContentLength": 1250.5,
        "tags": ["javascript", "express", "mongodb"],
        "statuses": ["published", "draft"]
      }
    ]
  }
  ```

**GET /articles/cursor/tags/:tag** — получение статей по тегу через курсор
- **Параметры запроса:**
  - `limit` (опционально) — количество статей (по умолчанию 50)
- **Пример запроса:**
  ```bash
  GET /articles/cursor/tags/javascript?limit=25
  ```

#### Агрегационные запросы для сложной аналитики

**GET /articles/stats/advanced** — расширенная статистика с агрегационными запросами
- **Возвращает:**
  - Статистику по статусам с информацией об авторах
  - Топ-10 популярных тегов
  - Месячную динамику публикаций
  - Общую сводку
- **Пример ответа:**
  ```json
  {
    "message": "Расширенная статистика получена",
    "stats": {
      "byStatus": [
        {
          "status": "published",
          "authorStats": [
            {
              "role": "admin",
              "count": 25,
              "avgContentLength": 1200.5,
              "totalContentLength": 30012.5
            }
          ],
          "totalCount": 45,
          "uniqueTagsCount": 15
        }
      ],
      "topTags": [
        { "_id": "javascript", "count": 12 },
        { "_id": "express", "count": 8 }
      ],
      "monthlyTrend": [
        { "_id": { "year": 2024, "month": 1 }, "count": 15 }
      ],
      "summary": {
        "totalArticles": 45,
        "totalTags": 15,
        "averageContentLength": 1150.3
      }
    }
  }
  ```

**GET /articles/stats/authors** — статистика активности авторов
- **Возвращает:**
  - Количество статей каждого автора
  - Распределение по статусам
  - Статистику по длине контента
  - Период активности
- **Пример ответа:**
  ```json
  {
    "message": "Статистика активности авторов получена",
    "authors": [
      {
        "authorName": "Иван Петров",
        "authorEmail": "ivan@example.com",
        "authorRole": "admin",
        "totalArticles": 15,
        "publishedArticles": 12,
        "draftArticles": 2,
        "archivedArticles": 1,
        "totalContentLength": 18000,
        "avgContentLength": 1200,
        "uniqueTagsCount": 8,
        "firstArticle": "2024-01-01T00:00:00Z",
        "lastArticle": "2024-01-15T00:00:00Z",
        "activityPeriod": 14
      }
    ]
  }
  ```

**GET /articles/stats/tags** — статистика популярности тегов
- **Возвращает:**
  - Количество статей с каждым тегом
  - Распределение по статусам
  - Среднюю длину контента для тега
- **Пример ответа:**
  ```json
  {
    "message": "Статистика популярности тегов получена",
    "tags": [
      {
        "tag": "javascript",
        "count": 12,
        "articlesCount": 12,
        "avgContentLength": 1250.5,
        "publishedCount": 10,
        "draftCount": 1,
        "archivedCount": 1
      }
    ]
  }
  ```

**POST /articles/stats/custom** — кастомный агрегационный запрос
- **Тело запроса:**
  ```json
  {
    "pipeline": [
      { "$match": { "status": "published" } },
      { "$group": { "_id": "$author", "count": { "$sum": 1 } } },
      { "$sort": { "count": -1 } },
      { "$limit": 5 }
    ]
  }
  ```
- **Пример ответа:**
  ```json
  {
    "message": "Кастомный агрегационный запрос выполнен",
    "pipeline": [...],
    "result": [
      { "_id": "author_id", "count": 15 }
    ],
    "count": 1
  }
  ```

### Темы оформления

- `POST /theme`  
  Установить тему (`dark` или `light`). Тема сохраняется в httpOnly cookie.

---

## CRUD маршруты для статей (MongoDB Atlas)

### Добавление одной статьи
- **POST /articles**
- Тело запроса:
```json
{
  "title": "Заголовок",
  "content": "Текст статьи",
  "tags": ["tag1", "tag2"]
}
```
- Пример ответа:
```json
{
  "message": "Статья создана",
  "article": { /* ... */ }
}
```



### Обновление одной статьи
- **PUT /articles/:id**
- Тело запроса:
```json
{
  "title": "Новый заголовок"
}
```
- Пример ответа:
```json
{
  "message": "Статья обновлена",
  "article": { /* ... */ }
}
```





### Удаление одной статьи
- **DELETE /articles/:id**
- Пример ответа:
```json
{
  "message": "Статья успешно удалена"
}
```





---

## Структура проекта

```
src/
  app.mjs                    # Основной файл приложения
  config/
    config.mjs               # Конфиг с URI MongoDB Atlas (захардкожен)
    database.mjs             # Подключение к MongoDB через Mongoose
  models/
    User.mjs                 # Модель пользователя
    Article.mjs              # Модель статьи
  services/
    userService.mjs          # Логика для пользователей
    articleService.mjs       # Логика для статей
  scripts/
    initDb.mjs               # Скрипт инициализации БД
  public/
    favicon.ico              # Иконка сайта
  views/
    pug/                     # PUG шаблоны (dashboard, users, userDetails, layout)
    ejs/                     # EJS шаблоны (articles, articleDetails, layout)
  routes/
    index.mjs                # Подключение всех маршрутов
    root.mjs                 # Корневой маршрут (GET /)
    auth.mjs                 # Аутентификация
    users.mjs                # Пользователи
    articles.mjs             # Статьи
  middleware/
    theme.mjs                # Middleware для темы
    passport.mjs             # Passport конфиг
    checkArticleAccess.mjs   # Контроль доступа к статьям
  validators/
    userValidation.mjs       # Валидация пользователей
    articleValidation.mjs    # Валидация статей
    authValidation.mjs       # Валидация авторизации
```

---

## Технические детали оптимизации

### Курсоры MongoDB

Курсоры позволяют обрабатывать большие объемы данных без загрузки всех документов в память одновременно. Это особенно важно для приложений с большими коллекциями данных.

#### Преимущества использования курсоров:

1. **Эффективное использование памяти:**
   - Обычный запрос: `Article.find()` загружает все документы в память
   - Курсор: обрабатывает документы по одному или небольшими батчами

2. **Лучшая производительность:**
   - Снижение времени отклика сервера
   - Более стабильная работа при больших объемах данных
   - Возможность обработки данных в реальном времени

3. **Масштабируемость:**
   - Приложение может работать с коллекциями любого размера
   - Нет ограничений по памяти на количество обрабатываемых документов

#### Реализация курсоров в проекте:

```javascript
// Создание курсора
const cursor = Article.find(filter).cursor(options)

// Обработка документов по одному
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  // Обработка документа
}

// Закрытие курсора
await cursor.close()
```

### Агрегационные запросы MongoDB

Агрегационные запросы позволяют выполнять сложные операции анализа данных непосредственно в базе данных, что значительно повышает производительность.

#### Типы агрегационных операций:

1. **$lookup** — объединение данных из разных коллекций
2. **$group** — группировка документов по заданным критериям
3. **$match** — фильтрация документов
4. **$project** — выборка и преобразование полей
5. **$sort** — сортировка результатов
6. **$limit** — ограничение количества результатов

#### Примеры агрегационных запросов в проекте:

**Анализ активности авторов:**
```javascript
const pipeline = [
  {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'authorInfo'
    }
  },
  {
    $group: {
      _id: '$author',
      totalArticles: { $sum: 1 },
      avgContentLength: { $avg: { $strLenCP: '$content' } }
    }
  }
]
```

**Статистика по тегам:**
```javascript
const pipeline = [
  { $unwind: '$tags' },
  {
    $group: {
      _id: '$tags',
      count: { $sum: 1 },
      avgContentLength: { $avg: { $strLenCP: '$content' } }
    }
  }
]
```

### Оптимизация производительности

#### Индексы для ускорения запросов:

```javascript
// Текстовый поиск
articleSchema.index({ title: 'text', content: 'text' })

// Составные индексы для сложных запросов
articleSchema.index({ author: 1, publishedAt: -1 })
articleSchema.index({ status: 1, publishedAt: -1 })
```

#### Пакетная обработка:

```javascript
// Обработка данных батчами для снижения нагрузки на память
static async processArticlesWithCursor(batchSize = 10, processor) {
  const cursor = this.getArticlesCursor()
  const results = []
  let batch = []
  
  for (let article = await cursor.next(); article != null; article = await cursor.next()) {
    batch.push(article)
    
    if (batch.length >= batchSize) {
      const batchResult = await processor(batch)
      results.push(batchResult)
      batch = []
    }
  }
  
  return { results, totalProcessed }
}
```

### Сравнение производительности

| Метод | Память | Время отклика | Масштабируемость |
|-------|--------|---------------|------------------|
| Обычный запрос | Высокое | Медленное | Ограниченная |
| Курсор | Низкое | Быстрое | Высокая |
| Агрегация | Среднее | Очень быстрое | Высокая |

---

## Валидация и безопасность

- Все входные данные валидируются через celebrate/Joi и схемы Mongoose.
- Для защищённых маршрутов используется Passport и express-session.
- Контроль доступа к статьям реализован через middleware.

---

## Примеры запросов

**Регистрация:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "12345"}'
```

**Вход:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "12345"}' \
  -c cookies.txt
```

**Создание статьи (админ):**
```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{"title": "Новая статья", "content": "Текст", "tags": ["test"]}'
```

---

## Тестирование новых маршрутов с курсорами и агрегационными запросами

### Тестирование курсоров

**1. Получение статей через курсор:**
```bash
# Получить 50 статей через курсор
curl -X GET "http://localhost:3000/articles/cursor"

# Получить 100 опубликованных статей
curl -X GET "http://localhost:3000/articles/cursor?limit=100&status=published"

# Получить черновики через курсор
curl -X GET "http://localhost:3000/articles/cursor?status=draft"
```

**2. Пакетная обработка статей:**
```bash
# Анализ статей батчами по 10 штук
curl -X POST http://localhost:3000/articles/cursor/process \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 10, "operation": "analyze"}'

# Экспорт статей батчами по 5 штук
curl -X POST http://localhost:3000/articles/cursor/process \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 5, "operation": "export"}'
```

**3. Получение статей по тегу через курсор:**
```bash
# Получить статьи с тегом "javascript"
curl -X GET "http://localhost:3000/articles/cursor/tags/javascript"

# Получить 25 статей с тегом "express"
curl -X GET "http://localhost:3000/articles/cursor/tags/express?limit=25"
```

### Тестирование агрегационных запросов

**1. Расширенная статистика:**
```bash
curl -X GET http://localhost:3000/articles/stats/advanced
```

**Ожидаемый ответ:**
```json
{
  "message": "Расширенная статистика получена",
  "stats": {
    "byStatus": [...],
    "topTags": [...],
    "monthlyTrend": [...],
    "summary": {
      "totalArticles": 45,
      "totalTags": 15,
      "averageContentLength": 1150.3
    }
  }
}
```

**2. Статистика активности авторов:**
```bash
curl -X GET http://localhost:3000/articles/stats/authors
```

**Ожидаемый ответ:**
```json
{
  "message": "Статистика активности авторов получена",
  "authors": [
    {
      "authorName": "Иван Петров",
      "authorEmail": "ivan@example.com",
      "authorRole": "admin",
      "totalArticles": 15,
      "publishedArticles": 12,
      "draftArticles": 2,
      "archivedArticles": 1,
      "totalContentLength": 18000,
      "avgContentLength": 1200,
      "uniqueTagsCount": 8,
      "firstArticle": "2024-01-01T00:00:00Z",
      "lastArticle": "2024-01-15T00:00:00Z",
      "activityPeriod": 14
    }
  ]
}
```

**3. Статистика популярности тегов:**
```bash
curl -X GET http://localhost:3000/articles/stats/tags
```

**Ожидаемый ответ:**
```json
{
  "message": "Статистика популярности тегов получена",
  "tags": [
    {
      "tag": "javascript",
      "count": 12,
      "articlesCount": 12,
      "avgContentLength": 1250.5,
      "publishedCount": 10,
      "draftCount": 1,
      "archivedCount": 1
    }
  ]
}
```

**4. Кастомный агрегационный запрос:**
```bash
# Получить топ-5 авторов по количеству статей
curl -X POST http://localhost:3000/articles/stats/custom \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline": [
      {"$match": {"status": "published"}},
      {"$group": {"_id": "$author", "count": {"$sum": 1}}},
      {"$sort": {"count": -1}},
      {"$limit": 5}
    ]
  }'

# Получить среднюю длину контента по статусам
curl -X POST http://localhost:3000/articles/stats/custom \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline": [
      {"$group": {
        "_id": "$status",
        "avgLength": {"$avg": {"$strLenCP": "$content"}},
        "count": {"$sum": 1}
      }},
      {"$sort": {"count": -1}}
    ]
  }'

# Получить статистику по месяцам
curl -X POST http://localhost:3000/articles/stats/custom \
  -H "Content-Type: application/json" \
  -d '{
    "pipeline": [
      {"$group": {
        "_id": {
          "year": {"$year": "$publishedAt"},
          "month": {"$month": "$publishedAt"}
        },
        "count": {"$sum": 1}
      }},
      {"$sort": {"_id.year": -1, "_id.month": -1}},
      {"$limit": 12}
    ]
  }'
```

### Проверка производительности

**Сравнение обычного запроса и курсора:**

1. **Обычный запрос (загружает все данные в память):**
```bash
time curl -X GET http://localhost:3000/articles
```

2. **Запрос через курсор (обрабатывает данные потоково):**
```bash
time curl -X GET http://localhost:3000/articles/cursor?limit=1000
```

**Ожидаемые результаты:**
- Курсор должен работать быстрее при больших объемах данных
- Потребление памяти должно быть значительно ниже
- Время отклика должно быть более стабильным

### Тестирование с большими объемами данных

Для тестирования производительности с большими объемами данных можно использовать скрипт инициализации БД:

```bash
# Запустить скрипт для создания тестовых данных
npm run init-db

# Затем протестировать новые маршруты
curl -X GET http://localhost:3000/articles/cursor?limit=1000
curl -X POST http://localhost:3000/articles/cursor/process \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 50, "operation": "analyze"}'
```

---

## Требования

- Node.js 18+
- npm
- Аккаунт MongoDB Atlas

---

## Автор

Студент курса Fullstack JS

---

## Логирование запросов

В приложении реализовано middleware для логирования всех HTTP-запросов. Каждый запрос выводится в консоль в формате:

```
YYYY-MM-DDTHH:mm:ss.sssZ - METHOD request to /route
```

Пример:
```
2024-05-01T12:34:56.789Z - GET request to /articles
```

Middleware находится в `src/app.mjs`:
```js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`)
  next()
})
```

---

## Создание статей и заголовок x-user-id

Для создания статьи требуется указать идентификатор пользователя-автора через HTTP-заголовок `x-user-id`:

```
POST /articles
x-user-id: <userId>
Content-Type: application/json

{
  "title": "Заголовок статьи",
  "content": "Текст статьи"
}
```

Если заголовок не указан, используется временный ID для демонстрации.

---

## Виртуальное поле excerpt и метод toPublicJSON в Article

В модели Article реализовано виртуальное поле `excerpt`, возвращающее первые 150 символов контента (или весь текст, если он короче):

```js
articleSchema.virtual('excerpt').get(function() {
  return this.content.length > 150 
    ? this.content.substring(0, 150) + '...' 
    : this.content
})
```

Также реализован метод `toPublicJSON`, который возвращает публичные данные статьи, включая excerpt:

```js
articleSchema.methods.toPublicJSON = function() {
  const article = this.toObject()
  return {
    id: article._id,
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    tags: article.tags,
    status: article.status,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt
  }
}
```

Пример результата:
```json
{
  "id": "...",
  "title": "Заголовок",
  "content": "Полный текст...",
  "excerpt": "Первые 150 символов...",
  "tags": ["tag1", "tag2"],
  "status": "published",
  "publishedAt": "2024-05-01T12:00:00.000Z",
  "updatedAt": "2024-05-01T12:00:00.000Z"
}
```

---

