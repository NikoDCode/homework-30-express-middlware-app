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

### Массовое добавление статей
- **POST /articles/bulk**
- Тело запроса:
```json
{
  "articles": [
    { "title": "Статья 1", "content": "Текст 1" },
    { "title": "Статья 2", "content": "Текст 2" }
  ]
}
```
- Пример ответа:
```json
{
  "message": "Статьи успешно добавлены",
  "articles": [ /* ... */ ]
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

### Массовое обновление статей
- **PATCH /articles**
- Тело запроса:
```json
{
  "filter": { "status": "draft" },
  "update": { "$set": { "status": "published" } }
}
```
- Пример ответа:
```json
{
  "message": "Статьи успешно обновлены",
  "result": { "n": 2, "nModified": 2, "ok": 1 }
}
```

### Замена одной статьи
- **PUT /articles/replace/:id**
- Тело запроса:
```json
{
  "title": "Полная замена",
  "content": "Новый текст",
  "tags": []
}
```
- Пример ответа:
```json
{
  "message": "Статья успешно заменена",
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

### Массовое удаление статей
- **DELETE /articles**
- Тело запроса:
```json
{
  "filter": { "status": "archived" }
}
```
- Пример ответа:
```json
{
  "message": "Статьи успешно удалены",
  "result": { "n": 3, "ok": 1, "deletedCount": 3 }
}
```

### Расширенный поиск с проекцией
- **POST /articles/find**
- Тело запроса:
```json
{
  "filter": { "status": "published" },
  "projection": { "title": 1, "content": 0 }
}
```
- Пример ответа:
```json
{
  "articles": [
    { "_id": "...", "title": "..." }
  ]
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

