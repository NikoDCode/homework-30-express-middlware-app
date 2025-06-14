# Express Server with Multiple Template Engines

Веб-сервер на Express.js з підтримкою двох шаблонізаторів (PUG та EJS), валідацією даних та системою контролю доступу.

## 📋 Функціональність

- **Користувачі (Users)** - CRUD операції з валідацією та відображенням через PUG шаблони
- **Статті (Articles)** - CRUD операції з контролем доступу та відображенням через EJS шаблони
- **Валідація даних** - Використання Joi та Celebrate для валідації запитів
- **Контроль доступу** - Middleware для перевірки прав адміністратора
- **Двомовна підтримка шаблонів** - PUG для користувачів, EJS для статей

## 🚀 Встановлення та запуск

### Передумови

- Node.js версії 14 або вище
- npm або yarn

### Крок 1: Клонування репозиторію

```bash
git clone <repository-url>
cd express-server
```

### Крок 2: Встановлення залежностей

```bash
npm install
```

### Крок 3: Запуск сервера

```bash
npm start
# або
node app.mjs
```

Сервер запуститься на порту **3000**. Перейдіть за адресою: `http://localhost:3000`

## 📦 Залежності

```json
{
  "express": "^4.x.x",
  "celebrate": "^15.x.x",
  "joi": "^17.x.x",
  "ejs": "^3.x.x",
  "pug": "^3.x.x"
}
```

## 🗂️ Структура проекту

```
├── app.mjs                 # Головний файл серверу
├── routes/
│   ├── index.mjs          # Головний роутер
│   ├── root.mjs           # Маршрути кореневої сторінки
│   ├── users.mjs          # Маршрути користувачів
│   └── articles.mjs       # Маршрути статей
├── controllers/
│   ├── root.mjs           # Контролери кореневої сторінки
│   ├── users.mjs          # Контролери користувачів
│   └── articles.mjs       # Контролери статей
├── validators/
│   └── userValidation.mjs # Валідатори для користувачів
└── views/
    ├── pug/
    │   ├── users.pug      # Список користувачів
    │   └── userDetails.pug # Деталі користувача
    └── ejs/
        ├── articles.ejs    # Список статей
        └── articleDetails.ejs # Деталі статті
```

## 🛣️ API Маршрути

### Коренева сторінка

| Метод | Шлях | Опис             | Контролер        |
| ----- | ---- | ---------------- | ---------------- |
| `GET` | `/`  | Головна сторінка | `getRootHandler` |

**Приклад відповіді:**

```
Response from Express root handler
```

---

### Користувачі (Users)

Використовує **PUG** шаблони для відображення

| Метод    | Шлях             | Опис                      | Валідація                                  | Контролер               |
| -------- | ---------------- | ------------------------- | ------------------------------------------ | ----------------------- |
| `GET`    | `/users`         | Список користувачів (PUG) | -                                          | Рендеринг PUG шаблону   |
| `GET`    | `/users/:userId` | Деталі користувача (PUG)  | `validateParamsUserId`                     | Рендеринг PUG шаблону   |
| `POST`   | `/users`         | Створити користувача      | `validateUserBody`                         | `postUsersHandler`      |
| `PUT`    | `/users/:userId` | Оновити користувача       | `validateParamsUserId`, `validateUserBody` | `putUserByIdHandler`    |
| `DELETE` | `/users/:userId` | Видалити користувача      | `validateParamsUserId`                     | `deleteUserByIdHandler` |

**Схема валідації користувача:**

```javascript
{
  name: string, // 3-30 символів, обов'язковий
  email: string, // валідний email, обов'язковий
  age: number // 0-100, обов'язковий
}
```

**Приклад запиту POST /users:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

---

### Статті (Articles)

Використовує **EJS** шаблони для відображення  
⚠️ **Потребує прав адміністратора** (заголовок `x-user-role: admin`)

| Метод    | Шлях                   | Опис                | Middleware           | Контролер                  |
| -------- | ---------------------- | ------------------- | -------------------- | -------------------------- |
| `GET`    | `/articles`            | Список статей (EJS) | `checkArticleAccess` | Рендеринг EJS шаблону      |
| `GET`    | `/articles/:articleId` | Деталі статті (EJS) | `checkArticleAccess` | Рендеринг EJS шаблону      |
| `POST`   | `/articles`            | Створити статтю     | `checkArticleAccess` | `postArticlesHandler`      |
| `PUT`    | `/articles/:articleId` | Оновити статтю      | `checkArticleAccess` | `putArticleByIdHandler`    |
| `DELETE` | `/articles/:articleId` | Видалити статтю     | `checkArticleAccess` | `deleteArticleByIdHandler` |

**Заголовок авторизації:**

```
x-user-role: admin
```

**Приклад помилки доступу:**

```
HTTP 403 - Access denied. Insufficient permissions.
```

## 🎨 Шаблони

### PUG Шаблони (Користувачі)

- **users.pug** - Відображає список користувачів з іменами та email
- **userDetails.pug** - Показує детальну інформацію про користувача

### EJS Шаблони (Статті)

- **articles.ejs** - Відображає список статей з градієнтним дизайном
- **articleDetails.ejs** - Показує детальну інформацію про статтю

## 🔒 Система безпеки

### Middleware контролю доступу

Статті захищені middleware `checkArticleAccess`, який перевіряє:

- Наявність заголовка `x-user-role`
- Значення заголовка має дорівнювати `admin`

### Валідація даних

- Використовується бібліотека **Joi** для створення схем валідації
- **Celebrate** інтегрує Joi з Express для автоматичної валідації
- Валідуються як параметри URL, так і тіло запиту

## 🐛 Обробка помилок

### Типи помилок

1. **Помилки валідації** - обробляються middleware `celebrate.errors()`
2. **Помилки доступу** - HTTP 403 для відсутності прав
3. **Загальні помилки** - централізована обробка з логуванням

### Формат відповіді про помилка

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation error message"
}
```

## 📝 Логування

Сервер логує всі HTTP запити у форматі:

```
2024-01-15T10:30:45.123Z - GET request to /users
```

## 🧪 Тестування API

### Приклади запитів

**Отримати список користувачів:**

```bash
curl -X GET http://localhost:3000/users
```

**Створити користувача:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","age":30}'
```

**Отримати статті (потрібні права адміна):**

```bash
curl -X GET http://localhost:3000/articles \
  -H "x-user-role: admin"
```

**Створити статтю:**

```bash
curl -X POST http://localhost:3000/articles \
  -H "Content-Type: application/json" \
  -H "x-user-role: admin" \
  -d '{"title":"New Article","content":"Article content"}'
```

## 🔧 Налаштування

### Порт сервера

За замовчуванням сервер працює на порту **3000**. Для зміни порту відредагуйте файл `app.mjs`:

```javascript
const PORT = process.env.PORT || 3000
```

### Шляхи до шаблонів

Шаблони знаходяться в папці `views/`:

- PUG шаблони: `views/pug/`
- EJS шаблони: `views/ejs/`

## 🤝 Розробка

### Додавання нових маршрутів

1. Створіть контролер в папці `controllers/`
2. Додайте маршрути в папку `routes/`
3. Підключіть маршрути в `routes/index.mjs`

### Додавання валідації

1. Створіть схему валідації в папці `validators/`
2. Використайте `celebrate()` для підключення валідації до маршруту

## 📄 Ліцензія

MIT License

## 👨‍💻 Автор

Розроблено як демонстрація можливостей Express.js з різними шаблонізаторами та системами валідації.
