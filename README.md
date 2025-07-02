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

