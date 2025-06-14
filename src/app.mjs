import express from 'express'
import { errors } from 'celebrate'
import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'
import router from './routes/index.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PORT = 3000
const app = express()

// Настройка PUG для маршрутов пользователей
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views')) // Общая папка views

// Настройка EJS
app.engine('ejs', ejs.renderFile)

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} request to ${req.url}`)
  next()
})

// Middleware для обработки JSON
app.use(express.json())

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