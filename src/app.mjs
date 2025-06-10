import express from 'express'
import { errors } from 'celebrate'
import router from './routes/index.mjs'

const PORT = 3000
const app = express()

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