import express from 'express'
import { errors } from 'celebrate'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'
import favicon from 'serve-favicon'
import session from 'express-session'
import passport from './middleware/passport.mjs'
import { themeMiddleware } from './middleware/theme.mjs'
import router from './routes/index.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Используем переменную окружения для порта
const PORT = process.env.PORT || 3000
const app = express()

// Настройка PUG для маршрутов пользователей
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views')) // Общая папка views

// Настройка EJS
app.engine('ejs', ejs.renderFile)

// Middleware для favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// Middleware для работы с cookies
app.use(cookieParser())

// Middleware для темы
app.use(themeMiddleware)

// Настройка express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 день
  }
}))

// Инициализация Passport
app.use(passport.initialize())
app.use(passport.session())

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`)
  next()
})

// Middleware для обработки JSON
app.use(express.json())
// Middleware для обработки URL-encoded данных (для форм)
app.use(express.urlencoded({ extended: true }))

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, 'public')))

// Корневой маршрут
app.get('/', (req, res) => {
  res.send('Добро пожаловать в Express Middleware App!')
})

// Подключение маршрутов
app.use(router)

// Обработка ошибок валидации Celebrate
app.use(errors())

// Middleware для обработки ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err)
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      status: 'error',
      code: err.status || 500,
      message: err.message || 'Internal Server Error'
    })
  }
})

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})